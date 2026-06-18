package com.tiffin.tiffin_management.controller;

import com.tiffin.tiffin_management.exception.ResourceNotFoundException;
import com.tiffin.tiffin_management.repository.StudentRepository;
import com.tiffin.tiffin_management.security.SecurityUtils;
import com.tiffin.tiffin_management.service.StudentService;
import com.tiffin.tiffin_management.util.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Path;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final StudentService studentService;
    private final StudentRepository studentRepository;
    private final FileStorageService fileStorageService;

    @GetMapping("/aadhaar/{studentId}")
    public ResponseEntity<Resource> getAadhaarImage(@PathVariable Long studentId) {
        SecurityUtils.requireAadhaarAccess(studentId, studentRepository);
        var student = studentService.getStudentById(studentId);
        if (student.getAadhaarImagePath() == null) {
            throw new ResourceNotFoundException("Aadhaar image not found for student");
        }

        try {
            Path filePath = fileStorageService.getFilePath(student.getAadhaarImagePath());
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists()) {
                throw new ResourceNotFoundException("Aadhaar image file not found");
            }
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + student.getAadhaarImagePath() + "\"")
                    .body(resource);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Error reading Aadhaar image file");
        }
    }
}
