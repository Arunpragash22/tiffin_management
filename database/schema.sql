-- ============================================================
-- Tiffin Management System - MySQL Database Schema
-- Database: tiffin_db
-- MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS tiffin_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tiffin_db;

-- ------------------------------------------------------------
-- users: authentication (admin + student login accounts)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'STUDENT') NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT TRUE,
    verification_token VARCHAR(100) NULL,
    verification_token_expires_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- students: student profile details (linked 1:1 with users)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    physical_address VARCHAR(500) NOT NULL,
    aadhaar_number VARCHAR(12) NOT NULL UNIQUE,
    aadhaar_image_path VARCHAR(500) NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_students_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- attendance: daily student attendance records
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    attendance_date DATE NOT NULL,
    present BOOLEAN NOT NULL DEFAULT TRUE,
    notes VARCHAR(500) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_attendance_student
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT uk_attendance_student_date UNIQUE (student_id, attendance_date)
);

-- ------------------------------------------------------------
-- menus: daily / weekly tiffin menus
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS menus (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    menu_date DATE NOT NULL,
    menu_type ENUM('DAILY', 'WEEKLY') NOT NULL,
    breakfast VARCHAR(500) NOT NULL,
    lunch VARCHAR(500) NOT NULL,
    dinner VARCHAR(500) NOT NULL,
    description VARCHAR(1000) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- orders: student tiffin orders
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    order_date DATE NOT NULL,
    meal_type ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'FULL_DAY') NOT NULL,
    quantity INT NOT NULL,
    status ENUM('PLACED', 'PREPARING', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PLACED',
    total_amount DECIMAL(10, 2) NULL,
    notes VARCHAR(500) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_student
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- indexes
-- ------------------------------------------------------------
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verification_token ON users(verification_token);

CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_mobile ON students(mobile_number);

CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);

CREATE INDEX idx_menus_date ON menus(menu_date);
CREATE INDEX idx_menus_type ON menus(menu_type);

CREATE INDEX idx_orders_student_id ON orders(student_id);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_status ON orders(status);

-- ------------------------------------------------------------
-- optional: upgrade script for existing databases
-- (safe to run once; ignore errors if columns already exist)
-- ------------------------------------------------------------
-- ALTER TABLE users ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT TRUE;
-- ALTER TABLE users ADD COLUMN verification_token VARCHAR(100) NULL;
-- ALTER TABLE users ADD COLUMN verification_token_expires_at DATETIME NULL;
