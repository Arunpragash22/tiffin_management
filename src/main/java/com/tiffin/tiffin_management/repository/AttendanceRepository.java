package com.tiffin.tiffin_management.repository;

import com.tiffin.tiffin_management.entity.Attendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Page<Attendance> findByStudentId(Long studentId, Pageable pageable);
    List<Attendance> findByStudentIdAndAttendanceDateBetween(Long studentId, LocalDate start, LocalDate end);
    Page<Attendance> findByAttendanceDate(LocalDate date, Pageable pageable);
    Optional<Attendance> findByStudentIdAndAttendanceDate(Long studentId, LocalDate date);
    long countByAttendanceDateAndPresentTrue(LocalDate date);
    List<Attendance> findTop10ByAttendanceDateOrderByCreatedAtDesc(LocalDate date);

    @Query("SELECT a FROM Attendance a JOIN FETCH a.student s WHERE " +
           "(:date IS NULL OR a.attendanceDate = :date) " +
           "ORDER BY a.attendanceDate DESC, s.fullName ASC")
    List<Attendance> findForReport(@Param("date") LocalDate date);
}
