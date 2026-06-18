package com.tiffin.tiffin_management.dto.request;

import com.tiffin.tiffin_management.entity.enums.MenuType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MenuRequest {
    @NotNull(message = "Menu date is required")
    private LocalDate menuDate;

    @NotNull(message = "Menu type is required")
    private MenuType menuType;

    @NotBlank(message = "Breakfast is required")
    @Size(max = 500)
    private String breakfast;

    @NotBlank(message = "Lunch is required")
    @Size(max = 500)
    private String lunch;

    @NotBlank(message = "Dinner is required")
    @Size(max = 500)
    private String dinner;

    @Size(max = 1000)
    private String description;
}
