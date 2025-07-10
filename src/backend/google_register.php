<?php
header('Content-Type: application/json');
require 'config.php';
session_start();

$data = json_decode(file_get_contents("php://input"), true);

$fullname = trim($data['fullname'] ?? '');
$email = trim($data['email'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !$fullname) {
    echo json_encode(["success" => false, "message" => "Invalid data."]);
    exit;
}

// Check if the email already exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->rowCount() > 0) {
    echo json_encode(["success" => false, "message" => "Email already in use."]);
    exit;
}

// Generate a temporary password
$tempPassword = bin2hex(random_bytes(8)); // Generates a random 16-character string
$hashedPassword = password_hash($tempPassword, PASSWORD_DEFAULT);

// Insert the user with verified = 1 and verification_code = 'google'
$stmt = $pdo->prepare("INSERT INTO users (fullname, email, password, verified, verification_code) VALUES (?, ?, ?, 1, 'google')");
$stmt->execute([$fullname, $email, $hashedPassword]);

// Store the information in the session
$_SESSION['user'] = [
    'id' => $pdo->lastInsertId(),
    'fullname' => $fullname,
    'email' => $email,
    'needs_password_update' => true // Indicates that the user must set a password
];

echo json_encode([
    "success" => true,
    "message" => "Google registration successful. Please set a password.",
    "user" => $_SESSION['user'],
    "temp_password" => $tempPassword // Send the temporary password for information
]);
?>