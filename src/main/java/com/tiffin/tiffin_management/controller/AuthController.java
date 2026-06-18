package com.tiffin.tiffin_management.controller;

import com.tiffin.tiffin_management.dto.request.LoginRequest;
import com.tiffin.tiffin_management.dto.request.ResendVerificationRequest;
import com.tiffin.tiffin_management.dto.request.StudentRegistrationRequest;
import com.tiffin.tiffin_management.dto.response.ApiMessageResponse;
import com.tiffin.tiffin_management.dto.response.AuthResponse;
import com.tiffin.tiffin_management.dto.response.RegistrationResponse;
import com.tiffin.tiffin_management.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication APIs for students and admins")
public class AuthController {

    private final AuthService authService;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Register a new student with Aadhaar image upload")
    public ResponseEntity<RegistrationResponse> register(
            @Valid @RequestPart("data") StudentRegistrationRequest request,
            @RequestPart("aadhaarImage") MultipartFile aadhaarImage) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerStudent(request, aadhaarImage));
    }

    @GetMapping("/verify-email")
    @Operation(summary = "Verify student email with token from email link")
    public ResponseEntity<ApiMessageResponse> verifyEmail(@RequestParam String token) {
        return ResponseEntity.ok(authService.verifyEmail(token));
    }

    @PostMapping("/resend-verification")
    @Operation(summary = "Resend email verification link")
    public ResponseEntity<ApiMessageResponse> resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        return ResponseEntity.ok(authService.resendVerificationEmail(request.getEmail()));
    }

    @PostMapping("/login")
    @Operation(summary = "Login for students and admins")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout current user")
    public ResponseEntity<ApiMessageResponse> logout() {
        return ResponseEntity.ok(authService.logout());
    }
}
