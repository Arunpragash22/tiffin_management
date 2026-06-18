package com.tiffin.tiffin_management.service;

import com.tiffin.tiffin_management.dto.request.OrderRequest;
import com.tiffin.tiffin_management.dto.request.OrderStatusUpdateRequest;
import com.tiffin.tiffin_management.dto.response.OrderResponse;
import com.tiffin.tiffin_management.dto.response.OrderStatsResponse;
import com.tiffin.tiffin_management.dto.response.PageResponse;
import com.tiffin.tiffin_management.entity.Order;
import com.tiffin.tiffin_management.entity.Student;
import com.tiffin.tiffin_management.entity.enums.OrderStatus;
import com.tiffin.tiffin_management.exception.BadRequestException;
import com.tiffin.tiffin_management.exception.ResourceNotFoundException;
import com.tiffin.tiffin_management.repository.OrderRepository;
import com.tiffin.tiffin_management.util.DtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final StudentService studentService;

    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {
        Student student = studentService.getCurrentStudent();

        if (request.getOrderDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot place order for past dates");
        }

        Order order = Order.builder()
                .student(student)
                .orderDate(request.getOrderDate())
                .mealType(request.getMealType())
                .quantity(request.getQuantity())
                .status(OrderStatus.PLACED)
                .totalAmount(request.getTotalAmount())
                .notes(request.getNotes())
                .build();

        return DtoMapper.toOrderResponse(orderRepository.save(order));
    }

    public PageResponse<OrderResponse> getMyOrders(int page, int size) {
        Student student = studentService.getCurrentStudent();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Order> orderPage = orderRepository.findByStudentId(student.getId(), pageable);
        return DtoMapper.toPageResponse(orderPage.map(DtoMapper::toOrderResponse));
    }

    public PageResponse<OrderResponse> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Order> orderPage = orderRepository.findAllByOrderByCreatedAtDesc(pageable);
        return DtoMapper.toPageResponse(orderPage.map(DtoMapper::toOrderResponse));
    }

    public OrderStatsResponse getOrderStats() {
        return OrderStatsResponse.builder()
                .total(orderRepository.count())
                .placed(orderRepository.countByStatus(OrderStatus.PLACED))
                .preparing(orderRepository.countByStatus(OrderStatus.PREPARING))
                .delivered(orderRepository.countByStatus(OrderStatus.DELIVERED))
                .cancelled(orderRepository.countByStatus(OrderStatus.CANCELLED))
                .build();
    }

    public OrderResponse getOrderById(Long id) {
        return DtoMapper.toOrderResponse(findOrderById(id));
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, OrderStatusUpdateRequest request) {
        Order order = findOrderById(id);
        order.setStatus(request.getStatus());
        return DtoMapper.toOrderResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse cancelOrder(Long id) {
        Order order = findOrderById(id);
        Student student = studentService.getCurrentStudent();

        if (!order.getStudent().getId().equals(student.getId())) {
            throw new BadRequestException("You can only cancel your own orders");
        }

        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Order cannot be cancelled in current status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.CANCELLED);
        return DtoMapper.toOrderResponse(orderRepository.save(order));
    }

    @Transactional
    public void deleteOrder(Long id) {
        Order order = findOrderById(id);
        orderRepository.delete(order);
    }

    public Order findOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }
}
