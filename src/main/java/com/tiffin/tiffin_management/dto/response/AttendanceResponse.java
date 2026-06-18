package com.tiffin.tiffin_management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private LocalDate attendanceDate;
    private boolean present;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
