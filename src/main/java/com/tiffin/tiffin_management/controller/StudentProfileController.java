package com.tiffin.tiffin_management.controller;

import com.tiffin.tiffin_management.dto.request.StudentUpdateRequest;
import com.tiffin.tiffin_management.dto.response.StudentResponse;
import com.tiffin.tiffin_management.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/student/profile")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
@Tag(name = "Student Profile", description = "Student profile management APIs")
public class StudentProfileController {

    private final StudentService studentService;

    @GetMapping
    @Operation(summary = "Get current student profile")
    public ResponseEntity<StudentResponse> getProfile() {
        return ResponseEntity.ok(studentService.getProfile());
    }

    @PutMapping
    @Operation(summary = "Update current student profile")
    public ResponseEntity<StudentResponse> updateProfile(@Valid @RequestBody StudentUpdateRequest request) {
        return ResponseEntity.ok(studentService.updateProfile(request));
    }

    @PutMapping(value = "/aadhaar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload or update Aadhaar card image")
    public ResponseEntity<StudentResponse> updateAadhaar(@RequestPart("aadhaarImage") MultipartFile file) {
        return ResponseEntity.ok(studentService.updateAadhaarImage(file));
    }
}
