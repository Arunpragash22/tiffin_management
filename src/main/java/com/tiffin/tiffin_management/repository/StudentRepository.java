package com.tiffin.tiffin_management.repository;

import com.tiffin.tiffin_management.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
    Optional<Student> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByMobileNumber(String mobileNumber);
    boolean existsByAadhaarNumber(String aadhaarNumber);
    long countByActiveTrue();
    List<Student> findTop5ByOrderByCreatedAtDesc();

    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "s.mobileNumber LIKE CONCAT('%', :keyword, '%') OR " +
           "s.aadhaarNumber LIKE CONCAT('%', :keyword, '%')")
    Page<Student> searchStudents(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT s FROM Student s WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(s.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "s.mobileNumber LIKE CONCAT('%', :keyword, '%') OR " +
           "s.aadhaarNumber LIKE CONCAT('%', :keyword, '%')) " +
           "ORDER BY s.createdAt DESC")
    List<Student> findAllForReport(@Param("keyword") String keyword);
}
