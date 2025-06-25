<?php
require_once __DIR__ . '/../../config.php';

$user_id = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;

$sql = "SELECT trial_id as id, name, description, outcomeMetric, outcomeLabel FROM trials_metadata WHERE user_id IS NULL";
if ($user_id) {
    $sql .= " OR user_id = ?";
}

$stmt = $link->prepare($sql);
if ($user_id) {
    $stmt->bind_param("i", $user_id);
}
    
if ($stmt->execute()) {
    $result = $stmt->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error fetching trials metadata.']);
}

$stmt->close();
$link->close();
?>