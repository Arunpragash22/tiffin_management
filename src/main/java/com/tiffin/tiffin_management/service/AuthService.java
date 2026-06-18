package com.tiffin.tiffin_management.service;

import com.tiffin.tiffin_management.dto.request.LoginRequest;
import com.tiffin.tiffin_management.dto.request.StudentRegistrationRequest;
import com.tiffin.tiffin_management.dto.response.ApiMessageResponse;
import com.tiffin.tiffin_management.dto.response.AuthResponse;
import com.tiffin.tiffin_management.dto.response.RegistrationResponse;
import com.tiffin.tiffin_management.entity.Student;
import com.tiffin.tiffin_management.entity.User;
import com.tiffin.tiffin_management.entity.enums.Role;
import com.tiffin.tiffin_management.exception.BadRequestException;
import com.tiffin.tiffin_management.exception.UnauthorizedException;
import com.tiffin.tiffin_management.repository.StudentRepository;
import com.tiffin.tiffin_management.repository.UserRepository;
import com.tiffin.tiffin_management.security.CustomUserDetails;
import com.tiffin.tiffin_management.security.JwtService;
import com.tiffin.tiffin_management.util.FileStorageService;
import com.tiffin.tiffin_management.util.PhoneNumberUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final FileStorageService fileStorageService;
    private final EmailService emailService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.verification.expiration-hours:24}")
    private int verificationExpirationHours;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${app.mail.auto-verify-when-disabled:true}")
    private boolean autoVerifyWhenDisabled;

    @Transactional
    public RegistrationResponse registerStudent(StudentRegistrationRequest request, MultipartFile aadhaarImage) {
        String normalizedMobile = PhoneNumberUtil.normalizeSriLankanMobile(request.getMobileNumber());
        request.setMobileNumber(normalizedMobile);
        validateUniqueStudentFields(request);

        String imagePath = fileStorageService.storeAadhaarImage(aadhaarImage);
        String verificationToken = UUID.randomUUID().toString();
        boolean skipVerification = !mailEnabled && autoVerifyWhenDisabled;

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.STUDENT)
                .active(true)
                .emailVerified(skipVerification)
                .verificationToken(skipVerification ? null : verificationToken)
                .verificationTokenExpiresAt(skipVerification ? null : LocalDateTime.now().plusHours(verificationExpirationHours))
                .build();
        user = userRepository.save(user);

        Student student = Student.builder()
                .user(user)
                .fullName(request.getFullName())
                .mobileNumber(request.getMobileNumber())
                .email(request.getEmail())
                .physicalAddress(request.getPhysicalAddress())
                .aadhaarNumber(request.getAadhaarNumber())
                .aadhaarImagePath(imagePath)
                .active(true)
                .build();
        studentRepository.save(student);

        boolean emailSent = false;
        if (!skipVerification) {
            try {
                String verificationLink = frontendUrl + "/verify-email?token=" + verificationToken;
                emailService.sendVerificationEmail(user.getEmail(), student.getFullName(), verificationLink);
                emailSent = true;
            } catch (RuntimeException ex) {
                throw new BadRequestException("Registration saved but verification email could not be sent. Please contact support.");
            }
        }

        return RegistrationResponse.builder()
                .email(user.getEmail())
                .emailVerificationSent(emailSent)
                .message(skipVerification
                        ? "Registration successful. You can log in now."
                        : "Registration successful. Please check your email to verify your account.")
                .build();
    }

    @Transactional
    public ApiMessageResponse verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new BadRequestException(
                        "This verification link has already been used or is invalid. If you can log in, your email is already verified."));

        if (user.isEmailVerified()) {
            return ApiMessageResponse.builder()
                    .success(true)
                    .message("Email is already verified. You can log in.")
                    .build();
        }

        if (user.getVerificationTokenExpiresAt() != null
                && user.getVerificationTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification link has expired. Please request a new one.");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiresAt(null);
        userRepository.save(user);

        studentRepository.findByUserId(user.getId()).ifPresent(student ->
                emailService.sendWelcomeEmail(user.getEmail(), student.getFullName()));

        return ApiMessageResponse.builder()
                .success(true)
                .message("Email verified successfully. You can now log in.")
                .build();
    }

    @Transactional
    public ApiMessageResponse resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("No account found with this email"));

        if (user.getRole() != Role.STUDENT) {
            throw new BadRequestException("Verification is not required for this account");
        }
        if (user.isEmailVerified()) {
            throw new BadRequestException("Email is already verified");
        }

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Student profile not found"));

        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);
        user.setVerificationTokenExpiresAt(LocalDateTime.now().plusHours(verificationExpirationHours));
        userRepository.save(user);

        String verificationLink = frontendUrl + "/verify-email?token=" + verificationToken;
        emailService.sendVerificationEmail(user.getEmail(), student.getFullName(), verificationLink);

        return ApiMessageResponse.builder()
                .success(true)
                .message("Verification email sent. Please check your inbox.")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        if (!user.isActive()) {
            throw new UnauthorizedException("Account is deactivated. Please contact admin.");
        }

        if (request.getLoginAs() != null && user.getRole() != request.getLoginAs()) {
            String message = request.getLoginAs() == Role.ADMIN
                    ? "This account is not an admin. Please use Student Login."
                    : "Admin accounts must use Admin Login.";
            throw new UnauthorizedException(message);
        }

        if (user.getRole() == Role.STUDENT && !user.isEmailVerified()) {
            throw new UnauthorizedException("Please verify your email before logging in. Check your inbox for the verification link.");
        }

        Student student = null;
        if (user.getRole() == Role.STUDENT) {
            student = studentRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new BadRequestException("Student profile not found"));
            if (!student.isActive()) {
                throw new UnauthorizedException("Student account is deactivated. Please contact admin.");
            }
        }

        return buildAuthResponse(user, student);
    }

    public ApiMessageResponse logout() {
        return ApiMessageResponse.builder()
                .message("Logged out successfully")
                .success(true)
                .build();
    }

    private AuthResponse buildAuthResponse(User user, Student student) {
        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails);

        AuthResponse.AuthResponseBuilder builder = AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole());

        if (student != null) {
            builder.studentId(student.getId()).fullName(student.getFullName());
        }

        return builder.build();
    }

    private void validateUniqueStudentFields(StudentRegistrationRequest request) {
        Map<String, String> errors = new LinkedHashMap<>();

        if (userRepository.existsByEmail(request.getEmail())
                || studentRepository.existsByEmail(request.getEmail())) {
            errors.put("email", "This email is already registered");
        }
        if (studentRepository.existsByMobileNumber(request.getMobileNumber())) {
            errors.put("mobileNumber", "This mobile number is already registered");
        }
        if (studentRepository.existsByAadhaarNumber(request.getAadhaarNumber())) {
            errors.put("aadhaarNumber", "This Aadhaar number is already registered");
        }

        if (!errors.isEmpty()) {
            throw new BadRequestException("Registration failed. Please correct the highlighted fields.", errors);
        }
    }
}
