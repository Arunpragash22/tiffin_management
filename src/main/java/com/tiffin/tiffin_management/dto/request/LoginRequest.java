package com.tiffin.tiffin_management.dto.request;

import com.tiffin.tiffin_management.entity.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    /** When set, login succeeds only if the account has this role (student vs admin portal). */
    private Role loginAs;
}
