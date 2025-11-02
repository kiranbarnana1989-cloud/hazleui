<?php
require_once 'db_config.php';

// Constants
define('REGISTRATION_FEE', 500.00);

// User Management Functions
function getUsers() {
    try {
        $conn = getDbConnection();
        if (!$conn) {
            throw new Exception("Database connection failed");
        }

        $stmt = $conn->query("SELECT * FROM users ORDER BY registrationDate DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        error_log("Error getting users: " . $e->getMessage());
        return [];
    }
}

function saveUser($userData) {
    try {
        $conn = getDbConnection();
        if (!$conn) {
            throw new Exception("Database connection failed");
        }

        $stmt = $conn->prepare("
            INSERT INTO users (
                studentId, name, email, password, phone, 
                collegeName, collegeCity, collegeState, 
                mockScore, mockRank
            ) VALUES (
                :studentId, :name, :email, :password, :phone,
                :collegeName, :collegeCity, :collegeState,
                :mockScore, :mockRank
            )
        ");

        // Generate random mock score and rank
        $mockScore = rand(0, 100);
        $mockRank = rand(1, 500);

        $result = $stmt->execute([
            ':studentId' => $userData['studentId'],
            ':name' => $userData['name'],
            ':email' => $userData['email'],
            ':password' => $userData['password'],
            ':phone' => $userData['phone'],
            ':collegeName' => $userData['collegeName'],
            ':collegeCity' => $userData['collegeCity'],
            ':collegeState' => $userData['collegeState'],
            ':mockScore' => $mockScore,
            ':mockRank' => $mockRank
        ]);

        return $result;
    } catch (Exception $e) {
        error_log("Error saving user: " . $e->getMessage());
        return false;
    }
}

function findUser($identifier, $password) {
    try {
        $conn = getDbConnection();
        if (!$conn) {
            throw new Exception("Database connection failed");
        }

        $stmt = $conn->prepare("
            SELECT * FROM users 
            WHERE (email = :identifier OR studentId = :identifier)
            AND password = :password
            AND status = 'active'
        ");

        $stmt->execute([
            ':identifier' => $identifier,
            ':password' => $password
        ]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        error_log("Error finding user: " . $e->getMessage());
        return null;
    }
}

function isEmailOrStudentIdTaken($email, $studentId) {
    try {
        $conn = getDbConnection();
        if (!$conn) {
            throw new Exception("Database connection failed");
        }

        $stmt = $conn->prepare("
            SELECT COUNT(*) FROM users 
            WHERE email = :email OR studentId = :studentId
        ");

        $stmt->execute([
            ':email' => $email,
            ':studentId' => $studentId
        ]);

        return $stmt->fetchColumn() > 0;
    } catch (Exception $e) {
        error_log("Error checking duplicates: " . $e->getMessage());
        return true; // Safer to return true on error
    }
}

// Admin Functions
function validateAdmin($username, $password) {
    try {
        $conn = getDbConnection();
        if (!$conn) {
            throw new Exception("Database connection failed");
        }

        $stmt = $conn->prepare("
            SELECT * FROM admins 
            WHERE username = :username 
            AND password = :password 
            AND status = 'active'
        ");

        $stmt->execute([
            ':username' => $username,
            ':password' => $password
        ]);

        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($admin) {
            // Update last login
            $updateStmt = $conn->prepare("
                UPDATE admins 
                SET lastLogin = CURRENT_TIMESTAMP 
                WHERE id = :id
            ");
            $updateStmt->execute([':id' => $admin['id']]);
            return true;
        }
        
        return false;
    } catch (Exception $e) {
        error_log("Error validating admin: " . $e->getMessage());
        return false;
    }
}

// Error logging function
function logError($message, $data = null) {
    error_log(sprintf(
        "[%s] Error: %s | Data: %s",
        date('Y-m-d H:i:s'),
        $message,
        $data ? json_encode($data) : 'none'
    ));
}

// API Endpoints
header('Content-Type: application/json');

try {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!isset($data['action'])) {
        throw new Exception('No action specified');
    }

    switch ($data['action']) {
        case 'register':
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (isEmailOrStudentIdTaken($data['email'], $data['studentId'])) {
                echo json_encode(['success' => false, 'message' => 'Email or Student ID already registered']);
                exit;
            }
            
            $userData = array_merge($data, [
                'registrationDate' => date('Y-m-d H:i:s'),
                'mockScore' => rand(0, 100),
                'mockRank' => rand(1, 500)
            ]);
            
            if (saveUser($userData)) {
                echo json_encode(['success' => true, 'message' => 'Registration successful']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Registration failed']);
            }
            break;
            
        case 'login':
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Input validation
            if (!isset($data['identifier']) || !isset($data['password'])) {
                echo json_encode([
                    'success' => false, 
                    'message' => 'Missing credentials'
                ]);
                break;
            }

            logError('Login attempt', ['identifier' => $data['identifier']]);
            $user = findUser($data['identifier'], $data['password']);
            
            if ($user) {
                logError('Login successful', ['user' => $user['studentId']]);
                echo json_encode([
                    'success' => true, 
                    'user' => $user,
                    'message' => 'Login successful'
                ]);
            } else {
                logError('Login failed', ['identifier' => $data['identifier']]);
                echo json_encode([
                    'success' => false, 
                    'message' => 'Invalid email/ID or password'
                ]);
            }
            break;
            
        case 'admin_login':
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (validateAdmin($data['username'], $data['password'])) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid admin credentials']);
            }
            break;
            
        case 'get_users':
            $data = json_decode(file_get_contents('php://input'), true);
            if (isset($data['admin']) && $data['admin'] === true) {
                echo json_encode(['success' => true, 'users' => getUsers()]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            }
            break;
            
        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }
} catch (Exception $e) {
    logError($e->getMessage(), isset($data) ? $data : null);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred: ' . $e->getMessage(),
        'debug' => [
            'input' => isset($input) ? $input : null,
            'parsed' => isset($data) ? $data : null
        ]
    ]);
}
?>