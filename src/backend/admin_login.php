<?php
header('Content-Type: application/json');
require 'config.php';
session_start();

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email and password are required."]);
    exit;
}

// Check if the admin exists
$stmt = $pdo->prepare("SELECT id, fullname, email, password FROM admins WHERE email = ?");
$stmt->execute([$email]);
$admin = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$admin || !password_verify($password, $admin['password'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Incorrect email or password."]);
    exit;
}

// Create a session
$_SESSION['admin'] = [
    'id' => $admin['id'],
    'fullname' => $admin['fullname'],
    'email' => $admin['email']
];

echo json_encode(["success" => true, "message" => "Admin login successful.", "admin" => $_SESSION['admin']]);
?>