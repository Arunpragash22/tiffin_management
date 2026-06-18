package com.tiffin.tiffin_management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private long totalStudents;
    private long totalActiveStudents;
    private long totalOrders;
    private long todayAttendanceCount;
    private long pendingOrders;
    private MenuResponse todayMenu;
    private List<OrderResponse> recentOrders;
    private List<StudentResponse> recentStudents;
    private List<AttendanceResponse> recentAttendance;
}
