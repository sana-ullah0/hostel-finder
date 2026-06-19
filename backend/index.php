<?php
require_once __DIR__ . '/config/helpers.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/models/HostelModel.php';

setCORSHeaders();

// Parse the request URI
$requestUri = $_SERVER['REQUEST_URI'];
$basePath = $_ENV['BASE_PATH'] ?? '';
$parsedPath = parse_url($requestUri, PHP_URL_PATH);

if ($basePath !== '') {
    $path = preg_replace('#^' . preg_quote($basePath, '#') . '#', '', $parsedPath);
} else {
    $path = $parsedPath;
}

$path = rtrim($path, '/') ?: '/';
$method = $_SERVER['REQUEST_METHOD'];

// Route matching
$routes = [
    'GET' => [
        '/api/hostels'           => 'getHostels',
        '/api/featured-hostels'  => 'getFeatured',
        '/api/hostels/{id}'      => 'getHostelById',
        '/api/admin/hostels'     => 'adminGetAll',
        '/api/admin/stats'       => 'adminGetStats',
    ],
    'POST' => [
        '/api/add-hostel'        => 'addHostel',
        '/api/admin/login'       => 'adminLogin',
    ],
    'PUT' => [
        '/api/update-hostel/{id}' => 'updateHostel',
        '/api/admin/status/{id}'  => 'updateStatus',
    ],
    'DELETE' => [
        '/api/delete-hostel/{id}' => 'deleteHostel',
    ],
];

function matchRoute($pattern, $path, &$params) {
    $regex = preg_replace('/\{[^}]+\}/', '([^/]+)', $pattern);
    $regex = '#^' . $regex . '$#';
    if (preg_match($regex, $path, $matches)) {
        array_shift($matches);
        $params = $matches;
        return true;
    }
    return false;
}

// Session for admin
session_start();

$hostelModel = new HostelModel();
$params = [];
$matched = false;

foreach ($routes[$method] ?? [] as $pattern => $handler) {
    if (matchRoute($pattern, $path, $params)) {
        $matched = true;
        
        switch ($handler) {
            case 'getHostels':
                $filters = array_map('sanitize', $_GET);
                $hostels = $hostelModel->getAllApproved($filters);
                sendSuccess($hostels, 'Hostels fetched successfully');
                break;

            case 'getFeatured':
                $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 6;
                $hostels = $hostelModel->getFeatured($limit);
                sendSuccess($hostels, 'Featured hostels fetched');
                break;

            case 'getHostelById':
                $id = (int)$params[0];
                $hostel = $hostelModel->getById($id);
                if (!$hostel) sendError('Hostel not found', 404);
                sendSuccess($hostel, 'Hostel fetched successfully');
                break;

            case 'addHostel':
                $data = $_POST ?: json_decode(file_get_contents('php://input'), true) ?: [];
                
                // Validate required fields
                $required = ['hostel_name', 'owner_name', 'phone', 'city', 'address', 'rent', 'hostel_type'];
                foreach ($required as $field) {
                    if (empty($data[$field])) {
                        sendError("Field '$field' is required", 422);
                    }
                }
                
                // Sanitize
                foreach ($data as $k => $v) {
                    $data[$k] = is_array($v) ? $v : sanitize($v);
                }
                
                // Create hostel
                $hostelId = $hostelModel->create($data);
                
                // Add facilities
                $facilities = [
                    'wifi' => !empty($data['wifi']),
                    'laundry' => !empty($data['laundry']),
                    'mess' => !empty($data['mess']),
                    'parking' => !empty($data['parking']),
                    'cctv' => !empty($data['cctv']),
                    'security_guard' => !empty($data['security_guard']),
                    'generator' => !empty($data['generator']),
                ];
                $hostelModel->addFacilities($hostelId, $facilities);
                
                // Handle image uploads
                if (!empty($_FILES['images'])) {
                    $files = $_FILES['images'];
                    $isPrimary = true;
                    for ($i = 0; $i < count($files['name']); $i++) {
                        $file = [
                            'name' => $files['name'][$i],
                            'type' => $files['type'][$i],
                            'tmp_name' => $files['tmp_name'][$i],
                            'error' => $files['error'][$i],
                            'size' => $files['size'][$i],
                        ];
                        if ($file['error'] === UPLOAD_ERR_OK) {
                            $imagePath = uploadImage($file, $hostelId);
                            if ($imagePath) {
                                $hostelModel->addImage($hostelId, $imagePath, $isPrimary);
                                $isPrimary = false;
                            }
                        }
                    }
                }
                
                sendSuccess(['hostel_id' => $hostelId], 'Hostel submitted successfully! Awaiting admin approval.', 201);
                break;

            case 'adminLogin':
                $body = json_decode(file_get_contents('php://input'), true) ?? [];
                $username = sanitize($body['username'] ?? '');
                $password = $body['password'] ?? '';
                
                $pdo = getDBConnection();
                $stmt = $pdo->prepare("SELECT * FROM admin WHERE username = ?");
                $stmt->execute([$username]);
                $admin = $stmt->fetch();
                
                if ($admin && password_verify($password, $admin['password'])) {
                    $_SESSION['admin_id'] = $admin['id'];
                    $_SESSION['admin_username'] = $admin['username'];
                    sendSuccess(['username' => $admin['username']], 'Login successful');
                } else {
                    sendError('Invalid credentials', 401);
                }
                break;

            case 'adminGetAll':
                if (empty($_SESSION['admin_id'])) sendError('Unauthorized', 401);
                $hostels = $hostelModel->getAllForAdmin();
                sendSuccess($hostels);
                break;

            case 'adminGetStats':
                if (empty($_SESSION['admin_id'])) sendError('Unauthorized', 401);
                $stats = $hostelModel->getStats();
                sendSuccess($stats);
                break;

            case 'updateStatus':
                if (empty($_SESSION['admin_id'])) sendError('Unauthorized', 401);
                $id = (int)$params[0];
                $body = json_decode(file_get_contents('php://input'), true) ?? [];
                $status = $body['status'] ?? '';
                if (!in_array($status, ['approved', 'rejected', 'pending'])) {
                    sendError('Invalid status');
                }
                $hostelModel->updateStatus($id, $status);
                sendSuccess(null, 'Status updated successfully');
                break;

            case 'deleteHostel':
                if (empty($_SESSION['admin_id'])) sendError('Unauthorized', 401);
                $id = (int)$params[0];
                $hostelModel->delete($id);
                sendSuccess(null, 'Hostel deleted successfully');
                break;

            case 'updateHostel':
                if (empty($_SESSION['admin_id'])) sendError('Unauthorized', 401);
                sendSuccess(null, 'Update endpoint - implement as needed');
                break;
        }
        break;
    }
}

if (!$matched) {
    sendError('Route not found', 404);
}
