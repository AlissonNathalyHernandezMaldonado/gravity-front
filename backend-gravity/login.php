<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conexion = new mysqli("localhost", "root", "", "gravity");

if ($conexion->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["correo"]) || !isset($data["clave"])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

$correo = $data["correo"];
$claveIngresada = $data["clave"];

$stmt = $conexion->prepare("SELECT id_usuario, id_rol, contraseña FROM usuario WHERE correo_usuario = ?");
$stmt->bind_param("s", $correo);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $usuario = $result->fetch_assoc();
    $hashAlmacenado = $usuario["contraseña"];

    if (password_verify($claveIngresada, $hashAlmacenado) || $claveIngresada === $hashAlmacenado) {
        // 🔒 Generar token básico (simulado, no es JWT real)
        $payload = [
            "id_usuario" => $usuario["id_usuario"],
            "id_rol" => $usuario["id_rol"],
            "correo" => $correo,
            "exp" => time() + (60 * 60 * 24) // expira en 24h
        ];
        $token = base64_encode(json_encode($payload));

        echo json_encode([
            "success" => true,
            "id_usuario" => $usuario["id_usuario"],
            "id_rol" => $usuario["id_rol"],
            "token" => $token
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Contraseña incorrecta"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Correo no registrado"]);
}
?>
