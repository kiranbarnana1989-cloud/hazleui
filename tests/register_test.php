<?php
// Quick integration test for registration endpoint
// Usage: php tests/register_test.php

$endpoint = 'http://localhost/hazleui/includes/functions.php';

// Generate a random email to avoid collisions
$rand = bin2hex(random_bytes(4));
$email = "test+{$rand}@example.com";

$data = [
    'action' => 'register',
    'name' => 'Test User',
    'email' => $email,
    'password' => 'Test12345!',
    'confirm_password' => 'Test12345!',
    'phone' => '9999999999',
    'collegeName' => 'Test College',
    'collegeCity' => 'Test City',
    'collegeState' => 'Test State'
];

$ch = curl_init($endpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);
$err = curl_error($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($err) {
    echo "CURL error: $err\n";
    exit(2);
}

echo "HTTP status: $status\n";
echo "Response: $response\n";

$decoded = json_decode($response, true);
if ($decoded && isset($decoded['success']) && $decoded['success'] === true) {
    echo "TEST PASS: Registration succeeded for $email\n";
    if (isset($decoded['user']['studentId'])) {
        echo "Student ID: " . $decoded['user']['studentId'] . "\n";
    }

    // Verify in database
    require_once __DIR__ . '/../includes/db_config.php';
    $conn = getDbConnection();
    if (!$conn) {
        echo "TEST WARN: Could not connect to DB to verify row\n";
        exit(0);
    }

    $stmt = $conn->prepare('SELECT id, studentId FROM hazle_users WHERE email = :email');
    $stmt->execute([':email' => $email]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row && !empty($row['studentId'])) {
        echo "DB CHECK PASS: Row exists with studentId = " . $row['studentId'] . "\n";
        exit(0);
    } else {
        echo "DB CHECK FAIL: No row found or studentId empty\n";
        exit(2);
    }
    exit(0);
} else {
    echo "TEST FAIL: Registration did not succeed\n";
    exit(1);
}
