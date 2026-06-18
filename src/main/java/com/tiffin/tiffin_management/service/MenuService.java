package com.tiffin.tiffin_management.service;

import com.tiffin.tiffin_management.dto.request.MenuRequest;
import com.tiffin.tiffin_management.dto.response.MenuResponse;
import com.tiffin.tiffin_management.dto.response.PageResponse;
import com.tiffin.tiffin_management.entity.Menu;
import com.tiffin.tiffin_management.entity.enums.MenuType;
import com.tiffin.tiffin_management.exception.BadRequestException;
import com.tiffin.tiffin_management.exception.ResourceNotFoundException;
import com.tiffin.tiffin_management.repository.MenuRepository;
import com.tiffin.tiffin_management.util.DtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;

    @Transactional
    public MenuResponse createMenu(MenuRequest request) {
        menuRepository.findByMenuDateAndMenuType(request.getMenuDate(), request.getMenuType())
                .ifPresent(menu -> {
                    throw new BadRequestException("Menu already exists for this date and type");
                });

        Menu menu = Menu.builder()
                .menuDate(request.getMenuDate())
                .menuType(request.getMenuType())
                .breakfast(request.getBreakfast())
                .lunch(request.getLunch())
                .dinner(request.getDinner())
                .description(request.getDescription())
                .build();

        return DtoMapper.toMenuResponse(menuRepository.save(menu));
    }

    public PageResponse<MenuResponse> getAllMenus(int page, int size, MenuType menuType) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "menuDate"));
        Page<Menu> menuPage = menuType != null
                ? menuRepository.findByMenuType(menuType, pageable)
                : menuRepository.findAll(pageable);
        return DtoMapper.toPageResponse(menuPage.map(DtoMapper::toMenuResponse));
    }

    public MenuResponse getMenuById(Long id) {
        return DtoMapper.toMenuResponse(findMenuById(id));
    }

    public MenuResponse getDailyMenu(LocalDate date) {
        LocalDate menuDate = date != null ? date : LocalDate.now();
        Menu menu = menuRepository.findByMenuDateAndMenuType(menuDate, MenuType.DAILY)
                .or(() -> menuRepository.findFirstByMenuDateOrderByCreatedAtDesc(menuDate))
                .orElseThrow(() -> new ResourceNotFoundException("No menu found for date: " + menuDate));
        return DtoMapper.toMenuResponse(menu);
    }

    public List<MenuResponse> getWeeklyMenu(LocalDate startDate) {
        LocalDate start = startDate != null ? startDate : LocalDate.now();
        LocalDate end = start.plusDays(6);
        return menuRepository.findByMenuDateBetweenAndMenuType(start, end, MenuType.WEEKLY)
                .stream()
                .map(DtoMapper::toMenuResponse)
                .toList();
    }

    @Transactional
    public MenuResponse updateMenu(Long id, MenuRequest request) {
        Menu menu = findMenuById(id);

        menuRepository.findByMenuDateAndMenuType(request.getMenuDate(), request.getMenuType())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new BadRequestException("Menu already exists for this date and type");
                    }
                });

        menu.setMenuDate(request.getMenuDate());
        menu.setMenuType(request.getMenuType());
        menu.setBreakfast(request.getBreakfast());
        menu.setLunch(request.getLunch());
        menu.setDinner(request.getDinner());
        menu.setDescription(request.getDescription());

        return DtoMapper.toMenuResponse(menuRepository.save(menu));
    }

    @Transactional
    public void deleteMenu(Long id) {
        Menu menu = findMenuById(id);
        menuRepository.delete(menu);
    }

    public Menu findMenuById(Long id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found with id: " + id));
    }
}
