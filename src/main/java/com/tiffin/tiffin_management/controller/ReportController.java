package com.tiffin.tiffin_management.controller;

import com.tiffin.tiffin_management.entity.enums.OrderStatus;
import com.tiffin.tiffin_management.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Reports", description = "PDF report generation APIs")
public class ReportController {

    private static final DateTimeFormatter FILE_TS = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss");

    private final ReportService reportService;

    @GetMapping("/orders/pdf")
    @Operation(summary = "Download orders report PDF with student details")
    public ResponseEntity<byte[]> downloadOrdersReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) OrderStatus status) {
        byte[] pdf = reportService.generateOrdersReport(from, to, status);
        return pdfResponse(pdf, "orders-report-" + FILE_TS.format(LocalDateTime.now()) + ".pdf");
    }

    @GetMapping("/students/pdf")
    @Operation(summary = "Download student details report PDF")
    public ResponseEntity<byte[]> downloadStudentsReport(
            @RequestParam(required = false) String search) {
        byte[] pdf = reportService.generateStudentsReport(search);
        return pdfResponse(pdf, "students-report-" + FILE_TS.format(LocalDateTime.now()) + ".pdf");
    }

    @GetMapping("/attendance/pdf")
    @Operation(summary = "Download attendance report PDF with student details")
    public ResponseEntity<byte[]> downloadAttendanceReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        byte[] pdf = reportService.generateAttendanceReport(date);
        return pdfResponse(pdf, "attendance-report-" + FILE_TS.format(LocalDateTime.now()) + ".pdf");
    }

    private ResponseEntity<byte[]> pdfResponse(byte[] pdf, String filename) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
