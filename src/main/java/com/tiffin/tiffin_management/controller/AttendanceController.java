package com.tiffin.tiffin_management.controller;

import com.tiffin.tiffin_management.dto.request.AttendanceRequest;
import com.tiffin.tiffin_management.dto.response.AttendanceCalendarResponse;
import com.tiffin.tiffin_management.dto.response.AttendanceResponse;
import com.tiffin.tiffin_management.dto.response.PageResponse;
import com.tiffin.tiffin_management.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@Tag(name = "Attendance", description = "Attendance management APIs")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/api/admin/attendance")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Mark attendance for a student")
    public ResponseEntity<AttendanceResponse> markAttendance(@Valid @RequestBody AttendanceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(attendanceService.markAttendance(request));
    }

    @GetMapping("/api/admin/attendance")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all attendance records")
    public ResponseEntity<PageResponse<AttendanceResponse>> getAllAttendance(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getAllAttendance(page, size, date));
    }

    @GetMapping("/api/admin/attendance/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get attendance by ID")
    public ResponseEntity<AttendanceResponse> getAttendance(@PathVariable Long id) {
        return ResponseEntity.ok(attendanceService.getAttendanceById(id));
    }

    @PutMapping("/api/admin/attendance/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update attendance record")
    public ResponseEntity<AttendanceResponse> updateAttendance(
            @PathVariable Long id,
            @Valid @RequestBody AttendanceRequest request) {
        return ResponseEntity.ok(attendanceService.updateAttendance(id, request));
    }

    @DeleteMapping("/api/admin/attendance/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete attendance record")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/student/attendance/calendar")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get current student's monthly attendance calendar")
    public ResponseEntity<AttendanceCalendarResponse> getMyAttendanceCalendar(
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(attendanceService.getMyAttendanceCalendar(year, month));
    }

    @GetMapping("/api/student/attendance")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get current student's attendance records")
    public ResponseEntity<PageResponse<AttendanceResponse>> getMyAttendance(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(attendanceService.getMyAttendance(page, size));
    }
}
