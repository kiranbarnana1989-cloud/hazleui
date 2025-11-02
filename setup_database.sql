-- Create database if not exists
CREATE DATABASE IF NOT EXISTS hazleui;
USE hazleui;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studentId VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    collegeName VARCHAR(100) NOT NULL,
    collegeCity VARCHAR(50) NOT NULL,
    collegeState VARCHAR(50) NOT NULL,
    registrationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    mockScore INT DEFAULT 0,
    mockRank INT DEFAULT 0,
    transactionId VARCHAR(100),
    status ENUM('pending', 'active', 'blocked') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create admin table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    lastLogin DATETIME,
    status ENUM('active', 'blocked') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin user
INSERT INTO admins (username, password, name) 
VALUES ('admin@example.com', 'admin', 'Administrator')
ON DUPLICATE KEY UPDATE name = 'Administrator';