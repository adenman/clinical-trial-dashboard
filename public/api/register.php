<?php
require_once __DIR__ . '/../../config.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->username) || !isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields.']);
    exit();
}

$password_hash = password_hash($data->password, PASSWORD_DEFAULT);

$stmt = $link->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $data->username, $data->email, $password_hash);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(['success' => 'User registered successfully.']);
} else {
    http_response_code(409);
    echo json_encode(['error' => 'Username or email may already be in use.']);
}

$stmt->close();
$link->close();
?>