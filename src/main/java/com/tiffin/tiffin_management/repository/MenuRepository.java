package com.tiffin.tiffin_management.repository;

import com.tiffin.tiffin_management.entity.Menu;
import com.tiffin.tiffin_management.entity.enums.MenuType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {
    Optional<Menu> findByMenuDateAndMenuType(LocalDate menuDate, MenuType menuType);
    List<Menu> findByMenuDateBetweenAndMenuType(LocalDate start, LocalDate end, MenuType menuType);
    Page<Menu> findByMenuType(MenuType menuType, Pageable pageable);
    Optional<Menu> findFirstByMenuDateOrderByCreatedAtDesc(LocalDate menuDate);
}
