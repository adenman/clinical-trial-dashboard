<?php
// This path goes up two levels from /ClinicalTrial/api/ to the root.
require_once __DIR__ . '/../../config.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password are required.']);
    exit();
}

$stmt = $link->prepare("SELECT id, username, password_hash FROM users WHERE email = ?");
$stmt->bind_param("s", $data->email);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    if (password_verify($data->password, $user['password_hash'])) {
        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        
        http_response_code(200);
        echo json_encode([ 'user' => [ 'id' => $user['id'], 'username' => $user['username'] ] ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials.']);
    }
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials.']);
}

$stmt->close();
$link->close();
?>