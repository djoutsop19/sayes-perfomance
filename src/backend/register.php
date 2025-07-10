<?php
header('Content-Type: application/json');
require 'config.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $fullname = $input['fullname'] ?? '';
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email");
    }

    // Check if email is already registered
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->rowCount() > 0) {
        throw new Exception("Email already in use");
    }

    // Generate a 6-digit verification code
    $verification_code = random_int(100000, 999999);
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    // Temporarily store data in a temporary table
    $stmt = $pdo->prepare("INSERT INTO temp_users (fullname, email, password, verification_code) VALUES (?, ?, ?, ?)");
    $stmt->execute([$fullname, $email, $password_hash, $verification_code]);

    // Send verification email
    $subject = "Sayes Performance Verification Code";
    $message = "Hello $fullname,\n\nYour verification code is: $verification_code\n\nThank you.";
    $headers = "From: no-reply@sayesperformance.com";

    if (!mail($email, $subject, $message, $headers)) {
        throw new Exception("Error sending email");
    }

    echo json_encode(["success" => true, "message" => "Verification code sent to your email.", "email" => $email]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>