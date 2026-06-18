package com.tiffin.tiffin_management.security;

import com.tiffin.tiffin_management.entity.Student;
import com.tiffin.tiffin_management.entity.enums.Role;
import com.tiffin.tiffin_management.exception.ResourceNotFoundException;
import com.tiffin.tiffin_management.repository.StudentRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static CustomUserDetails getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new AccessDeniedException("Authentication required");
        }
        return userDetails;
    }

    public static Role getCurrentRole() {
        return getCurrentUser().getUser().getRole();
    }

    public static void requireRole(Role role) {
        if (getCurrentRole() != role) {
            throw new AccessDeniedException("Access denied");
        }
    }

    public static void requireAadhaarAccess(Long studentId, StudentRepository studentRepository) {
        Role role = getCurrentRole();
        if (role == Role.ADMIN) {
            return;
        }
        if (role == Role.STUDENT) {
            Student student = studentRepository.findByUserId(getCurrentUser().getUser().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
            if (!student.getId().equals(studentId)) {
                throw new AccessDeniedException("You can only access your own documents");
            }
            return;
        }
        throw new AccessDeniedException("Access denied");
    }
}
