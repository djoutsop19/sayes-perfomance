<?php
header('Content-Type: application/json');
require 'config.php';
session_start();

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Not authenticated. Please log in."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$phone = trim($data['phone'] ?? '');
$username = trim($data['username'] ?? $_SESSION['user']['fullname']); // Keep existing if not provided
$age = isset($data['age']) ? (int)$data['age'] : null;
$team = trim($data['team'] ?? '');
$country = trim($data['country'] ?? '');
$player_position = trim($data['player_position'] ?? '');
$district = trim($data['district'] ?? '');
$avatar = $data['avatar'] ?? null; // Image in Base64

// Check if username (fullname) is unique (if it changes)
if ($username !== $_SESSION['user']['fullname']) {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE fullname = ? AND id != ?");
    $stmt->execute([$username, $_SESSION['user']['id']]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "This username is already in use."]);
        exit;
    }
}

// Update the profile
$stmt = $pdo->prepare(
    "UPDATE users SET 
        phone = ?, 
        fullname = ?, 
        age = ?, 
        team = ?, 
        country = ?, 
        player_position = ?, 
        district = ?, 
        avatar = ? 
    WHERE id = ?"
);
$stmt->execute([
    $phone ?: null,
    $username,
    $age,
    $team ?: null,
    $country ?: null,
    $player_position ?: null,
    $district ?: null,
    $avatar ?: null,
    $_SESSION['user']['id']
]);

// Update the session
$_SESSION['user']['fullname'] = $username;

echo json_encode(["success" => true, "message" => "Profile updated successfully."]);
?>