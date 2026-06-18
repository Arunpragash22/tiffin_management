package com.tiffin.tiffin_management.service;

import com.tiffin.tiffin_management.dto.request.StudentUpdateRequest;
import com.tiffin.tiffin_management.dto.response.PageResponse;
import com.tiffin.tiffin_management.dto.response.StudentResponse;
import com.tiffin.tiffin_management.entity.Student;
import com.tiffin.tiffin_management.entity.User;
import com.tiffin.tiffin_management.entity.enums.Role;
import com.tiffin.tiffin_management.exception.BadRequestException;
import com.tiffin.tiffin_management.exception.ResourceNotFoundException;
import com.tiffin.tiffin_management.repository.StudentRepository;
import com.tiffin.tiffin_management.repository.UserRepository;
import com.tiffin.tiffin_management.security.CustomUserDetails;
import com.tiffin.tiffin_management.util.DtoMapper;
import com.tiffin.tiffin_management.util.FileStorageService;
import com.tiffin.tiffin_management.util.PhoneNumberUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public StudentResponse getProfile() {
        Student student = getCurrentStudent();
        return DtoMapper.toStudentResponse(student);
    }

    @Transactional
    public StudentResponse updateProfile(StudentUpdateRequest request) {
        Student student = getCurrentStudent();
        updateStudentFields(student, request);
        return DtoMapper.toStudentResponse(studentRepository.save(student));
    }

    @Transactional
    public StudentResponse updateAadhaarImage(MultipartFile file) {
        Student student = getCurrentStudent();
        if (StringUtils.hasText(student.getAadhaarImagePath())) {
            fileStorageService.deleteFile(student.getAadhaarImagePath());
        }
        String imagePath = fileStorageService.storeAadhaarImage(file);
        student.setAadhaarImagePath(imagePath);
        return DtoMapper.toStudentResponse(studentRepository.save(student));
    }

    public PageResponse<StudentResponse> getAllStudents(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Student> studentPage = StringUtils.hasText(search)
                ? studentRepository.searchStudents(search, pageable)
                : studentRepository.findAll(pageable);
        return DtoMapper.toPageResponse(studentPage.map(DtoMapper::toStudentResponse));
    }

    public StudentResponse getStudentById(Long id) {
        return DtoMapper.toStudentResponse(findStudentById(id));
    }

    @Transactional
    public StudentResponse updateStudent(Long id, StudentUpdateRequest request) {
        Student student = findStudentById(id);
        updateStudentFields(student, request);
        return DtoMapper.toStudentResponse(studentRepository.save(student));
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = findStudentById(id);
        if (StringUtils.hasText(student.getAadhaarImagePath())) {
            fileStorageService.deleteFile(student.getAadhaarImagePath());
        }
        User user = student.getUser();
        studentRepository.delete(student);
        userRepository.delete(user);
    }

    @Transactional
    public StudentResponse toggleStudentStatus(Long id, boolean active) {
        Student student = findStudentById(id);
        student.setActive(active);
        student.getUser().setActive(active);
        userRepository.save(student.getUser());
        return DtoMapper.toStudentResponse(studentRepository.save(student));
    }

    public Student findStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    public Student getCurrentStudent() {
        CustomUserDetails userDetails = getCurrentUserDetails();
        if (userDetails.getUser().getRole() != Role.STUDENT) {
            throw new BadRequestException("Current user is not a student");
        }
        return studentRepository.findByUserId(userDetails.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
    }

    private void updateStudentFields(Student student, StudentUpdateRequest request) {
        if (StringUtils.hasText(request.getFullName())) {
            student.setFullName(request.getFullName());
        }
        if (StringUtils.hasText(request.getMobileNumber())) {
            String normalizedMobile = PhoneNumberUtil.normalizeSriLankanMobile(request.getMobileNumber());
            if (!normalizedMobile.equals(student.getMobileNumber())
                    && studentRepository.existsByMobileNumber(normalizedMobile)) {
                throw new BadRequestException("Mobile number is already registered");
            }
            student.setMobileNumber(normalizedMobile);
        }
        if (StringUtils.hasText(request.getEmail())) {
            if (!request.getEmail().equals(student.getEmail())
                    && (studentRepository.existsByEmail(request.getEmail())
                    || userRepository.existsByEmail(request.getEmail()))) {
                throw new BadRequestException("Email is already registered");
            }
            student.setEmail(request.getEmail());
            User user = student.getUser();
            user.setEmail(request.getEmail());
            userRepository.save(user);
        }
        if (StringUtils.hasText(request.getPhysicalAddress())) {
            student.setPhysicalAddress(request.getPhysicalAddress());
        }
        if (StringUtils.hasText(request.getAadhaarNumber())) {
            if (!request.getAadhaarNumber().equals(student.getAadhaarNumber())
                    && studentRepository.existsByAadhaarNumber(request.getAadhaarNumber())) {
                throw new BadRequestException("Aadhaar number is already registered");
            }
            student.setAadhaarNumber(request.getAadhaarNumber());
        }
    }

    private CustomUserDetails getCurrentUserDetails() {
        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
