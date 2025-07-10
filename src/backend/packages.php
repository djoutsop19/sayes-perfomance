<?php
header('Content-Type: application/json');
require 'config.php';
session_start();

// Enable logs for debugging
ini_set('log_errors', 1);
ini_set('error_log', 'C:/xampp/htdocs/sayes-perfomance/php_errors.log');
ini_set('display_errors', 0);

$method = $_SERVER['REQUEST_METHOD'];

error_log("Request received: $method");

switch ($method) {
    case 'POST':
        error_log("POST request received");
        if (!isset($_SESSION['admin'])) {
            error_log("POST failed: No admin session");
            http_response_code(403);
            echo json_encode(["success" => false, "message" => "Access denied. Admin required."]);
            exit;
        }

        $data = json_decode(file_get_contents("php://input"), true);
        error_log("POST data received: " . json_encode($data));

        $membership_required = isset($data['membership_required']) ? (int)$data['membership_required'] : 0;
        $package_name = trim($data['package_name'] ?? '');
        $frequency = trim($data['frequency'] ?? '');
        $price_per_month = isset($data['price_per_month']) ? (float)$data['price_per_month'] : 0;
        $binding_time = trim($data['binding_time'] ?? '');
        $category = trim($data['category'] ?? '');

        if (!$package_name || !$frequency || !$price_per_month || !$category) {
            error_log("POST failed: Missing required fields");
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "All required fields must be filled."]);
            exit;
        }

        if (!in_array($category, ['Group Training', 'Private', 'Summer Camp'])) {
            error_log("POST failed: Invalid category - $category");
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid category."]);
            exit;
        }

        try {
            $stmt = $pdo->prepare(
                "INSERT INTO packages (membership_required, package_name, frequency, price_per_month, binding_time, category) 
                 VALUES (?, ?, ?, ?, ?, ?)"
            );
            $stmt->execute([$membership_required, $package_name, $frequency, $price_per_month, $binding_time, $category]);
            error_log("POST succeeded: Package added");
            echo json_encode(["success" => true, "message" => "Package added successfully."]);
        } catch (PDOException $e) {
            error_log("POST failed: PDO error - " . $e->getMessage());
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
        }
        break;

    case 'GET':
        error_log("GET request received");
        $category = isset($_GET['category']) ? trim($_GET['category']) : null;
        error_log("GET category: " . ($category ?? 'none'));

        try {
            if ($category) {
                if (!in_array($category, ['Group Training', 'Private', 'Summer Camp'])) {
                    error_log("GET failed: Invalid category - $category");
                    http_response_code(400);
                    echo json_encode(["success" => false, "message" => "Invalid category."]);
                    exit;
                }
                $stmt = $pdo->prepare("SELECT * FROM packages WHERE category = ? ORDER BY created_at DESC");
                $stmt->execute([$category]);
            } else {
                $stmt = $pdo->prepare("SELECT * FROM packages ORDER BY created_at DESC");
                $stmt->execute();
            }

            $packages = $stmt->fetchAll(PDO::FETCH_ASSOC);
            error_log("GET succeeded: " . count($packages) . " packages retrieved");
            echo json_encode(["success" => true, "packages" => $packages]);
        } catch (PDOException $e) {
            error_log("GET failed: PDO error - " . $e->getMessage());
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
        }
        break;

    case 'PUT':
        error_log("PUT request received");
        if (!isset($_SESSION['admin'])) {
            error_log("PUT failed: No admin session");
            http_response_code(403);
            echo json_encode(["success" => false, "message" => "Access denied. Admin required."]);
            exit;
        }

        $data = json_decode(file_get_contents("php://input"), true);
        error_log("PUT data received: " . json_encode($data));
        $id = isset($data['id']) ? (int)$data['id'] : 0;

        if (!$id) {
            error_log("PUT failed: Package ID required");
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Package ID required."]);
            exit;
        }

        $membership_required = isset($data['membership_required']) ? (int)$data['membership_required'] : 0;
        $package_name = trim($data['package_name'] ?? '');
        $frequency = trim($data['frequency'] ?? '');
        $price_per_month = isset($data['price_per_month']) ? (float)$data['price_per_month'] : 0;
        $binding_time = trim($data['binding_time'] ?? '');
        $category = trim($data['category'] ?? '');

        if (!$package_name || !$frequency || !$price_per_month || !$category) {
            error_log("PUT failed: Missing required fields");
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "All required fields must be filled."]);
            exit;
        }

        if (!in_array($category, ['Group Training', 'Private', 'Summer Camp'])) {
            error_log("PUT failed: Invalid category - $category");
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid category."]);
            exit;
        }

        try {
            $stmt = $pdo->prepare("SELECT id FROM packages WHERE id = ?");
            $stmt->execute([$id]);
            if (!$stmt->fetch()) {
                error_log("PUT failed: Package ID $id not found");
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Package not found."]);
                exit;
            }

            $stmt = $pdo->prepare(
                "UPDATE packages SET membership_required = ?, package_name = ?, frequency = ?, price_per_month = ?, binding_time = ?, category = ? WHERE id = ?"
            );
            $stmt->execute([$membership_required, $package_name, $frequency, $price_per_month, $binding_time, $category, $id]);
            error_log("PUT succeeded: Package ID $id modified");
            echo json_encode(["success" => true, "message" => "Package modified successfully."]);
        } catch (PDOException $e) {
            error_log("PUT failed: PDO error - " . $e->getMessage());
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
        }
        break;

    case 'DELETE':
        error_log("DELETE request received");
        if (!isset($_SESSION['admin'])) {
            error_log("DELETE failed: No admin session");
            http_response_code(403);
            echo json_encode(["success" => false, "message" => "Access denied. Admin required."]);
            exit;
        }

        $data = json_decode(file_get_contents("php://input"), true);
        error_log("DELETE data received: " . json_encode($data));
        $id = isset($data['id']) ? (int)$data['id'] : 0;

        if (!$id) {
            error_log("DELETE failed: Package ID required");
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Package ID required."]);
            exit;
        }

        try {
            $stmt = $pdo->prepare("SELECT id FROM packages WHERE id = ?");
            $stmt->execute([$id]);
            if (!$stmt->fetch()) {
                error_log("DELETE failed: Package ID $id not found");
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Package not found."]);
                exit;
            }

            $pdo->beginTransaction();
            $stmt = $pdo->prepare("DELETE FROM packages WHERE id = ?");
            $stmt->execute([$id]);
            $pdo->commit();
            error_log("DELETE succeeded: Package ID $id deleted");
            echo json_encode(["success" => true, "message" => "Package deleted successfully.", "id" => $id]);
        } catch (PDOException $e) {
            $pdo->rollBack();
            error_log("DELETE failed: PDO error - " . $e->getMessage());
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
        }
        break;

    default:
        error_log("Method not allowed: $method");
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed."]);
        break;
}
?>