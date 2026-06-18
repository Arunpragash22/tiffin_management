package com.tiffin.tiffin_management.repository;

import com.tiffin.tiffin_management.entity.User;
import com.tiffin.tiffin_management.entity.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationToken(String verificationToken);
    boolean existsByEmail(String email);
    long countByRole(Role role);
    long countByRoleAndActiveTrue(Role role);
    Page<User> findByRole(Role role, Pageable pageable);
    Page<User> findByRoleAndEmailContainingIgnoreCase(Role role, String email, Pageable pageable);
}
