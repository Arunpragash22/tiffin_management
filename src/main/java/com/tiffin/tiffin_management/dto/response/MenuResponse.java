package com.tiffin.tiffin_management.dto.response;

import com.tiffin.tiffin_management.entity.enums.MenuType;
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
public class MenuResponse {
    private Long id;
    private LocalDate menuDate;
    private MenuType menuType;
    private String breakfast;
    private String lunch;
    private String dinner;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
