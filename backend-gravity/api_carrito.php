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
        // Obtener carrito de un usuario
        if(isset($_GET['id_usuario'])) {
            try {
                $id_usuario = $_GET['id_usuario'];
                
                // Consulta para obtener el carrito con detalles del producto
                $query = "SELECT 
                            c.id_carrito,
                            c.id_usuario,
                            c.id_producto,
                            c.cantidad,
                            c.talla,
                            c.fecha_agregado,
                            c.metodo_pago,
                            p.nombre_producto,
                            p.precio_producto,
                            p.img,
                            p.descripcion_producto
                          FROM carrito c
                          LEFT JOIN producto p ON c.id_producto = p.id_producto
                          WHERE c.id_usuario = ?
                          ORDER BY c.fecha_agregado DESC";
                
                $stmt = $conn->prepare($query);
                $stmt->execute([$id_usuario]);
                $cart_items = $stmt->fetchAll();
                
                // Calcular totales
                $total_productos = 0;
                $total_precio = 0;
                
                foreach($cart_items as &$item) {
                    $item['precio_producto'] = (float)$item['precio_producto'];
                    $item['subtotal'] = $item['precio_producto'] * $item['cantidad'];
                    $total_productos += $item['cantidad'];
                    $total_precio += $item['subtotal'];
                }
                
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "data" => $cart_items,
                    "summary" => [
                        "total_productos" => $total_productos,
                        "total_precio" => $total_precio,
                        "count_items" => count($cart_items)
                    ],
                    "message" => "Carrito obtenido exitosamente"
                ]);
                
            } catch(Exception $e) {
                http_response_code(500);
                echo json_encode([
                    "success" => false,
                    "error" => "Error al obtener carrito",
                    "details" => $e->getMessage()
                ]);
            }
        } else {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "error" => "ID de usuario requerido"
            ]);
        }
        break;
        
    case 'POST':
        // Agregar producto al carrito
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            
            if(!empty($data['id_usuario']) && !empty($data['id_producto']) && 
               !empty($data['cantidad']) && !empty($data['talla'])) {
                
                // Verificar si el producto ya existe en el carrito con la misma talla
                $check_query = "SELECT * FROM carrito 
                               WHERE id_usuario = ? AND id_producto = ? AND talla = ?";
                $check_stmt = $conn->prepare($check_query);
                $check_stmt->execute([$data['id_usuario'], $data['id_producto'], $data['talla']]);
                $existing_item = $check_stmt->fetch();
                
                if($existing_item) {
                    // Actualizar cantidad
                    $update_query = "UPDATE carrito 
                                   SET cantidad = cantidad + ?, fecha_agregado = NOW() 
                                   WHERE id_carrito = ?";
                    $update_stmt = $conn->prepare($update_query);
                    $result = $update_stmt->execute([$data['cantidad'], $existing_item['id_carrito']]);
                    
                    if($result) {
                        http_response_code(200);
                        echo json_encode([
                            "success" => true,
                            "message" => "Cantidad actualizada en el carrito",
                            "action" => "updated"
                        ]);
                    } else {
                        throw new Exception("Error al actualizar cantidad");
                    }
                } else {
                    // Insertar nuevo item
                    $insert_query = "INSERT INTO carrito 
                                   (id_usuario, id_producto, cantidad, talla, fecha_agregado) 
                                   VALUES (?, ?, ?, ?, NOW())";
                    $insert_stmt = $conn->prepare($insert_query);
                    $result = $insert_stmt->execute([
                        $data['id_usuario'],
                        $data['id_producto'],
                        $data['cantidad'],
                        $data['talla']
                    ]);
                    
                    if($result) {
                        http_response_code(201);
                        echo json_encode([
                            "success" => true,
                            "message" => "Producto agregado al carrito",
                            "action" => "added",
                            "id_carrito" => $conn->lastInsertId()
                        ]);
                    } else {
                        throw new Exception("Error al agregar al carrito");
                    }
                }
            } else {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "error" => "Datos incompletos. Se requiere: id_usuario, id_producto, cantidad, talla"
                ]);
            }
        } catch(Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "error" => "Error al procesar solicitud",
                "details" => $e->getMessage()
            ]);
        }
        break;
        
    case 'PUT':
        // Actualizar cantidad de un producto en el carrito
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            
            if(!empty($data['id_carrito']) && isset($data['cantidad']) && $data['cantidad'] > 0) {
                $query = "UPDATE carrito SET cantidad = ? WHERE id_carrito = ?";
                $stmt = $conn->prepare($query);
                $result = $stmt->execute([$data['cantidad'], $data['id_carrito']]);
                
                if($result) {
                    http_response_code(200);
                    echo json_encode([
                        "success" => true,
                        "message" => "Cantidad actualizada exitosamente"
                    ]);
                } else {
                    throw new Exception("Error al actualizar cantidad");
                }
            } else {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "error" => "Datos incompletos o inválidos. Se requiere: id_carrito, cantidad (mayor a 0)"
                ]);
            }
        } catch(Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "error" => "Error al actualizar cantidad",
                "details" => $e->getMessage()
            ]);
        }
        break;
        
    case 'DELETE':
        // Eliminar producto del carrito
        try {
            if(isset($_GET['id_carrito'])) {
                $id_carrito = $_GET['id_carrito'];
                
                $query = "DELETE FROM carrito WHERE id_carrito = ?";
                $stmt = $conn->prepare($query);
                $result = $stmt->execute([$id_carrito]);
                
                if($result) {
                    http_response_code(200);
                    echo json_encode([
                        "success" => true,
                        "message" => "Producto eliminado del carrito exitosamente"
                    ]);
                } else {
                    throw new Exception("Error al eliminar producto");
                }
            } else {
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "error" => "ID de carrito requerido"
                ]);
            }
        } catch(Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "error" => "Error al eliminar producto",
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
