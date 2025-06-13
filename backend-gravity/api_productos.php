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

switch($request_method) {
    case 'GET':
        try {
            // Construir consulta base con JOIN para obtener nombre de categoría
            $query = "SELECT 
                        p.id_producto,
                        p.nombre_producto,
                        p.descripcion_producto,
                        p.precio_producto,
                        p.id_categoria,
                        p.img,
                        c.nombre_categoria
                      FROM producto p
                      LEFT JOIN categoria c ON p.id_categoria = c.id_categoria";
            
            $params = [];
            $whereClause = [];
            
            // Filtro por búsqueda
            if(isset($_GET['search']) && !empty($_GET['search'])) {
                $whereClause[] = "p.nombre_producto LIKE ?";
                $params[] = '%' . $_GET['search'] . '%';
            }
            
            // Filtro por categoría
            if(isset($_GET['category']) && !empty($_GET['category'])) {
                $whereClause[] = "p.id_categoria = ?";
                $params[] = $_GET['category'];
            }
            
            // Filtro por ID específico
            if(isset($_GET['id_producto']) && !empty($_GET['id_producto'])) {
                $whereClause[] = "p.id_producto = ?";
                $params[] = $_GET['id_producto'];
            }
            
            // Agregar cláusula WHERE si hay filtros
            if(!empty($whereClause)) {
                $query .= " WHERE " . implode(" AND ", $whereClause);
            }
            
            // Ordenar resultados
            $query .= " ORDER BY p.nombre_producto";
            
            // Preparar y ejecutar consulta
            $stmt = $conn->prepare($query);
            $stmt->execute($params);
            $products = $stmt->fetchAll();
            
            // Para cada producto, obtener sus detalles (tallas, colores, stock, marca)
            foreach($products as &$product) {
                $detailsQuery = "SELECT 
                                    id_detalle_producto, 
                                    stock, 
                                    marca, 
                                    talla, 
                                    color 
                                FROM detalle_producto 
                                WHERE id_producto = ? AND stock > 0
                                ORDER BY 
                                    CASE talla 
                                        WHEN 'XS' THEN 1
                                        WHEN 'S' THEN 2
                                        WHEN 'M' THEN 3
                                        WHEN 'L' THEN 4
                                        WHEN 'XL' THEN 5
                                        WHEN 'XXL' THEN 6
                                        ELSE 7
                                    END";
                
                $detailsStmt = $conn->prepare($detailsQuery);
                $detailsStmt->execute([$product['id_producto']]);
                $details = $detailsStmt->fetchAll();
                
                // Agregar detalles al producto
                $product['detalles'] = $details;
                
                // Extraer información útil de los detalles
                if (!empty($details)) {
                    // Marcas únicas
                    $brands = array_unique(array_column($details, 'marca'));
                    $product['marca'] = !empty($brands) ? reset($brands) : 'N/A';
                    
                    // Tallas disponibles
                    $product['tallas_disponibles'] = array_unique(array_column($details, 'talla'));
                    
                    // Colores disponibles
                    $product['colores_disponibles'] = array_unique(array_column($details, 'color'));
                    
                    // Stock total
                    $product['stock_total'] = array_sum(array_column($details, 'stock'));
                } else {
                    $product['marca'] = 'N/A';
                    $product['tallas_disponibles'] = [];
                    $product['colores_disponibles'] = [];
                    $product['stock_total'] = 0;
                }
                
                // Convertir precio a número
                $product['precio_producto'] = (float)$product['precio_producto'];
            }
            
            // Respuesta exitosa
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "data" => $products,
                "count" => count($products),
                "message" => "Productos obtenidos exitosamente"
            ]);
            
        } catch(Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "error" => "Error al obtener productos",
                "details" => $e->getMessage()
            ]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode([
            "success" => false,
            "error" => "Método no permitido"
        ]);
        break;
}
?>
