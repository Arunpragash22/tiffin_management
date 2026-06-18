package com.tiffin.tiffin_management.controller;

import com.tiffin.tiffin_management.dto.request.MenuRequest;
import com.tiffin.tiffin_management.dto.response.MenuResponse;
import com.tiffin.tiffin_management.dto.response.PageResponse;
import com.tiffin.tiffin_management.entity.enums.MenuType;
import com.tiffin.tiffin_management.service.MenuService;
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
import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Menus", description = "Menu management APIs")
public class MenuController {

    private final MenuService menuService;

    @PostMapping("/api/admin/menus")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new menu")
    public ResponseEntity<MenuResponse> createMenu(@Valid @RequestBody MenuRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(menuService.createMenu(request));
    }

    @GetMapping("/api/admin/menus")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all menus")
    public ResponseEntity<PageResponse<MenuResponse>> getAllMenus(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) MenuType menuType) {
        return ResponseEntity.ok(menuService.getAllMenus(page, size, menuType));
    }

    @GetMapping("/api/admin/menus/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get menu by ID")
    public ResponseEntity<MenuResponse> getMenu(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getMenuById(id));
    }

    @PutMapping("/api/admin/menus/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update menu by ID")
    public ResponseEntity<MenuResponse> updateMenu(
            @PathVariable Long id,
            @Valid @RequestBody MenuRequest request) {
        return ResponseEntity.ok(menuService.updateMenu(id, request));
    }

    @DeleteMapping("/api/admin/menus/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete menu by ID")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
        menuService.deleteMenu(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/student/menus/daily")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get daily menu for a specific date")
    public ResponseEntity<MenuResponse> getDailyMenu(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(menuService.getDailyMenu(date));
    }

    @GetMapping("/api/student/menus/weekly")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get weekly menu starting from a date")
    public ResponseEntity<List<MenuResponse>> getWeeklyMenu(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ResponseEntity.ok(menuService.getWeeklyMenu(startDate));
    }
}
