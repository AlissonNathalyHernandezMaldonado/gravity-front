<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/html; charset=UTF-8");
?>
<!DOCTYPE html>
<html>
<head>
    <title>🖼️ Verificar Imágenes - Gravity</title>
    <meta charset="UTF-8">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .success { color: #28a745; }
        .error { color: #dc3545; }
        .warning { color: #ffc107; }
        h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        .image-test {
            display: inline-block;
            margin: 10px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            text-align: center;
            width: 200px;
        }
        .image-test img {
            max-width: 150px;
            max-height: 150px;
            border: 1px solid #ccc;
        }
        .status-box {
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 4px solid;
        }
        .status-success { background: #d4edda; border-color: #28a745; }
        .status-error { background: #f8d7da; border-color: #dc3545; }
        .status-warning { background: #fff3cd; border-color: #ffc107; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🖼️ Verificación de Imágenes - Gravity Store</h1>
        
        <?php
        // Configuración de la base de datos
        $host = 'localhost';
        $db_name = 'gravity';
        $username = 'root';
        $password = '';
        
        try {
            $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Obtener productos con imágenes
            $stmt = $conn->query("SELECT id_producto, nombre_producto, img FROM producto ORDER BY id_producto LIMIT 10");
            $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo '<div class="status-box status-success">';
            echo '<strong>✅ Conexión a BD exitosa</strong> - ' . count($productos) . ' productos encontrados';
            echo '</div>';
            
            // Verificar si existe la carpeta img
            $imgDir = __DIR__ . '/img';
            if (!is_dir($imgDir)) {
                echo '<div class="status-box status-error">';
                echo '<strong>❌ Carpeta img/ NO EXISTE</strong><br>';
                echo 'Ruta esperada: ' . $imgDir . '<br>';
                echo '<strong>SOLUCIÓN:</strong> Crea la carpeta "img" en este directorio';
                echo '</div>';
                
                // Intentar crear la carpeta
                if (mkdir($imgDir, 0755, true)) {
                    echo '<div class="status-box status-success">';
                    echo '<strong>✅ Carpeta img/ creada exitosamente</strong>';
                    echo '</div>';
                } else {
                    echo '<div class="status-box status-error">';
                    echo '<strong>❌ No se pudo crear la carpeta img/</strong>';
                    echo '</div>';
                }
            } else {
                echo '<div class="status-box status-success">';
                echo '<strong>✅ Carpeta img/ existe</strong>';
                echo '</div>';
            }
            
            echo '<h2>🔍 Verificación de imágenes:</h2>';
            
            $imagenesEncontradas = 0;
            $imagenesFaltantes = 0;
            
            foreach ($productos as $producto) {
                $imagePath = $producto['img'];
                $fullPath = __DIR__ . '/' . $imagePath;
                $webPath = $imagePath;
                
                echo '<div class="image-test">';
                echo '<h4>' . htmlspecialchars($producto['nombre_producto']) . '</h4>';
                echo '<p><strong>ID:</strong> ' . $producto['id_producto'] . '</p>';
                echo '<p><strong>Ruta BD:</strong> ' . htmlspecialchars($imagePath) . '</p>';
                
                if (file_exists($fullPath)) {
                    echo '<p class="success">✅ Archivo existe</p>';
                    echo '<img src="' . $webPath . '" alt="' . htmlspecialchars($producto['nombre_producto']) . '">';
                    echo '<br><a href="' . $webPath . '" target="_blank">Ver imagen</a>';
                    $imagenesEncontradas++;
                } else {
                    echo '<p class="error">❌ Archivo NO existe</p>';
                    echo '<p><strong>Ruta completa:</strong><br>' . $fullPath . '</p>';
                    echo '<div style="width:150px;height:150px;background:#f0f0f0;border:1px dashed #ccc;display:flex;align-items:center;justify-content:center;margin:10px auto;">';
                    echo 'Imagen faltante';
                    echo '</div>';
                    $imagenesFaltantes++;
                }
                
                echo '</div>';
            }
            
            echo '<h2>📊 Resumen:</h2>';
            echo '<div class="status-box ' . ($imagenesFaltantes > 0 ? 'status-warning' : 'status-success') . '">';
            echo '<strong>Imágenes encontradas:</strong> ' . $imagenesEncontradas . '<br>';
            echo '<strong>Imágenes faltantes:</strong> ' . $imagenesFaltantes . '<br>';
            echo '<strong>Total verificadas:</strong> ' . count($productos);
            echo '</div>';
            
            if ($imagenesFaltantes > 0) {
                echo '<h2>🔧 Soluciones:</h2>';
                echo '<div class="status-box status-warning">';
                echo '<h3>Opción 1: Copiar imágenes existentes</h3>';
                echo '<p>Si tienes las imágenes en tu proyecto React:</p>';
                echo '<ol>';
                echo '<li>Ve a tu carpeta: <code>src/img/</code></li>';
                echo '<li>Copia todas las imágenes</li>';
                echo '<li>Pégalas en: <code>' . $imgDir . '/</code></li>';
                echo '</ol>';
                
                echo '<h3>Opción 2: Usar placeholders temporales</h3>';
                echo '<p>Crear imágenes de prueba automáticamente:</p>';
                echo '<a href="crear-placeholders.php" style="background:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">🎨 Crear Placeholders</a>';
                echo '</div>';
            }
            
        } catch(PDOException $e) {
            echo '<div class="status-box status-error">';
            echo '<strong>❌ Error de conexión a la base de datos:</strong><br>';
            echo htmlspecialchars($e->getMessage());
            echo '</div>';
        }
        ?>
        
        <h2>🚀 Próximos pasos:</h2>
        <ol>
            <li><strong>Haz clic en el botón 🔗</strong> en tu aplicación React para ver las URLs exactas</li>
            <li><strong>Copia las imágenes</strong> de tu proyecto original a la carpeta <code>img/</code></li>
            <li><strong>O crea placeholders</strong> temporales para probar</li>
            <li><strong>Refresca tu aplicación</strong> React para ver los cambios</li>
        </ol>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="diagnostico.php" style="background:#28a745;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;margin:5px;">🔍 Ver Diagnóstico</a>
            <a href="crear-placeholders.php" style="background:#ffc107;color:black;padding:10px 20px;text-decoration:none;border-radius:5px;margin:5px;">🎨 Crear Placeholders</a>
            <a href="javascript:location.reload()" style="background:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;margin:5px;">🔄 Recargar</a>
        </div>
    </div>
</body>
</html>
