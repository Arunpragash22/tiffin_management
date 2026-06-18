package com.tiffin.tiffin_management.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    public void sendVerificationEmail(String toEmail, String fullName, String verificationLink) {
        String subject = "Verify your TiffinPro account";
        String body = """
                Hello %s,

                Welcome to TiffinPro! Please verify your email address to activate your account.

                Click the link below to verify your email:
                %s

                This link expires in 24 hours.

                If you did not register, please ignore this email.

                Regards,
                TiffinPro Team
                """.formatted(fullName, verificationLink);

        sendEmail(toEmail, subject, body);
    }

    public void sendWelcomeEmail(String toEmail, String fullName) {
        String subject = "Welcome to TiffinPro!";
        String body = """
                Hello %s,

                Your email has been verified successfully. Your TiffinPro student account is now active.

                You can log in and start ordering your meals.

                Regards,
                TiffinPro Team
                """.formatted(fullName);

        sendEmail(toEmail, subject, body);
    }

    private void sendEmail(String toEmail, String subject, String body) {
        if (!mailEnabled) {
            log.info("Email disabled. Would send to {} | Subject: {} | Body: {}", toEmail, subject, body);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent successfully to {}", toEmail);
        } catch (Exception ex) {
            log.error("Failed to send email to {}: {}", toEmail, ex.getMessage());
            throw new RuntimeException("Failed to send email notification");
        }
    }
}
