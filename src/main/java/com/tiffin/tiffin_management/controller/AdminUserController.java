package com.tiffin.tiffin_management.controller;

import com.tiffin.tiffin_management.dto.request.AdminCreateRequest;
import com.tiffin.tiffin_management.dto.response.AdminResponse;
import com.tiffin.tiffin_management.dto.response.PageResponse;
import com.tiffin.tiffin_management.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/admins")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin - Admins", description = "Admin account management APIs")
public class AdminUserController {

    private final AdminService adminService;

    @GetMapping
    @Operation(summary = "Get all admin accounts")
    public ResponseEntity<PageResponse<AdminResponse>> getAllAdmins(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminService.getAllAdmins(page, size, search));
    }

    @PostMapping
    @Operation(summary = "Create a new admin account")
    public ResponseEntity<AdminResponse> createAdmin(@Valid @RequestBody AdminCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createAdmin(request));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Activate or deactivate an admin account")
    public ResponseEntity<AdminResponse> toggleStatus(
            @PathVariable Long id,
            @RequestParam boolean active) {
        return ResponseEntity.ok(adminService.toggleAdminStatus(id, active));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an admin account")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.noContent().build();
    }
}
