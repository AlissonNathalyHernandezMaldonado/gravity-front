<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/html; charset=UTF-8");
?>
<!DOCTYPE html>
<html>
<head>
    <title>🧪 Test de Imágenes - Gravity</title>
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
        .image-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .image-item {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 10px;
            text-align: center;
        }
        .image-item img {
            max-width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 5px;
        }
        .status { font-size: 12px; margin-top: 5px; }
        .success { color: #28a745; }
        .error { color: #dc3545; }
        h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 Test de Imágenes</h1>
        
        <p>Esta página muestra todas las imágenes que deberían estar disponibles para tu tienda:</p>
        
        <div class="image-grid">
            <?php
            // Lista de todas las imágenes esperadas
            $imagenes = [
                'img/sudaderah1.png' => 'Sudadera Hombre Azul',
                'img/sudaderah2.png' => 'Sudadera Hombre Blanca',
                'img/sudaderah3.png' => 'Sudadera Hombre Negra',
                'img/sudaderah4.png' => 'Sudadera Hombre Roja',
                'img/sudaderah5.png' => 'Sudadera Hombre Beige',
                'img/sudaderah6.png' => 'Sudadera Hombre Verde',
                'img/sudaderah7.png' => 'Sudadera Hombre Gris',
                'img/sudaderah8.png' => 'Sudadera Hombre Verde',
                'img/sudaderah9.png' => 'Sudadera Hombre Amarilla',
                'img/sudaderah10.png' => 'Sudadera Hombre Azul',
                'img/sudaderad1.png' => 'Sudadera Mujer Roja',
                'img/sudaderad2.png' => 'Sudadera Mujer Negra',
                'img/sudaderad3.png' => 'Sudadera Mujer Azul',
                'img/sudaderad4.png' => 'Sudadera Mujer Negra',
                'img/sudaderad5.png' => 'Sudadera Mujer Gris',
                'img/sudaderad6.png' => 'Sudadera Mujer Verde',
                'img/sudaderad7.png' => 'Sudadera Mujer Gris',
                'img/sudaderad8.png' => 'Sudadera Mujer Balenciaga',
                'img/sudaderad9.png' => 'Sudadera Mujer 3 Piezas',
                'img/sudaderad10.png' => 'Sudadera Mujer Rosada',
                'img/sudaderad11.png' => 'Sudadera Mujer Crop',
                'img/chaquetad1.png' => 'Chaqueta Mujer Brillante',
                'img/chaquetad2.png' => 'Chaqueta Mujer Deportiva',
                'img/chaquetah1.png' => 'Chaqueta Hombre Azul',
                'img/chaquetah2.png' => 'Chaqueta Hombre Verde',
                'img/chaquetah3.png' => 'Chaqueta Hombre Deportiva',
                'img/chaquetah4.png' => 'Chaqueta Hombre Jean',
            ];
            
            $existentes = 0;
            $faltantes = 0;
            
            foreach ($imagenes as $ruta => $nombre) {
                $fullPath = __DIR__ . '/' . $ruta;
                $existe = file_exists($fullPath);
                
                if ($existe) {
                    $existentes++;
                } else {
                    $faltantes++;
                }
                
                echo '<div class="image-item">';
                echo '<h4>' . htmlspecialchars($nombre) . '</h4>';
                
                if ($existe) {
                    echo '<img src="' . $ruta . '" alt="' . htmlspecialchars($nombre) . '">';
                    echo '<div class="status success">✅ Disponible</div>';
                    echo '<div><a href="' . $ruta . '" target="_blank">Ver completa</a></div>';
                } else {
                    echo '<div style="width:100%;height:150px;background:#f0f0f0;border:1px dashed #ccc;display:flex;align-items:center;justify-content:center;border-radius:5px;">';
                    echo 'No disponible';
                    echo '</div>';
                    echo '<div class="status error">❌ Faltante</div>';
                }
                
                echo '<div style="font-size:10px;color:#666;">' . $ruta . '</div>';
                echo '</div>';
            }
            ?>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>📊 Resumen:</h3>
            <p><strong>✅ Imágenes disponibles:</strong> <?php echo $existentes; ?></p>
            <p><strong>❌ Imágenes faltantes:</strong> <?php echo $faltantes; ?></p>
            <p><strong>📈 Porcentaje completado:</strong> <?php echo round(($existentes / count($imagenes)) * 100, 1); ?>%</p>
        </div>
        
        <?php if ($faltantes > 0): ?>
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px;">
                <h4>🔧 Soluciones:</h4>
                <p><a href="crear-placeholders-forzado.php?auto=1" style="background: #ffc107; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px;">⚡ Crear todas las imágenes automáticamente</a></p>
            </div>
        <?php else: ?>
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px;">
                <h4>🎉 ¡Perfecto!</h4>
                <p>Todas las imágenes están disponibles. Tu aplicación React debería funcionar correctamente.</p>
                <p><strong>Próximo paso:</strong> Prueba tu aplicación React y usa el botón "Buscar servidor".</p>
            </div>
        <?php endif; ?>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="verificar-imagenes-detallado.php" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 5px;">🔍 Verificación Detallada</a>
            <a href="crear-placeholders-forzado.php" style="background: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 5px;">🔄 Recrear Imágenes</a>
            <a href="diagnostico.php" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 5px;">📊 Diagnóstico</a>
        </div>
    </div>
</body>
</html>
