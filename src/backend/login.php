<?php
header('Content-Type: application/json');
require 'config.php';

session_start(); // Démarrer la session

$data = json_decode(file_get_contents("php://input"), true);

$identifier = trim($data['identifier'] ?? ''); // Accepte email ou fullname
$password = $data['password'] ?? '';

if (!$identifier || !$password) {
    echo json_encode(["success" => false, "message" => "Identifiants invalides."]);
    exit;
}

// Récupération de l'utilisateur par email ou fullname
$stmt = $pdo->prepare("SELECT id, fullname, email, password, verified FROM users WHERE email = ? OR fullname = ?");
$stmt->execute([$identifier, $identifier]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(["success" => false, "message" => "Email, nom complet ou mot de passe incorrect."]);
    exit;
}

if (!$user['verified']) {
    echo json_encode(["success" => false, "message" => "Votre compte n'est pas vérifié. Veuillez vérifier votre email."]);
    exit;
}

if (password_verify($password, $user['password'])) {
    // Stocker les informations de l'utilisateur dans la session
    $_SESSION['user'] = [
        'id' => $user['id'],
        'fullname' => $user['fullname'],
        'email' => $user['email']
    ];
    unset($user['password']); // Ne pas retourner le mot de passe
    echo json_encode(["success" => true, "message" => "Connexion réussie.", "user" => $user]);
} else {
    echo json_encode(["success" => false, "message" => "Email, nom complet ou mot de passe incorrect."]);
}
?>