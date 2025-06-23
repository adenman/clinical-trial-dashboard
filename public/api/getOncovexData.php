<?php
/**
 * API Endpoint to Fetch OncoVex Trial Data
 *
 * This script connects to the MySQL database, retrieves all patient records
 * from the 'oncovex' table, and returns the data as a JSON array.
 *
 * @version 1.0
 * @author Aden
 */

// --- HEADERS ---
// Set the content type of the response to JSON
header('Content-Type: application/json');
// Allow requests from any origin (CORS). For production, you might want to restrict this
// to your specific domain, e.g., header('Access-Control-Allow-Origin: https://adenneal.com');
header('Access-Control-Allow-Origin: *');

// --- DATABASE CONNECTION ---
// Include the database configuration file located two directories above the current script.
// Using __DIR__ makes the path resolution more reliable.
require_once __DIR__ . '/../../db.php';

// Create a new mysqli object to connect to the database.
$link = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Check for a connection error.
if ($link->connect_error) {
    // If a connection error occurs, send a 500 Internal Server Error status code
    // and a JSON object with an error message. Then, terminate the script.
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $link->connect_error]);
    exit();
}

// --- DATA FETCHING ---
$data = [];
$sql = "SELECT patientID, age, gender, race, treatmentArm, visitDate, tumorSizeChange, adverseEvent FROM oncovex";

// Execute the query.
if ($result = $link->query($sql)) {
    // Check if there are any rows returned.
    if ($result->num_rows > 0) {
        // Fetch all rows from the result set and store them in the $data array.
        // MYSQLI_ASSOC returns an associative array with column names as keys.
        $data = $result->fetch_all(MYSQLI_ASSOC);
        
        // Free the result set from memory.
        $result->free();
    }
} else {
    // If the query fails, send a 500 status code and an error message.
    http_response_code(500);
    echo json_encode(['error' => 'Error executing query: ' . $link->error]);
    $link->close();
    exit();
}

// --- CLEANUP AND OUTPUT ---
// Close the database connection.
$link->close();

// Send a 200 OK status code.
http_response_code(200);

// Encode the final data array into a JSON string and output it.
echo json_encode($data);

?>
