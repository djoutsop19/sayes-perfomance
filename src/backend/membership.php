<?php
header('Content-Type: application/json');
require 'config.php';
session_start();

// Activer les logs pour débogage
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/htdocs/sayes-perfomance/php_errors.log');

$method = $_SERVER['REQUEST_METHOD'];

error_log("Requête reçue: $method");

if ($method !== 'POST') {
    error_log("Méthode non autorisée: $method");
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Méthode non autorisée."]);
    exit;
}

if (!isset($_SESSION['user']) && !isset($_SESSION['admin'])) {
    error_log("POST failed: Non authentifié");
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Non authentifié. Veuillez vous connecter."]);
    exit;
}

try {
    $fullname = $_POST['fullname'] ?? '';
    $email = $_POST['email'] ?? '';
    $package_id = $_POST['package_id'] ?? '';
    $package_name = $_POST['package_name'] ?? '';
    $package_type = $_POST['package_type'] ?? '';
    $price_per_month = $_POST['price_per_month'] ?? '';
    $binding_time = $_POST['binding_time'] ?? '';

    if (!$fullname || !$email || !$package_id || !$package_name || !$package_type || !$price_per_month || !$binding_time) {
        error_log("POST failed: Champs obligatoires manquants");
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Tous les champs obligatoires doivent être remplis."]);
        exit;
    }

    // Gestion de l'upload de l'avatar
    $avatar_url = null;
    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = 'C:/xampp/htdocs/sayes-perfomance/uploads/avatars/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        $avatar_name = uniqid() . '_' . basename($_FILES['avatar']['name']);
        $avatar_path = $upload_dir . $avatar_name;
        if (move_uploaded_file($_FILES['avatar']['tmp_name'], $avatar_path)) {
            $avatar_url = '/uploads/avatars/' . $avatar_name;
        } else {
            error_log("POST failed: Échec de l'upload de l'avatar");
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Erreur lors de l'upload de l'avatar."]);
            exit;
        }
    }

    // Insérer dans la table membership
    $stmt = $pdo->prepare("
        INSERT INTO membership (user_id, fullname, email, avatar, package_id, package_name, package_type, price_per_month, binding_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $user_id = $_SESSION['user']['id'] ?? $_SESSION['admin']['id'] ?? null;
    $stmt->execute([$user_id, $fullname, $email, $avatar_url, $package_id, $package_name, $package_type, $price_per_month, $binding_time]);

    error_log("POST succeeded: Membership créé pour $fullname (email: $email)");
    echo json_encode(["success" => true, "message" => "Inscription au membership réussie."]);
} catch (PDOException $e) {
    error_log("POST failed: Erreur PDO - " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur serveur: " . $e->getMessage()]);
}
?>