<?php
// Archivo específico para probar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

echo json_encode([
    "success" => true,
    "message" => "CORS funcionando correctamente",
    "timestamp" => date("Y-m-d H:i:s"),
    "origin" => $_SERVER['HTTP_ORIGIN'] ?? 'No origin',
    "user_agent" => $_SERVER['HTTP_USER_AGENT'] ?? 'No user agent'
]);
?>
