<?php
header('Content-Type: application/json');
require 'config.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'] ?? '';
    $code = $input['code'] ?? '';

    if (empty($email) || empty($code)) {
        throw new Exception("Email or code missing");
    }

    // Check the code in the temporary table
    $stmt = $pdo->prepare("SELECT * FROM temp_users WHERE email = ? AND verification_code = ?");
    $stmt->execute([$email, $code]);
    $temp_user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($temp_user) {
        // Transfer data to the users table
        $stmt = $pdo->prepare("INSERT INTO users (fullname, email, password, verified, verification_code) VALUES (?, ?, ?, 1, ?)");
        $stmt->execute([$temp_user['fullname'], $temp_user['email'], $temp_user['password'], $temp_user['verification_code']]);

        // Delete the entry from the temporary table
        $stmt = $pdo->prepare("DELETE FROM temp_users WHERE email = ?");
        $stmt->execute([$email]);

        echo json_encode(["success" => true, "message" => "Verification successful. You can now log in."]);
    } else {
        throw new Exception("Incorrect verification code or email not found.");
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>