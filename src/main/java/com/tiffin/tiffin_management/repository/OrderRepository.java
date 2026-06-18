package com.tiffin.tiffin_management.repository;

import com.tiffin.tiffin_management.entity.Order;
import com.tiffin.tiffin_management.entity.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByStudentId(Long studentId, Pageable pageable);
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<Order> findTop10ByOrderByCreatedAtDesc();
    long countByOrderDate(LocalDate date);
    long count();
    List<Order> findByOrderDate(LocalDate date);
    List<Order> findByStudentIdAndStatusNot(Long studentId, OrderStatus status);
    long countByStatus(OrderStatus status);

    @Query("SELECT o FROM Order o JOIN FETCH o.student s WHERE " +
           "(:from IS NULL OR o.orderDate >= :from) AND " +
           "(:to IS NULL OR o.orderDate <= :to) AND " +
           "(:status IS NULL OR o.status = :status) " +
           "ORDER BY o.createdAt DESC")
    List<Order> findForReport(
            @Param("from") LocalDate from,
            @Param("to") LocalDate to,
            @Param("status") OrderStatus status);
}
