<?php
function getDB() {
    $host = $_ENV['DB_HOST'] ?? 'localhost';
    $port = $_ENV['DB_PORT'] ?? '4000';
    $db   = $_ENV['DB_NAME'] ?? 'hostel_finder';
    $user = $_ENV['DB_USER'] ?? 'root';
    $pass = $_ENV['DB_PASS'] ?? '';

    // TiDB requires SSL — this line is the key difference from regular MySQL
    $ssl  = $_ENV['DB_SSL']  ?? 'false';

    try {
        $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];

        // Enable SSL for TiDB Cloud (required on production)
        if ($ssl === 'true') {
            $options[PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT] = false;
            $options[PDO::MYSQL_ATTR_SSL_CA] = '';
        }

        return new PDO($dsn, $user, $pass, $options);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'DB connection failed']);
        exit;
    }
}