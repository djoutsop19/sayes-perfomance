<?php
header('Content-Type: application/json');
require 'config.php';
session_start();

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !$password) {
    echo json_encode(["success" => false, "message" => "Données invalides."]);
    exit;
}

// Vérifier si l'utilisateur existe
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->rowCount() === 0) {
    echo json_encode(["success" => false, "message" => "Utilisateur non trouvé."]);
    exit;
}

// Mettre à jour le mot de passe
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = ?");
$stmt->execute([$hashedPassword, $email]);

// Mettre à jour la session
$_SESSION['user']['needs_password_update'] = false;

echo json_encode(["success" => true, "message" => "Mot de passe mis à jour avec succès."]);
?>