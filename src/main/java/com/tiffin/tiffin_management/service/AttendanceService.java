package com.tiffin.tiffin_management.service;

import com.tiffin.tiffin_management.dto.request.AttendanceRequest;
import com.tiffin.tiffin_management.dto.response.AttendanceCalendarResponse;
import com.tiffin.tiffin_management.dto.response.AttendanceResponse;
import com.tiffin.tiffin_management.dto.response.PageResponse;
import com.tiffin.tiffin_management.entity.Attendance;
import com.tiffin.tiffin_management.entity.Student;
import com.tiffin.tiffin_management.exception.BadRequestException;
import com.tiffin.tiffin_management.exception.ResourceNotFoundException;
import com.tiffin.tiffin_management.repository.AttendanceRepository;
import com.tiffin.tiffin_management.util.DtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentService studentService;

    @Transactional
    public AttendanceResponse markAttendance(AttendanceRequest request) {
        Student student = studentService.findStudentById(request.getStudentId());

        if (attendanceRepository.findByStudentIdAndAttendanceDate(student.getId(), request.getAttendanceDate()).isPresent()) {
            throw new BadRequestException("Attendance already marked for this student on the given date");
        }

        Attendance attendance = Attendance.builder()
                .student(student)
                .attendanceDate(request.getAttendanceDate())
                .present(request.getPresent())
                .notes(request.getNotes())
                .build();

        return DtoMapper.toAttendanceResponse(attendanceRepository.save(attendance));
    }

    public PageResponse<AttendanceResponse> getAllAttendance(int page, int size, LocalDate date) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "attendanceDate"));
        Page<Attendance> attendancePage = date != null
                ? attendanceRepository.findByAttendanceDate(date, pageable)
                : attendanceRepository.findAll(pageable);
        return DtoMapper.toPageResponse(attendancePage.map(DtoMapper::toAttendanceResponse));
    }

    public PageResponse<AttendanceResponse> getMyAttendance(int page, int size) {
        Student student = studentService.getCurrentStudent();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "attendanceDate"));
        Page<Attendance> attendancePage = attendanceRepository.findByStudentId(student.getId(), pageable);
        return DtoMapper.toPageResponse(attendancePage.map(DtoMapper::toAttendanceResponse));
    }

    public AttendanceCalendarResponse getMyAttendanceCalendar(int year, int month) {
        Student student = studentService.getCurrentStudent();
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<Attendance> records = attendanceRepository
                .findByStudentIdAndAttendanceDateBetween(student.getId(), start, end);

        long daysLate = records.stream().filter(this::isLate).count();
        long daysPresent = records.stream().filter(a -> a.isPresent() && !isLate(a)).count();
        long daysAbsent = records.stream().filter(a -> !a.isPresent()).count();

        return AttendanceCalendarResponse.builder()
                .year(year)
                .month(month)
                .daysPresent(daysPresent)
                .daysAbsent(daysAbsent)
                .daysLate(daysLate)
                .totalMarked(records.size())
                .records(records.stream().map(DtoMapper::toAttendanceResponse).toList())
                .build();
    }

    private boolean isLate(Attendance attendance) {
        return attendance.isPresent()
                && attendance.getNotes() != null
                && attendance.getNotes().toLowerCase().contains("late");
    }

    public AttendanceResponse getAttendanceById(Long id) {
        return DtoMapper.toAttendanceResponse(findAttendanceById(id));
    }

    @Transactional
    public AttendanceResponse updateAttendance(Long id, AttendanceRequest request) {
        Attendance attendance = findAttendanceById(id);
        Student student = studentService.findStudentById(request.getStudentId());

        attendanceRepository.findByStudentIdAndAttendanceDate(student.getId(), request.getAttendanceDate())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new BadRequestException("Attendance already exists for this student on the given date");
                    }
                });

        attendance.setStudent(student);
        attendance.setAttendanceDate(request.getAttendanceDate());
        attendance.setPresent(request.getPresent());
        attendance.setNotes(request.getNotes());

        return DtoMapper.toAttendanceResponse(attendanceRepository.save(attendance));
    }

    @Transactional
    public void deleteAttendance(Long id) {
        Attendance attendance = findAttendanceById(id);
        attendanceRepository.delete(attendance);
    }

    public Attendance findAttendanceById(Long id) {
        return attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found with id: " + id));
    }
}
