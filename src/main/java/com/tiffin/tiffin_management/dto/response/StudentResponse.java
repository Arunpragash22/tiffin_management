package com.tiffin.tiffin_management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String mobileNumber;
    private String email;
    private String physicalAddress;
    private String aadhaarNumber;
    private String aadhaarImagePath;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
