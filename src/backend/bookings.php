<?php
header('Content-Type: application/json');
require 'config.php';
session_start();

ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/htdocs/sayes-perfomance/php_errors.log');

$method = $_SERVER['REQUEST_METHOD'];

error_log("Requête reçue: $method");

if (!isset($_SESSION['user']) && !isset($_SESSION['admin'])) {
    error_log("$method failed: Non authentifié");
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Non authentifié. Veuillez vous connecter."]);
    exit;
}

try {
    if ($method === 'GET') {
        $stmt = $pdo->prepare("
            SELECT m.id, m.user_id, m.fullname, m.email, m.avatar, m.package_name, m.package_type, 
                   m.price_per_month, m.binding_time, u.phone, u.district
            FROM membership m
            LEFT JOIN users u ON m.user_id = u.id OR m.email = u.email
            ORDER BY m.created_at DESC
        ");
        $stmt->execute();
        $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        error_log("GET succeeded: " . count($bookings) . " bookings récupérés");
        echo json_encode(["success" => true, "bookings" => $bookings]);
    } elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'] ?? '';
        $fullname = $data['fullname'] ?? '';
        $email = $data['email'] ?? '';
        $package_name = $data['package_name'] ?? '';

        if (!$id || !$fullname || !$email || !$package_name) {
            error_log("PUT failed: Champs obligatoires manquants");
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Tous les champs obligatoires doivent être remplis."]);
            exit;
        }

        $stmt = $pdo->prepare("
            UPDATE membership 
            SET fullname = ?, email = ?, package_name = ?
            WHERE id = ?
        ");
        $stmt->execute([$fullname, $email, $package_name, $id]);
        error_log("PUT succeeded: Booking $id mis à jour");
        echo json_encode(["success" => true, "message" => "Booking mis à jour avec succès."]);
    } elseif ($method === 'DELETE') {
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id'] ?? '';

        if (!$id) {
            error_log("DELETE failed: ID manquant");
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "ID du booking requis."]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM membership WHERE id = ?");
        $stmt->execute([$id]);
        error_log("DELETE succeeded: Booking $id supprimé");
        echo json_encode(["success" => true, "message" => "Booking supprimé avec succès."]);
    } else {
        error_log("Méthode non autorisée: $method");
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Méthode non autorisée."]);
    }
} catch (PDOException $e) {
    error_log("$method failed: Erreur PDO - " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur serveur: " . $e->getMessage()]);
}
?>