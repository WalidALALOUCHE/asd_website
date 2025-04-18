<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../auth/auth.php';

$auth = new Auth();
$data = json_decode(file_get_contents("php://input"));

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($data->action)) {
        switch ($data->action) {
            case 'register':
                if (isset($data->username) && isset($data->email) && isset($data->password)) {
                    if ($auth->register($data->username, $data->email, $data->password)) {
                        $response['status'] = 'success';
                        $response['message'] = 'User registered successfully.';
                    } else {
                        $response['status'] = 'error';
                        $response['message'] = 'User already exists.';
                    }
                } else {
                    $response['status'] = 'error';
                    $response['message'] = 'Missing required fields.';
                }
                break;

            case 'login':
                if (isset($data->email) && isset($data->password)) {
                    if ($auth->login($data->email, $data->password)) {
                        $response['status'] = 'success';
                        $response['message'] = 'Login successful.';
                        $response['user'] = $auth->getCurrentUser();
                    } else {
                        $response['status'] = 'error';
                        $response['message'] = 'Invalid credentials.';
                    }
                } else {
                    $response['status'] = 'error';
                    $response['message'] = 'Missing required fields.';
                }
                break;

            case 'logout':
                if ($auth->logout()) {
                    $response['status'] = 'success';
                    $response['message'] = 'Logged out successfully.';
                } else {
                    $response['status'] = 'error';
                    $response['message'] = 'Logout failed.';
                }
                break;

            case 'check':
                $user = $auth->getCurrentUser();
                if ($user) {
                    $response['status'] = 'success';
                    $response['user'] = $user;
                } else {
                    $response['status'] = 'error';
                    $response['message'] = 'Not logged in.';
                }
                break;

            default:
                $response['status'] = 'error';
                $response['message'] = 'Invalid action.';
                break;
        }
    } else {
        $response['status'] = 'error';
        $response['message'] = 'No action specified.';
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
?> 