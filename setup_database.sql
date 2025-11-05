-- Create database if not exists
CREATE DATABASE IF NOT EXISTS hazleui;
USE hazleui;

CREATE TABLE IF NOT EXISTS hazle_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- studentId will be populated by trigger: HAZLE + zero-padded id (e.g., HAZLE000001)
    studentId VARCHAR(50) UNIQUE DEFAULT NULL COMMENT 'Auto-generated HAZLE ID (populated by trigger)',
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    login_attempts INT DEFAULT 0,
    last_login_attempt DATETIME,
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

-- Trigger to populate studentId from the upcoming AUTO_INCREMENT value
-- Note: generated columns cannot reference AUTO_INCREMENT in MySQL/MariaDB; a trigger is used instead.
DELIMITER $$
CREATE TRIGGER before_hazle_users_insert
BEFORE INSERT ON hazle_users
FOR EACH ROW
BEGIN
        DECLARE next_id BIGINT;
        IF NEW.studentId IS NULL OR NEW.studentId = '' THEN
                SELECT AUTO_INCREMENT INTO next_id
                FROM INFORMATION_SCHEMA.TABLES
                WHERE TABLE_SCHEMA = DATABASE()
                    AND TABLE_NAME = 'hazle_users';

                SET NEW.studentId = CONCAT('HAZLE', LPAD(next_id, 6, '0'));
        END IF;
END$$
DELIMITER ;



-- Create admin table
CREATE TABLE IF NOT EXISTS hazle_admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    login_attempts INT DEFAULT 0,
    last_login_attempt DATETIME,
    lastLogin DATETIME,
    status ENUM('active', 'blocked') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin user (password is SHA-256 hash of 'admin')
INSERT INTO hazle_admins (username, password, name) 
VALUES ('admin@example.com', SHA2('admin', 256), 'Administrator')
ON DUPLICATE KEY UPDATE name = 'Administrator';