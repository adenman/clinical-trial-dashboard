<?php
// Set the content type to plain text so we can see the raw output
header('Content-Type: text/plain');

// Force PHP to display all errors directly to the screen.
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "DEBUG STEP 1: Script execution has started.\n";

echo "DEBUG STEP 2: Attempting to start session...\n";
session_start();
echo "DEBUG STEP 3: session_start() was called successfully.\n";

$userId = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 'NOT SET';
echo "DEBUG STEP 4: User ID from session is: " . $userId . "\n";

echo "DEBUG STEP 5: Attempting to include db.php with absolute path...\n";

// We use a try-catch block to gracefully handle a failure here
try {
    require_once '/home4/ocbenjic/public_html/adenneal/db.php';
    echo "DEBUG STEP 6: Successfully included db.php.\n";
} catch (Throwable $t) {
    echo "FATAL ERROR: The require_once command failed. The path is likely wrong or permissions are blocking access.\n";
    echo "Error details: " . $t->getMessage();
    exit(); // Stop the script
}

echo "DEBUG STEP 7: Attempting to connect to the database...\n";
$link = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

if ($link->connect_error) {
    echo "FATAL ERROR: Could not connect to the database. Check your credentials in db.php.\n";
    echo "MySQL Error: " . $link->connect_error;
    exit(); // Stop the script
}

echo "DEBUG STEP 8: Database connection was successful.\n\n";
echo "CONCLUSION: All critical steps completed without fatal errors. The issue is likely in the SQL query logic of the main api.php file.";

$link->close();

?>