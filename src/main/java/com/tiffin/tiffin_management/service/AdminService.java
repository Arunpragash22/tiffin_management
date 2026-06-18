package com.tiffin.tiffin_management.service;

import com.tiffin.tiffin_management.dto.request.AdminCreateRequest;
import com.tiffin.tiffin_management.dto.response.AdminResponse;
import com.tiffin.tiffin_management.dto.response.PageResponse;
import com.tiffin.tiffin_management.entity.User;
import com.tiffin.tiffin_management.entity.enums.Role;
import com.tiffin.tiffin_management.exception.BadRequestException;
import com.tiffin.tiffin_management.exception.ResourceNotFoundException;
import com.tiffin.tiffin_management.repository.UserRepository;
import com.tiffin.tiffin_management.security.SecurityUtils;
import com.tiffin.tiffin_management.util.DtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PageResponse<AdminResponse> getAllAdmins(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> adminPage = StringUtils.hasText(search)
                ? userRepository.findByRoleAndEmailContainingIgnoreCase(Role.ADMIN, search.trim(), pageable)
                : userRepository.findByRole(Role.ADMIN, pageable);
        return DtoMapper.toPageResponse(adminPage.map(this::toAdminResponse));
    }

    @Transactional
    public AdminResponse createAdmin(AdminCreateRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already registered", Map.of("email", "This email is already in use"));
        }

        User admin = User.builder()
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .active(true)
                .emailVerified(true)
                .build();
        return toAdminResponse(userRepository.save(admin));
    }

    @Transactional
    public AdminResponse toggleAdminStatus(Long id, boolean active) {
        User admin = findAdminById(id);
        Long currentUserId = SecurityUtils.getCurrentUser().getUser().getId();

        if (admin.getId().equals(currentUserId) && !active) {
            throw new BadRequestException("You cannot deactivate your own admin account");
        }
        if (!active && userRepository.countByRoleAndActiveTrue(Role.ADMIN) <= 1) {
            throw new BadRequestException("At least one active admin account is required");
        }

        admin.setActive(active);
        return toAdminResponse(userRepository.save(admin));
    }

    @Transactional
    public void deleteAdmin(Long id) {
        User admin = findAdminById(id);
        Long currentUserId = SecurityUtils.getCurrentUser().getUser().getId();

        if (admin.getId().equals(currentUserId)) {
            throw new BadRequestException("You cannot delete your own admin account");
        }
        if (userRepository.countByRole(Role.ADMIN) <= 1) {
            throw new BadRequestException("At least one admin account is required");
        }

        userRepository.delete(admin);
    }

    private User findAdminById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
        if (user.getRole() != Role.ADMIN) {
            throw new ResourceNotFoundException("Admin not found");
        }
        return user;
    }

    private AdminResponse toAdminResponse(User user) {
        return AdminResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
