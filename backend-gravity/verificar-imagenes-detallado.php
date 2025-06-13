<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/html; charset=UTF-8");
?>
<!DOCTYPE html>
<html>
<head>
    <title>🖼️ Verificación Detallada de Imágenes - Gravity</title>
    <meta charset="UTF-8">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
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
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            text-align: center;
            width: 250px;
            vertical-align: top;
        }
        .image-test img {
            max-width: 200px;
            max-height: 200px;
            border: 1px solid #ccc;
            border-radius: 5px;
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
        .btn {
            background: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin: 5px;
        }
        .btn:hover { background: #0056b3; }
        .btn-success { background: #28a745; }
        .btn-danger { background: #dc3545; }
        .btn-warning { background: #ffc107; color: black; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🖼️ Verificación Detallada de Imágenes</h1>
        
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
            $stmt = $conn->query("SELECT id_producto, nombre_producto, img FROM producto ORDER BY id_producto");
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
                echo '<strong>✅ Carpeta img/ existe</strong> - Ruta: ' . $imgDir;
                echo '</div>';
            }
            
            // Listar archivos en la carpeta img
            if (is_dir($imgDir)) {
                $files = scandir($imgDir);
                $imageFiles = array_filter($files, function($file) {
                    return !in_array($file, ['.', '..']) && preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $file);
                });
                
                echo '<div class="status-box status-success">';
                echo '<strong>📁 Archivos en carpeta img/:</strong> ' . count($imageFiles) . ' imágenes encontradas<br>';
                if (count($imageFiles) > 0) {
                    echo '<small>' . implode(', ', array_slice($imageFiles, 0, 10));
                    if (count($imageFiles) > 10) echo '... y ' . (count($imageFiles) - 10) . ' más';
                    echo '</small>';
                }
                echo '</div>';
            }
            
            echo '<h2>🔍 Verificación producto por producto:</h2>';
            
            $imagenesEncontradas = 0;
            $imagenesFaltantes = 0;
            $imagenesProblematicas = [];
            
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
                    echo '<p><strong>Tamaño:</strong> ' . number_format(filesize($fullPath)) . ' bytes</p>';
                    
                    // Verificar si es una imagen válida
                    $imageInfo = @getimagesize($fullPath);
                    if ($imageInfo) {
                        echo '<p><strong>Dimensiones:</strong> ' . $imageInfo[0] . 'x' . $imageInfo[1] . '</p>';
                        echo '<p><strong>Tipo:</strong> ' . $imageInfo['mime'] . '</p>';
                        
                        echo '<img src="' . $webPath . '" alt="' . htmlspecialchars($producto['nombre_producto']) . '" style="max-width: 150px; max-height: 150px;">';
                        echo '<br><a href="' . $webPath . '" target="_blank" class="btn btn-success">Ver imagen completa</a>';
                        
                        $imagenesEncontradas++;
                    } else {
                        echo '<p class="error">❌ Archivo existe pero no es una imagen válida</p>';
                        echo '<a href="' . $webPath . '" target="_blank" class="btn btn-warning">Intentar abrir</a>';
                        $imagenesProblematicas[] = $producto['nombre_producto'];
                    }
                } else {
                    echo '<p class="error">❌ Archivo NO existe</p>';
                    echo '<p><strong>Ruta completa:</strong><br><small>' . $fullPath . '</small></p>';
                    echo '<div style="width:150px;height:150px;background:#f0f0f0;border:1px dashed #ccc;display:flex;align-items:center;justify-content:center;margin:10px auto;">';
                    echo 'Imagen faltante';
                    echo '</div>';
                    $imagenesFaltantes++;
                }
                
                echo '</div>';
            }
            
            echo '<h2>📊 Resumen Final:</h2>';
            echo '<div class="status-box ' . ($imagenesFaltantes > 0 ? 'status-warning' : 'status-success') . '">';
            echo '<strong>✅ Imágenes encontradas:</strong> ' . $imagenesEncontradas . '<br>';
            echo '<strong>❌ Imágenes faltantes:</strong> ' . $imagenesFaltantes . '<br>';
            echo '<strong>⚠️ Imágenes problemáticas:</strong> ' . count($imagenesProblematicas) . '<br>';
            echo '<strong>📊 Total verificadas:</strong> ' . count($productos) . '<br>';
            echo '<strong>📈 Porcentaje completado:</strong> ' . round(($imagenesEncontradas / count($productos)) * 100, 1) . '%';
            echo '</div>';
            
            if (count($imagenesProblematicas) > 0) {
                echo '<div class="status-box status-warning">';
                echo '<strong>⚠️ Imágenes problemáticas:</strong><br>';
                echo implode(', ', $imagenesProblematicas);
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
        <div class="status-box status-success">
            <?php if ($imagenesEncontradas > 0): ?>
                <h3>✅ ¡Tienes imágenes funcionando!</h3>
                <ol>
                    <li><strong>Prueba tu aplicación React ahora</strong> - Las imágenes deberían cargar</li>
                    <li><strong>Usa el botón "Buscar servidor"</strong> en tu aplicación</li>
                    <li><strong>Verifica que la URL sea:</strong> <code>http://localhost/backend-gravity</code></li>
                    <li><strong>Si aún no cargan:</strong> Haz clic en el botón 🔗 en cada producto para probar las URLs</li>
                </ol>
            <?php else: ?>
                <h3>❌ No hay imágenes disponibles</h3>
                <ol>
                    <li><strong>Crea placeholders:</strong> <a href="crear-placeholders-forzado.php" class="btn btn-warning">Crear placeholders forzado</a></li>
                    <li><strong>O copia imágenes reales</strong> a la carpeta <code>img/</code></li>
                </ol>
            <?php endif; ?>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="crear-placeholders.php" class="btn btn-warning">🎨 Crear Placeholders</a>
            <a href="crear-placeholders-forzado.php" class="btn btn-danger">🔄 Recrear Todas las Imágenes</a>
            <a href="diagnostico.php" class="btn">📊 Ver Diagnóstico</a>
            <a href="javascript:location.reload()" class="btn">🔄 Recargar Página</a>
        </div>
    </div>
</body>
</html>
