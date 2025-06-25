<?php
require_once '/home4/ocbenjic/public_html/adenneal/config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'User not authenticated.']);
    exit();
}
$user_id = $_SESSION['user_id'];

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->metadata) || !isset($data->patients)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid data format.']);
    exit();
}

// ... (rest of save logic remains the same)
$link->begin_transaction();
try {
    $stmt_meta = $link->prepare("INSERT INTO trials_metadata (trial_id, name, description, outcomeMetric, outcomeLabel, user_id) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt_meta->bind_param("sssssi", $data->metadata->id, $data->metadata->name, $data->metadata->description, $data->metadata->outcomeMetric, $data->metadata->outcomeLabel, $user_id);
    $stmt_meta->execute();
    $stmt_meta->close();

    $stmt_patient = $link->prepare("INSERT INTO patients (trial_id, patientID, age, gender, race, treatmentArm, visitDate, outcomeValue, adverseEvent, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($data->patients as $patient) {
        $outcomeValue = isset($patient->{$data->metadata->outcomeMetric}) ? $patient->{$data->metadata->outcomeMetric} : null;
        $visitDate = !empty($patient->visitDate) ? date('Y-m-d', strtotime($patient->visitDate)) : null;
        $stmt_patient->bind_param("ssisssssdi", $data->metadata->id, $patient->patientID, $patient->age, $patient->gender, $patient->race, $patient->treatmentArm, $visitDate, $outcomeValue, $patient->adverseEvent, $user_id);
        $stmt_patient->execute();
    }
    $stmt_patient->close();

    $link->commit();
    http_response_code(201);
    echo json_encode(['success' => 'Trial saved successfully.']);
} catch (Exception $e) {
    $link->rollback();
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save trial.', 'details' => $e->getMessage()]);
}
$link->close();
?>