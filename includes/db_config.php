<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'i10710337_hazle');
define('DB_PASS', 'i10710337_hazle');
define('DB_NAME', 'i10710337_hazle');

/**
 * Get database status
 * @return array Array containing status information
 */
function checkDatabaseStatus() {
    try {
        $conn = getDbConnection();
        if (!$conn) {
            return ['status' => false, 'message' => 'Inactive'];
        }
        // Test a simple query to ensure connection is alive
        $stmt = $conn->query('SELECT 1');
        if ($stmt === false) {
            return ['status' => false, 'message' => 'Inactive'];
        }
        $version = $conn->query('SELECT VERSION() as version')->fetch(PDO::FETCH_ASSOC);
        return ['status' => true, 'message' => 'Active', 'version' => $version['version'] ?? 'unknown'];
    } catch(Exception $e) {
        error_log('DB status check failed: ' . $e->getMessage());
        return ['status' => false, 'message' => 'Inactive'];
    }
}

function getDbConnection() {
    try {
        $DB_TYPE = 'mysql'; // Always use mysql for MariaDB and MySQL
        $conn = new PDO(
            "$DB_TYPE:host=" . DB_HOST . ";dbname=" . DB_NAME,
            DB_USER,
            DB_PASS
        );
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch(PDOException $e) {
        error_log("Connection failed: " . $e->getMessage());
        return null;
    }
}
?>