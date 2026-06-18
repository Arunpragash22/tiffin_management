package com.tiffin.tiffin_management.service;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.tiffin.tiffin_management.entity.Attendance;
import com.tiffin.tiffin_management.entity.Order;
import com.tiffin.tiffin_management.entity.Student;
import com.tiffin.tiffin_management.entity.enums.OrderStatus;
import com.tiffin.tiffin_management.repository.AttendanceRepository;
import com.tiffin.tiffin_management.repository.OrderRepository;
import com.tiffin.tiffin_management.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd MMM yyyy");
    private static final DateTimeFormatter DATETIME_FMT = DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm");
    private static final Color BRAND_ORANGE = new Color(230, 126, 34);
    private static final Color HEADER_BG = new Color(255, 243, 224);
    private static final Color ALT_ROW = new Color(249, 250, 251);

    private final OrderRepository orderRepository;
    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;

    public byte[] generateOrdersReport(LocalDate from, LocalDate to, OrderStatus status) {
        List<Order> orders = orderRepository.findForReport(from, to, status);
        return buildPdf(
                "Orders Report",
                buildOrdersFilterSummary(from, to, status, orders.size()),
                createOrdersTable(orders)
        );
    }

    public byte[] generateStudentsReport(String search) {
        List<Student> students = studentRepository.findAllForReport(normalizeSearch(search));
        return buildPdf(
                "Student Details Report",
                buildStudentsFilterSummary(search, students.size()),
                createStudentsTable(students)
        );
    }

    public byte[] generateAttendanceReport(LocalDate date) {
        List<Attendance> records = attendanceRepository.findForReport(date);
        return buildPdf(
                "Attendance Report",
                buildAttendanceFilterSummary(date, records),
                createAttendanceTable(records)
        );
    }

    private String normalizeSearch(String search) {
        if (search == null || search.isBlank()) {
            return null;
        }
        return search.trim();
    }

    private String buildOrdersFilterSummary(LocalDate from, LocalDate to, OrderStatus status, int count) {
        StringBuilder summary = new StringBuilder("Total records: ").append(count);
        if (from != null || to != null) {
            summary.append(" | Date range: ");
            summary.append(from != null ? from.format(DATE_FMT) : "Any");
            summary.append(" to ");
            summary.append(to != null ? to.format(DATE_FMT) : "Any");
        }
        if (status != null) {
            summary.append(" | Status: ").append(status.name());
        }
        return summary.toString();
    }

    private String buildStudentsFilterSummary(String search, int count) {
        String keyword = normalizeSearch(search);
        if (keyword == null) {
            return "Total students: " + count;
        }
        return "Total students: " + count + " | Search: \"" + keyword + "\"";
    }

    private String buildAttendanceFilterSummary(LocalDate date, List<Attendance> records) {
        long present = records.stream().filter(a -> a.isPresent() && !isLate(a)).count();
        long late = records.stream().filter(this::isLate).count();
        long absent = records.stream().filter(a -> !a.isPresent()).count();

        StringBuilder summary = new StringBuilder("Total records: ").append(records.size());
        summary.append(" | Present: ").append(present);
        summary.append(" | Late: ").append(late);
        summary.append(" | Absent: ").append(absent);
        if (date != null) {
            summary.append(" | Date: ").append(date.format(DATE_FMT));
        }
        return summary.toString();
    }

    private PdfPTable createOrdersTable(List<Order> orders) {
        PdfPTable table = new PdfPTable(10);
        table.setWidthPercentage(100);
        try {
            table.setWidths(new float[]{0.8f, 1.2f, 2f, 1.8f, 2f, 1.5f, 1.2f, 0.8f, 1.2f, 1.5f});
        } catch (Exception ignored) {
            // use default widths
        }

        addHeaderRow(table, "Order ID", "Student ID", "Student Name", "Mobile", "Email",
                "Order Date", "Meal", "Qty", "Status", "Amount");

        if (orders.isEmpty()) {
            addEmptyRow(table, 10, "No orders found for the selected filters.");
            return table;
        }

        Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 8);
        int rowIndex = 0;
        for (Order order : orders) {
            Student student = order.getStudent();
            Color rowBg = rowIndex % 2 == 0 ? Color.WHITE : ALT_ROW;
            addCell(table, formatOrderId(order.getId()), cellFont, rowBg);
            addCell(table, formatStudentId(student.getId()), cellFont, rowBg);
            addCell(table, student.getFullName(), cellFont, rowBg);
            addCell(table, student.getMobileNumber(), cellFont, rowBg);
            addCell(table, student.getEmail(), cellFont, rowBg);
            addCell(table, order.getOrderDate().format(DATE_FMT), cellFont, rowBg);
            addCell(table, order.getMealType().name(), cellFont, rowBg);
            addCell(table, String.valueOf(order.getQuantity()), cellFont, rowBg);
            addCell(table, order.getStatus().name(), cellFont, rowBg);
            addCell(table, formatAmount(order.getTotalAmount()), cellFont, rowBg);
            rowIndex++;
        }
        return table;
    }

    private PdfPTable createStudentsTable(List<Student> students) {
        PdfPTable table = new PdfPTable(8);
        table.setWidthPercentage(100);
        try {
            table.setWidths(new float[]{1f, 2.2f, 1.6f, 2.2f, 2.8f, 1.8f, 1f, 1.6f});
        } catch (Exception ignored) {
            // use default widths
        }

        addHeaderRow(table, "Student ID", "Full Name", "Mobile", "Email", "Address",
                "Aadhaar", "Status", "Registered");

        if (students.isEmpty()) {
            addEmptyRow(table, 8, "No students found for the selected filters.");
            return table;
        }

        Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 8);
        int rowIndex = 0;
        for (Student student : students) {
            Color rowBg = rowIndex % 2 == 0 ? Color.WHITE : ALT_ROW;
            addCell(table, formatStudentId(student.getId()), cellFont, rowBg);
            addCell(table, student.getFullName(), cellFont, rowBg);
            addCell(table, student.getMobileNumber(), cellFont, rowBg);
            addCell(table, student.getEmail(), cellFont, rowBg);
            addCell(table, student.getPhysicalAddress(), cellFont, rowBg);
            addCell(table, maskAadhaar(student.getAadhaarNumber()), cellFont, rowBg);
            addCell(table, student.isActive() ? "Active" : "Inactive", cellFont, rowBg);
            addCell(table, formatDateTime(student.getCreatedAt()), cellFont, rowBg);
            rowIndex++;
        }
        return table;
    }

    private PdfPTable createAttendanceTable(List<Attendance> records) {
        PdfPTable table = new PdfPTable(7);
        table.setWidthPercentage(100);
        try {
            table.setWidths(new float[]{1.2f, 1.2f, 2f, 1.8f, 2f, 1.2f, 2.5f});
        } catch (Exception ignored) {
            // use default widths
        }

        addHeaderRow(table, "Date", "Student ID", "Student Name", "Mobile", "Email", "Status", "Notes");

        if (records.isEmpty()) {
            addEmptyRow(table, 7, "No attendance records found for the selected filters.");
            return table;
        }

        Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 8);
        int rowIndex = 0;
        for (Attendance record : records) {
            Student student = record.getStudent();
            Color rowBg = rowIndex % 2 == 0 ? Color.WHITE : ALT_ROW;
            addCell(table, record.getAttendanceDate().format(DATE_FMT), cellFont, rowBg);
            addCell(table, formatStudentId(student.getId()), cellFont, rowBg);
            addCell(table, student.getFullName(), cellFont, rowBg);
            addCell(table, student.getMobileNumber(), cellFont, rowBg);
            addCell(table, student.getEmail(), cellFont, rowBg);
            addCell(table, resolveAttendanceStatus(record), cellFont, rowBg);
            addCell(table, record.getNotes(), cellFont, rowBg);
            rowIndex++;
        }
        return table;
    }

    private byte[] buildPdf(String title, String summary, PdfPTable table) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate(), 36, 36, 48, 36);
            PdfWriter.getInstance(document, outputStream);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BRAND_ORANGE);
            Paragraph titleParagraph = new Paragraph("TiffinPro - " + title, titleFont);
            titleParagraph.setAlignment(Element.ALIGN_CENTER);
            titleParagraph.setSpacingAfter(6);
            document.add(titleParagraph);

            Font metaFont = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.DARK_GRAY);
            Paragraph generatedAt = new Paragraph("Generated on: " + LocalDateTime.now().format(DATETIME_FMT), metaFont);
            generatedAt.setAlignment(Element.ALIGN_CENTER);
            generatedAt.setSpacingAfter(4);
            document.add(generatedAt);

            Paragraph summaryParagraph = new Paragraph(summary, metaFont);
            summaryParagraph.setAlignment(Element.ALIGN_CENTER);
            summaryParagraph.setSpacingAfter(16);
            document.add(summaryParagraph);

            document.add(table);
            document.close();
            return outputStream.toByteArray();
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to generate PDF report", ex);
        }
    }

    private void addHeaderRow(PdfPTable table, String... headers) {
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, Color.BLACK);
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
            cell.setBackgroundColor(HEADER_BG);
            cell.setPadding(6);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }
    }

    private void addCell(PdfPTable table, String value, Font font, Color background) {
        PdfPCell cell = new PdfPCell(new Phrase(value != null ? value : "-", font));
        cell.setBackgroundColor(background);
        cell.setPadding(5);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        table.addCell(cell);
    }

    private void addEmptyRow(PdfPTable table, int colspan, String message) {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 9, Color.GRAY);
        PdfPCell cell = new PdfPCell(new Phrase(message, font));
        cell.setColspan(colspan);
        cell.setPadding(12);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);
    }

    private String formatOrderId(Long id) {
        return "#ORD-" + String.format("%03d", id);
    }

    private String formatStudentId(Long id) {
        return "STU-" + String.format("%04d", id);
    }

    private String formatAmount(BigDecimal amount) {
        return amount != null ? "Rs. " + amount : "-";
    }

    private String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(DATE_FMT) : "-";
    }

    private String maskAadhaar(String aadhaar) {
        if (aadhaar == null || aadhaar.length() < 4) {
            return "-";
        }
        return "XXXX-XXXX-" + aadhaar.substring(aadhaar.length() - 4);
    }

    private boolean isLate(Attendance record) {
        return record.isPresent()
                && record.getNotes() != null
                && record.getNotes().toLowerCase().contains("late");
    }

    private String resolveAttendanceStatus(Attendance record) {
        if (!record.isPresent()) {
            return "Absent";
        }
        return isLate(record) ? "Late" : "Present";
    }
}
