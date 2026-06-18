package com.tiffin.tiffin_management.util;

import com.tiffin.tiffin_management.dto.response.*;
import com.tiffin.tiffin_management.entity.*;
import org.springframework.data.domain.Page;

import java.util.List;

public final class DtoMapper {

    private DtoMapper() {}

    public static StudentResponse toStudentResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .userId(student.getUser().getId())
                .fullName(student.getFullName())
                .mobileNumber(student.getMobileNumber())
                .email(student.getEmail())
                .physicalAddress(student.getPhysicalAddress())
                .aadhaarNumber(student.getAadhaarNumber())
                .aadhaarImagePath(student.getAadhaarImagePath())
                .active(student.isActive())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }

    public static AttendanceResponse toAttendanceResponse(Attendance attendance) {
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .studentId(attendance.getStudent().getId())
                .studentName(attendance.getStudent().getFullName())
                .attendanceDate(attendance.getAttendanceDate())
                .present(attendance.isPresent())
                .notes(attendance.getNotes())
                .createdAt(attendance.getCreatedAt())
                .updatedAt(attendance.getUpdatedAt())
                .build();
    }

    public static MenuResponse toMenuResponse(Menu menu) {
        return MenuResponse.builder()
                .id(menu.getId())
                .menuDate(menu.getMenuDate())
                .menuType(menu.getMenuType())
                .breakfast(menu.getBreakfast())
                .lunch(menu.getLunch())
                .dinner(menu.getDinner())
                .description(menu.getDescription())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .build();
    }

    public static OrderResponse toOrderResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .studentId(order.getStudent().getId())
                .studentName(order.getStudent().getFullName())
                .orderDate(order.getOrderDate())
                .mealType(order.getMealType())
                .quantity(order.getQuantity())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .notes(order.getNotes())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    public static <T> PageResponse<T> toPageResponse(Page<T> page) {
        return PageResponse.<T>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    public static List<OrderResponse> toOrderResponseList(List<Order> orders) {
        return orders.stream().map(DtoMapper::toOrderResponse).toList();
    }
}
