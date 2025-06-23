<?php
/**
 * Unified API for Clinical Trial Data
 *
 * This script serves two purposes:
 * 1. If no 'trial_id' is provided, it fetches a list of all available trials from 'trials_metadata'.
 * 2. If a 'trial_id' is provided via a GET parameter (e.g., api.php?trial_id=onco-vex),
 * it fetches all patient data for that specific trial.
 */

// --- TEMPORARY DEBUGGING ---
// These lines will force PHP to display any errors on the screen.
// WARNING: Remove these lines after we have fixed the issue, as they are a security risk in production.
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// ---------------------------


// --- HEADERS ---
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// --- DATABASE CONNECTION ---
// Include the database configuration file located two directories above.
require_once __DIR__ . '/../../db.php';

$link = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

if ($link->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $link->connect_error]);
    exit();
}

// --- API ROUTING LOGIC ---
$requested_trial_id = isset($_GET['trial_id']) ? $_GET['trial_id'] : null;

if ($requested_trial_id) {
    // --- FETCH PATIENT DATA FOR A SPECIFIC TRIAL ---
    $stmt = $link->prepare("SELECT patientID, age, gender, race, treatmentArm, visitDate, outcomeValue, adverseEvent FROM patients WHERE trial_id = ?");
    $stmt->bind_param("s", $requested_trial_id);
    
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);
        $result->free();
        http_response_code(200);
        echo json_encode($data);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error fetching patient data: ' . $stmt->error]);
    }
    $stmt->close();

} else {
    // --- FETCH METADATA FOR ALL TRIALS ---
    $sql = "SELECT trial_id as id, name, description, outcomeMetric, outcomeLabel FROM trials_metadata";
    
    if ($result = $link->query($sql)) {
        $data = $result->fetch_all(MYSQLI_ASSOC);
        $result->free();
        http_response_code(200);
        echo json_encode($data);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error fetching trials metadata: ' . $link->error]);
    }
}

// --- CLEANUP ---
$link->close();

?>