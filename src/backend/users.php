<?php
header('Content-Type: application/json');
require 'config.php';
session_start();

// Activer les logs pour débogage
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log'); // Assure-toi que ce chemin est correct pour ton serveur

$method = $_SERVER['REQUEST_METHOD'];

error_log("Requête reçue: $method");

if ($method !== 'GET') {
    error_log("Méthode non autorisée: $method");
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Méthode non autorisée."]);
    exit;
}

error_log("GET request received");
if (!isset($_SESSION['user']) && !isset($_SESSION['admin'])) {
    error_log("GET failed: Non authentifié");
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Non authentifié. Veuillez vous connecter."]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, fullname, email, team, age, district, phone, player_position, avatar,country FROM users ORDER BY fullname ASC");
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    error_log("GET succeeded: " . count($users) . " utilisateurs récupérés");
    echo json_encode(["success" => true, "users" => $users]);
} catch (PDOException $e) {
    error_log("GET failed: Erreur PDO - " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur serveur: " . $e->getMessage()]);
}
?>