-- ============================================
-- Hostel Finder Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS hostel_finder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hostel_finder;

-- Hostels Table
CREATE TABLE IF NOT EXISTS hostels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hostel_name VARCHAR(200) NOT NULL,
    owner_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20),
    city VARCHAR(100) NOT NULL,
    area VARCHAR(100),
    address TEXT NOT NULL,
    nearby_university VARCHAR(200),
    rent DECIMAL(10,2) NOT NULL,
    security_fee DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    hostel_type ENUM('Boys Hostel', 'Girls Hostel', 'Family Hostel', 'Executive Hostel') NOT NULL DEFAULT 'Boys Hostel',
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    rating DECIMAL(2,1) DEFAULT 0,
    total_reviews INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Hostel Images Table
CREATE TABLE IF NOT EXISTS hostel_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hostel_id INT NOT NULL,
    image_path VARCHAR(500) NOT NULL,
    is_primary TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE
);

-- Facilities Table
CREATE TABLE IF NOT EXISTS facilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hostel_id INT NOT NULL UNIQUE,
    wifi TINYINT(1) DEFAULT 0,
    laundry TINYINT(1) DEFAULT 0,
    mess TINYINT(1) DEFAULT 0,
    parking TINYINT(1) DEFAULT 0,
    cctv TINYINT(1) DEFAULT 0,
    security_guard TINYINT(1) DEFAULT 0,
    generator TINYINT(1) DEFAULT 0,
    FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE
);

-- Admin Table
CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (password: admin123)
INSERT INTO admin (username, password) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE username=username;

-- ============================================
-- Sample Data
-- ============================================

INSERT INTO hostels (hostel_name, owner_name, phone, whatsapp, city, area, address, nearby_university, rent, security_fee, description, hostel_type, status, rating, total_reviews) VALUES
('Al-Noor Boys Hostel', 'Muhammad Asif', '0300-1234567', '0300-1234567', 'Islamabad', 'G-10', 'House 45, Street 5, G-10/2, Islamabad', 'NUST', 8000, 10000, 'Comfortable boys hostel near NUST with all basic amenities. Clean rooms, 24/7 electricity backup, and homely environment.', 'Boys Hostel', 'approved', 4.5, 28),
('Fatima Girls Hostel', 'Mrs. Sadia Khan', '0321-9876543', '0321-9876543', 'Islamabad', 'H-11', 'Plot 22, H-11/4, Near COMSATS University, Islamabad', 'COMSATS', 10000, 15000, 'Safe and secure girls hostel with female staff. AC rooms available. Mess facility with hygienic food. CCTV surveillance throughout.', 'Girls Hostel', 'approved', 4.8, 45),
('Student Paradise Hostel', 'Ali Hassan', '0333-5556789', '0333-5556789', 'Rawalpindi', 'Satellite Town', 'Block B, Satellite Town, Rawalpindi', 'Air University', 6500, 8000, 'Budget-friendly hostel ideal for students. Walking distance from Air University. Meals available at affordable prices.', 'Boys Hostel', 'approved', 4.2, 19),
('Green Valley Hostel', 'Imran Malik', '0345-1112233', '0345-1112233', 'Lahore', 'Gulberg', 'Main Boulevard, Gulberg III, Lahore', 'UET', 9000, 12000, 'Modern hostel with WiFi, laundry service, and 24/7 security. Close to University of Engineering & Technology Lahore.', 'Boys Hostel', 'approved', 4.6, 33),
('Pak Hostel for Girls', 'Mrs. Rehana Bibi', '0311-4445566', '0311-4445566', 'Lahore', 'Township', 'Street 12, Township, Lahore', 'FAST', 11000, 15000, 'Premium girls hostel with well-furnished rooms. CCTV cameras, biometric access, and female security guard. Meals included.', 'Girls Hostel', 'approved', 4.7, 52),
('Capital Executive Hostel', 'Dr. Tariq Mehmood', '0333-7778899', '0333-7778899', 'Islamabad', 'F-7', 'Street 25, F-7/3, Islamabad', 'IIUI', 15000, 20000, 'Executive-level accommodation for professionals and students. Fully furnished rooms with AC, attached bath, and broadband internet.', 'Executive Hostel', 'approved', 4.9, 17);

-- Insert facilities for sample hostels
INSERT INTO facilities (hostel_id, wifi, laundry, mess, parking, cctv, security_guard, generator) VALUES
(1, 1, 0, 1, 1, 1, 1, 1),
(2, 1, 1, 1, 0, 1, 1, 1),
(3, 1, 0, 1, 0, 1, 0, 0),
(4, 1, 1, 0, 1, 1, 1, 1),
(5, 1, 1, 1, 0, 1, 1, 1),
(6, 1, 1, 0, 1, 1, 1, 1);

-- Insert sample images (using placeholder paths - replace with actual images)
INSERT INTO hostel_images (hostel_id, image_path, is_primary) VALUES
(1, 'uploads/hostel1_1.jpg', 1),
(2, 'uploads/hostel2_1.jpg', 1),
(3, 'uploads/hostel3_1.jpg', 1),
(4, 'uploads/hostel4_1.jpg', 1),
(5, 'uploads/hostel5_1.jpg', 1),
(6, 'uploads/hostel6_1.jpg', 1);
