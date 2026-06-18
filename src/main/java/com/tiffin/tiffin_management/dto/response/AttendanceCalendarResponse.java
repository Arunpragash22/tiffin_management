package com.tiffin.tiffin_management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceCalendarResponse {
    private int year;
    private int month;
    private long daysPresent;
    private long daysAbsent;
    private long daysLate;
    private long totalMarked;
    private List<AttendanceResponse> records;
}
