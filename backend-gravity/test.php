<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Información básica para verificar que la API está funcionando
$info = [
    "status" => "ok",
    "message" => "API funcionando correctamente",
    "timestamp" => date("Y-m-d H:i:s"),
    "php_version" => phpversion(),
    "server" => $_SERVER['SERVER_SOFTWARE']
];

echo json_encode($info);
?>

