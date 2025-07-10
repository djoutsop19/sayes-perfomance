<?php
header('Content-Type: application/json');
require 'config.php';
session_start();

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Non authentifié. Veuillez vous connecter."]);
    exit;
}

// Récupérer les informations du profil
$stmt = $pdo->prepare(
    "SELECT id, fullname, email, phone, age, team, country, player_position, district, avatar 
     FROM users WHERE id = ?"
);
$stmt->execute([$_SESSION['user']['id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(["success" => false, "message" => "Utilisateur non trouvé."]);
    exit;
}

echo json_encode(["success" => true, "user" => $user]);
?>