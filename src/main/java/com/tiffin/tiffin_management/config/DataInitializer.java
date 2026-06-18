package com.tiffin.tiffin_management.config;

import com.tiffin.tiffin_management.entity.User;
import com.tiffin.tiffin_management.entity.enums.Role;
import com.tiffin.tiffin_management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        userRepository.findByEmail(adminEmail).ifPresentOrElse(
                existing -> {
                    boolean updated = false;
                    if (!passwordEncoder.matches(adminPassword, existing.getPassword())) {
                        existing.setPassword(passwordEncoder.encode(adminPassword));
                        updated = true;
                    }
                    if (existing.getRole() != Role.ADMIN) {
                        existing.setRole(Role.ADMIN);
                        updated = true;
                    }
                    if (!existing.isActive()) {
                        existing.setActive(true);
                        updated = true;
                    }
                    if (!existing.isEmailVerified()) {
                        existing.setEmailVerified(true);
                        updated = true;
                    }
                    if (updated) {
                        userRepository.save(existing);
                        log.info("Default admin account synced for: {}", adminEmail);
                    }
                },
                () -> {
                    User admin = User.builder()
                            .email(adminEmail)
                            .password(passwordEncoder.encode(adminPassword))
                            .role(Role.ADMIN)
                            .active(true)
                            .emailVerified(true)
                            .build();
                    userRepository.save(admin);
                    log.info("Default admin user created with email: {}", adminEmail);
                }
        );

        userRepository.findAll().stream()
                .filter(user -> user.getVerificationToken() == null && !user.isEmailVerified())
                .forEach(user -> {
                    user.setEmailVerified(true);
                    userRepository.save(user);
                    log.info("Marked existing user as email verified: {}", user.getEmail());
                });
    }
}
