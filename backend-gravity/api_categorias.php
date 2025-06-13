<?php
// Headers CORS completos
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Manejar solicitudes OPTIONS para CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Configuración de la base de datos - AJUSTA ESTOS VALORES
$host = 'localhost';
$db_name = 'gravity';
$username = 'root';  // Cambia por tu usuario de MySQL
$password = '';      // Cambia por tu contraseña de MySQL

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error de conexión a la base de datos",
        "details" => $e->getMessage()
    ]);
    exit;
}

$request_method = $_SERVER["REQUEST_METHOD"];

if($request_method == "GET") {
    try {
        // Obtener todas las categorías con conteo de productos
        $query = "SELECT 
                    c.id_categoria, 
                    c.nombre_categoria,
                    COUNT(p.id_producto) as total_productos
                  FROM categoria c
                  LEFT JOIN producto p ON c.id_categoria = p.id_categoria
                  GROUP BY c.id_categoria, c.nombre_categoria
                  ORDER BY c.nombre_categoria";
        
        $stmt = $conn->query($query);
        $categories = $stmt->fetchAll();
        
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "data" => $categories,
            "count" => count($categories),
            "message" => "Categorías obtenidas exitosamente"
        ]);
        
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error" => "Error al obtener categorías",
            "details" => $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "error" => "Método no permitido"
    ]);
}
?>
