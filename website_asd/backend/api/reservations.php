<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';
require_once '../auth/auth.php';

class Reservation {
    private $conn;
    private $table_name = "reservations";
    private $auth;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
        $this->auth = new Auth();
    }

    public function create($data) {
        // Validate required fields
        $required_fields = ['seat_number', 'full_name', 'email', 'phone', 'national_id', 'payment_method'];
        foreach ($required_fields as $field) {
            if (empty($data->$field)) {
                return ['status' => 'error', 'message' => "Missing required field: $field"];
            }
        }

        // Validate email format
        if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
            return ['status' => 'error', 'message' => 'Invalid email format'];
        }

        // Validate payment method
        if (!in_array($data->payment_method, ['credit_card', 'cash'])) {
            return ['status' => 'error', 'message' => 'Invalid payment method'];
        }

        // Check if seat is already reserved
        $query = "SELECT id FROM " . $this->table_name . " WHERE seat_number = :seat_number AND payment_status != 'cancelled'";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":seat_number", $data->seat_number);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return ['status' => 'error', 'message' => 'Seat is already reserved'];
        }

        // Handle photo upload if present
        $photo_path = null;
        if (isset($data->photo) && !empty($data->photo)) {
            $photo_path = $this->handlePhotoUpload($data->photo);
            if (!$photo_path) {
                return ['status' => 'error', 'message' => 'Failed to upload photo'];
            }
        }

        // Get user ID if logged in
        $user_id = null;
        if ($this->auth->isLoggedIn()) {
            $user = $this->auth->getCurrentUser();
            $user_id = $user['id'];
        }

        // Insert reservation
        $query = "INSERT INTO " . $this->table_name . " 
                (user_id, seat_number, full_name, email, phone, national_id, photo_path, payment_method) 
                VALUES 
                (:user_id, :seat_number, :full_name, :email, :phone, :national_id, :photo_path, :payment_method)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":seat_number", $data->seat_number);
        $stmt->bindParam(":full_name", $data->full_name);
        $stmt->bindParam(":email", $data->email);
        $stmt->bindParam(":phone", $data->phone);
        $stmt->bindParam(":national_id", $data->national_id);
        $stmt->bindParam(":photo_path", $photo_path);
        $stmt->bindParam(":payment_method", $data->payment_method);

        if ($stmt->execute()) {
            return [
                'status' => 'success',
                'message' => 'Reservation created successfully',
                'reservation_id' => $this->conn->lastInsertId()
            ];
        }

        return ['status' => 'error', 'message' => 'Failed to create reservation'];
    }

    public function get($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return ['status' => 'success', 'data' => $stmt->fetch(PDO::FETCH_ASSOC)];
        }

        return ['status' => 'error', 'message' => 'Reservation not found'];
    }

    public function update($id, $data) {
        // Check if reservation exists
        $current = $this->get($id);
        if ($current['status'] === 'error') {
            return $current;
        }

        // Validate payment status if updating
        if (isset($data->payment_status) && !in_array($data->payment_status, ['pending', 'completed', 'cancelled'])) {
            return ['status' => 'error', 'message' => 'Invalid payment status'];
        }

        $updates = [];
        $params = [];

        $allowed_fields = ['payment_status', 'payment_method'];
        foreach ($allowed_fields as $field) {
            if (isset($data->$field)) {
                $updates[] = "$field = :$field";
                $params[":$field"] = $data->$field;
            }
        }

        if (empty($updates)) {
            return ['status' => 'error', 'message' => 'No valid fields to update'];
        }

        $query = "UPDATE " . $this->table_name . " SET " . implode(", ", $updates) . " WHERE id = :id";
        $params[':id'] = $id;

        $stmt = $this->conn->prepare($query);
        if ($stmt->execute($params)) {
            return ['status' => 'success', 'message' => 'Reservation updated successfully'];
        }

        return ['status' => 'error', 'message' => 'Failed to update reservation'];
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);

        if ($stmt->execute()) {
            return ['status' => 'success', 'message' => 'Reservation deleted successfully'];
        }

        return ['status' => 'error', 'message' => 'Failed to delete reservation'];
    }

    private function handlePhotoUpload($base64_image) {
        // Create uploads directory if it doesn't exist
        $upload_dir = '../uploads/';
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        // Generate unique filename
        $filename = uniqid() . '.jpg';
        $filepath = $upload_dir . $filename;

        // Decode base64 image
        $image_data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64_image));

        // Save image
        if (file_put_contents($filepath, $image_data)) {
            return 'uploads/' . $filename;
        }

        return false;
    }
}

// Handle requests
$reservation = new Reservation();
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

$response = [];

switch ($method) {
    case 'POST':
        $response = $reservation->create($data);
        break;

    case 'GET':
        if (isset($_GET['id'])) {
            $response = $reservation->get($_GET['id']);
        } else {
            $response = ['status' => 'error', 'message' => 'Reservation ID is required'];
        }
        break;

    case 'PUT':
        if (isset($data->id)) {
            $response = $reservation->update($data->id, $data);
        } else {
            $response = ['status' => 'error', 'message' => 'Reservation ID is required'];
        }
        break;

    case 'DELETE':
        if (isset($data->id)) {
            $response = $reservation->delete($data->id);
        } else {
            $response = ['status' => 'error', 'message' => 'Reservation ID is required'];
        }
        break;

    default:
        $response = ['status' => 'error', 'message' => 'Invalid request method'];
        break;
}

echo json_encode($response);
?> 