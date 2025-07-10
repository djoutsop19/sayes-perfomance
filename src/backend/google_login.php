<?php
header('Content-Type: application/json');
require 'config.php';
session_start();

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data['email'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Invalid email."]);
    exit;
}

// Check if the user exists
$stmt = $pdo->prepare("SELECT id, fullname, email, verified FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(["success" => false, "message" => "User not found. Please sign up."]);
    exit;
}

if (!$user['verified']) {
    echo json_encode(["success" => false, "message" => "Your account is not verified."]);
    exit;
}

// Store the information in the session
$_SESSION['user'] = [
    'id' => $user['id'],
    'fullname' => $user['fullname'],
    'email' => $user['email']
];

echo json_encode(["success" => true, "message" => "Google login successful.", "user" => $_SESSION['user']]);
?>