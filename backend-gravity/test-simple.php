<?php
// Headers CORS más específicos para React
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Manejar solicitudes OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Respuesta simple para React
$response = [
    "status" => "success",
    "message" => "API funcionando correctamente desde React",
    "timestamp" => date("Y-m-d H:i:s"),
    "server_info" => [
        "php_version" => phpversion(),
        "server_software" => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        "method" => $_SERVER['REQUEST_METHOD'],
        "headers" => getallheaders()
    ],
    "cors_test" => "OK"
];

echo json_encode($response, JSON_PRETTY_PRINT);
?>
