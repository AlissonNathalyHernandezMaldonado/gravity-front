<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/html; charset=UTF-8");
?>
<!DOCTYPE html>
<html>
<head>
    <title>Diagnóstico Backend Gravity</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .success { color: #28a745; }
        .error { color: #dc3545; }
        .info { color: #007bff; }
        .warning { color: #ffc107; }
        h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        .test-link {
            display: inline-block;
            margin: 5px 10px 5px 0;
            padding: 8px 15px;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 14px;
        }
        .test-link:hover { background: #0056b3; }
        .status-box {
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 4px solid;
        }
        .status-success { background: #d4edda; border-color: #28a745; }
        .status-error { background: #f8d7da; border-color: #dc3545; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Diagnóstico Backend Gravity</h1>
        
        <div class="status-box status-success">
            <strong>✅ Servidor PHP funcionando correctamente</strong>
        </div>
        
        <h2>🌐 Información del servidor</h2>
        <table>
            <tr><th>PHP Version</th><td><?php echo phpversion(); ?></td></tr>
            <tr><th>Server Software</th><td><?php echo $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'; ?></td></tr>
            <tr><th>Document Root</th><td><?php echo $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown'; ?></td></tr>
            <tr><th>Script Path</th><td><?php echo __FILE__; ?></td></tr>
            <tr><th>Current Time</th><td><?php echo date('Y-m-d H:i:s'); ?></td></tr>
            <tr><th>URL Actual</th><td><?php echo (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]"; ?></td></tr>
        </table>

        <h2>📁 Archivos en este directorio</h2>
        <ul>
            <?php
            $files = scandir('.');
            foreach($files as $file) {
                if($file != '.' && $file != '..') {
                    $size = file_exists($file) ? filesize($file) : 0;
                    echo "<li><strong>$file</strong> (" . number_format($size) . " bytes)</li>";
                }
            }
            ?>
        </ul>
        
        <h2>🔗 Enlaces de prueba</h2>
        <div>
            <a href="test-simple.php" target="_blank" class="test-link">🧪 Test Simple</a>
            <a href="api_productos.php" target="_blank" class="test-link">📦 API Productos</a>
            <a href="api_categorias.php" target="_blank" class="test-link">📂 API Categorías</a>
            <a href="api_carrito.php?id_usuario=1" target="_blank" class="test-link">🛒 API Carrito</a>
        </div>
        
        <h2>🗄️ Prueba de base de datos</h2>
        <?php
        $host = 'localhost';
        $db_name = 'gravity';
        $username = 'root';
        $password = '';
        
        try {
            $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            echo '<div class="status-box status-success">';
            echo '<strong>✅ Conexión a base de datos exitosa</strong>';
            echo '</div>';
            
            // Contar registros en tablas principales
            $tables = ['producto', 'categoria', 'detalle_producto', 'usuario', 'carrito'];
            echo '<table>';
            echo '<tr><th>Tabla</th><th>Total Registros</th></tr>';
            
            foreach($tables as $table) {
                try {
                    $stmt = $conn->query("SELECT COUNT(*) as total FROM $table");
                    $result = $stmt->fetch(PDO::FETCH_ASSOC);
                    echo "<tr><td>$table</td><td>" . $result['total'] . "</td></tr>";
                } catch(Exception $e) {
                    echo "<tr><td>$table</td><td class='error'>Error: " . $e->getMessage() . "</td></tr>";
                }
            }
            echo '</table>';
            
            // Mostrar algunos productos de ejemplo
            echo '<h3>📦 Productos de ejemplo:</h3>';
            $stmt = $conn->query("SELECT id_producto, nombre_producto, precio_producto, img FROM producto LIMIT 5");
            $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo '<table>';
            echo '<tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Imagen</th></tr>';
            foreach($productos as $producto) {
                echo '<tr>';
                echo '<td>' . $producto['id_producto'] . '</td>';
                echo '<td>' . htmlspecialchars($producto['nombre_producto']) . '</td>';
                echo '<td>$' . number_format($producto['precio_producto']) . '</td>';
                echo '<td>' . htmlspecialchars($producto['img']) . '</td>';
                echo '</tr>';
            }
            echo '</table>';
            
        } catch(PDOException $e) {
            echo '<div class="status-box status-error">';
            echo '<strong>❌ Error de conexión a la base de datos:</strong><br>';
            echo htmlspecialchars($e->getMessage());
            echo '</div>';
        }
        ?>

        <h2>🔍 Prueba de URL para React</h2>
        <p>Copia y pega esta URL en tu navegador para probar si funciona:</p>
        <pre><?php echo (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]" . dirname($_SERVER['REQUEST_URI']) . "/test-simple.php"; ?></pre>
        
        <h2>📝 Modificar tu archivo Productos.jsx</h2>
        <p>Agrega esta URL a tu lista de possibleUrls en tu archivo Productos.jsx:</p>
        <pre>
const possibleUrls = [
  "<?php echo (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]" . dirname($_SERVER['REQUEST_URI']); ?>",
  "http://localhost/backend-gravity",
  "http://localhost/gravity2/backend-gravity",
  // ... otras URLs
];
        </pre>

        <h2>🚀 Próximos pasos</h2>
        <ol>
            <li>Si ves esta página, el servidor PHP está funcionando ✅</li>
            <li>Si la conexión a la BD es exitosa, los datos están disponibles ✅</li>
            <li>Prueba los enlaces de arriba para verificar las APIs</li>
            <li>Agrega la URL mostrada arriba a tu archivo Productos.jsx</li>
            <li>Usa el botón "Buscar servidor" en tu aplicación React</li>
        </ol>

        <div class="status-box status-success">
            <strong>💡 Tip:</strong> Si todo funciona aquí pero no en React, verifica que estés usando la URL correcta y que no haya problemas de CORS.
        </div>
    </div>
</body>
</html>
