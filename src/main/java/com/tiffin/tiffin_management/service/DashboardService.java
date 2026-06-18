package com.tiffin.tiffin_management.service;

import com.tiffin.tiffin_management.dto.response.DashboardResponse;
import com.tiffin.tiffin_management.dto.response.MenuResponse;
import com.tiffin.tiffin_management.entity.enums.MenuType;
import com.tiffin.tiffin_management.entity.enums.OrderStatus;
import com.tiffin.tiffin_management.entity.enums.Role;
import com.tiffin.tiffin_management.repository.AttendanceRepository;
import com.tiffin.tiffin_management.repository.MenuRepository;
import com.tiffin.tiffin_management.repository.OrderRepository;
import com.tiffin.tiffin_management.repository.StudentRepository;
import com.tiffin.tiffin_management.repository.UserRepository;
import com.tiffin.tiffin_management.util.DtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final OrderRepository orderRepository;
    private final AttendanceRepository attendanceRepository;
    private final MenuRepository menuRepository;

    public DashboardResponse getAdminDashboard() {
        LocalDate today = LocalDate.now();

        MenuResponse todayMenu = menuRepository.findByMenuDateAndMenuType(today, MenuType.DAILY)
                .map(DtoMapper::toMenuResponse)
                .or(() -> menuRepository.findFirstByMenuDateOrderByCreatedAtDesc(today).map(DtoMapper::toMenuResponse))
                .orElse(null);

        return DashboardResponse.builder()
                .totalStudents(userRepository.countByRole(Role.STUDENT))
                .totalActiveStudents(studentRepository.countByActiveTrue())
                .totalOrders(orderRepository.count())
                .todayAttendanceCount(attendanceRepository.countByAttendanceDateAndPresentTrue(today))
                .pendingOrders(orderRepository.countByStatus(OrderStatus.PLACED))
                .todayMenu(todayMenu)
                .recentOrders(DtoMapper.toOrderResponseList(orderRepository.findTop10ByOrderByCreatedAtDesc()))
                .recentStudents(studentRepository.findTop5ByOrderByCreatedAtDesc().stream()
                        .map(DtoMapper::toStudentResponse)
                        .toList())
                .recentAttendance(attendanceRepository.findTop10ByAttendanceDateOrderByCreatedAtDesc(today).stream()
                        .map(DtoMapper::toAttendanceResponse)
                        .toList())
                .build();
    }
}
