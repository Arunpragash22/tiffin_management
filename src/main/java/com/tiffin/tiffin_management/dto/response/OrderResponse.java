package com.tiffin.tiffin_management.dto.response;

import com.tiffin.tiffin_management.entity.enums.MealType;
import com.tiffin.tiffin_management.entity.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private LocalDate orderDate;
    private MealType mealType;
    private Integer quantity;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
