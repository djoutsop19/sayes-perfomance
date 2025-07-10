<?php
header('Content-Type: application/json');
require 'config.php';
session_start();

ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/htdocs/sayes-perfomance/php_errors.log');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    error_log("Méthode non autorisée: " . $_SERVER['REQUEST_METHOD']);
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Méthode non autorisée."]);
    exit;
}

if (isset($_SESSION['admin'])) {
    error_log("Session admin détectée: " . json_encode($_SESSION['admin']));
    echo json_encode(["success" => true, "admin" => $_SESSION['admin']]);
    exit;
}

if (isset($_SESSION['user'])) {
    $user_id = $_SESSION['user']['id'];
    try {
        $stmt = $pdo->prepare("SELECT id, fullname, email, avatar FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            $_SESSION['user'] = $user;
            error_log("Session utilisateur détectée: " . json_encode($user));
            echo json_encode(["success" => true, "user" => $user]);
        } else {
            error_log("Utilisateur non trouvé pour ID: $user_id");
            echo json_encode(["success" => false, "message" => "Utilisateur non trouvé."]);
        }
    } catch (PDOException $e) {
        error_log("Erreur PDO: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erreur serveur: " . $e->getMessage()]);
    }
    exit;
}

error_log("Aucune session active");
http_response_code(401);
echo json_encode(["success" => false, "message" => "Non authentifié. Veuillez vous connecter."]);
?>