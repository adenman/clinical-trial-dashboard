<?php
require_once __DIR__ . '/../../config.php';

session_unset();
session_destroy();

http_response_code(200);
echo json_encode(['success' => 'Logged out successfully.']);
?>