<?php
require_once __DIR__ . '/../../config.php';

$user_id = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;
$requested_trial_id = isset($_GET['trial_id']) ? $_GET['trial_id'] : '';

if (empty($requested_trial_id)) {
    http_response_code(400);
    echo json_encode(['error' => 'Trial ID is required.']);
    exit();
}

$stmt = $link->prepare(
    "SELECT p.* FROM patients p JOIN trials_metadata tm ON p.trial_id = tm.trial_id 
     WHERE p.trial_id = ? AND (tm.user_id IS NULL OR tm.user_id = ?)"
);
$stmt->bind_param("si", $requested_trial_id, $user_id);
    
if ($stmt->execute()) {
    $result = $stmt->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error fetching patient data.']);
}

$stmt->close();
$link->close();
?>