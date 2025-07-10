<?php
header('Content-Type: application/json');
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

$fullname = trim($data['fullname'] ?? '');
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

if (!$fullname || !$email || !$password) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "All fields are required."]);
    exit;
}

// Check if the email or fullname already exists
$stmt = $pdo->prepare("SELECT id FROM admins WHERE email = ? OR fullname = ?");
$stmt->execute([$email, $fullname]);
if ($stmt->fetch()) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "The email or name is already in use."]);
    exit;
}

// Hash the password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insert the admin
$stmt = $pdo->prepare(
    "INSERT INTO admins (fullname, email, password) 
     VALUES (?, ?, ?)"
);
$stmt->execute([$fullname, $email, $hashed_password]);

echo json_encode(["success" => true, "message" => "Admin account created successfully."]);
?>