<?php
// Prevent any output before JSON response
ob_start();
header('Content-Type: application/json');
require 'config.php';

// Enable logs for debugging
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/htdocs/sayes-perfomance/php_errors.log');
ini_set('display_errors', 0); // Prevent errors from being output to response

$method = $_SERVER['REQUEST_METHOD'];

error_log("Request received: $method");
error_log("Raw input: " . file_get_contents("php://input"));

if ($method !== 'POST') {
    ob_end_clean();
    error_log("Unauthorized method: $method");
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
    exit;
}

try {
    $data = json_decode(file_get_contents("php://input"), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        ob_end_clean();
        error_log("POST failed: JSON decoding error - " . json_last_error_msg());
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "JSON format error: " . json_last_error_msg()]);
        exit;
    }

    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $message = trim($data['message'] ?? '');

    // Input validation
    if (!$name || !$email || !$message) {
        ob_end_clean();
        error_log("POST failed: Missing required fields");
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "All required fields must be filled."]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        ob_end_clean();
        error_log("POST failed: Invalid email - $email");
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid email address."]);
        exit;
    }

    // Sanitization to prevent injection in headers
    $name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

    // Configuration of headers to avoid spam
    $to = "edwin@sayesperfomance.se";
    $subject = "New Contact Message - Sayes Performance";
    $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";
    $headers = "From: Sayes Performance <no-reply@sayesperfomance.se>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    // Send the email
    if (mail($to, $subject, $body, $headers)) {
        ob_end_clean();
        error_log("POST succeeded: Email sent to $to from $email");
        echo json_encode(["success" => true, "message" => "Message sent successfully."]);
    } else {
        ob_end_clean();
        error_log("POST failed: Failed to send email to $to");
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error sending email."]);
    }
} catch (Exception $e) {
    ob_end_clean();
    error_log("POST failed: Error - " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}

// Clear any buffered output to ensure only JSON is sent
ob_end_flush();
?>