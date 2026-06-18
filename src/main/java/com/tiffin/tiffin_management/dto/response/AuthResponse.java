package com.tiffin.tiffin_management.dto.response;

import com.tiffin.tiffin_management.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tokenType;
    private Long userId;
    private String email;
    private Role role;
    private Long studentId;
    private String fullName;
}
