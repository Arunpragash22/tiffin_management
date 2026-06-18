package com.tiffin.tiffin_management.dto.request;

import com.tiffin.tiffin_management.entity.enums.MealType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class OrderRequest {
    @NotNull(message = "Order date is required")
    private LocalDate orderDate;

    @NotNull(message = "Meal type is required")
    private MealType mealType;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private BigDecimal totalAmount;

    @Size(max = 500)
    private String notes;
}
