<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/html; charset=UTF-8");

// Función para crear imagen placeholder
function crearPlaceholder($width, $height, $text, $filename) {
    // Verificar si GD está disponible
    if (!extension_loaded('gd')) {
        return false;
    }
    
    // Crear imagen
    $image = imagecreate($width, $height);
    
    // Colores
    $bg_color = imagecolorallocate($image, 240, 240, 240);
    $text_color = imagecolorallocate($image, 100, 100, 100);
    $border_color = imagecolorallocate($image, 200, 200, 200);
    
    // Fondo
    imagefill($image, 0, 0, $bg_color);
    
    // Borde
    imagerectangle($image, 0, 0, $width-1, $height-1, $border_color);
    
    // Texto
    $font_size = 3;
    $text_width = imagefontwidth($font_size) * strlen($text);
    $text_height = imagefontheight($font_size);
    $x = ($width - $text_width) / 2;
    $y = ($height - $text_height) / 2;
    
    imagestring($image, $font_size, $x, $y, $text, $text_color);
    
    // Guardar
    $result = imagepng($image, $filename);
    imagedestroy($image);
    
    return $result;
}

$mensaje = "";
$creadas = 0;

if (isset($_POST['crear'])) {
    // Crear carpeta img si no existe
    $imgDir = __DIR__ . '/img';
    if (!is_dir($imgDir)) {
        mkdir($imgDir, 0755, true);
    }
    
    // Lista de imágenes a crear basada en la BD
    $imagenes = [
        'img/sudaderah1.png' => 'Sudadera Hombre 1',
        'img/sudaderah2.png' => 'Sudadera Hombre 2',
        'img/sudaderah3.png' => 'Sudadera Hombre 3',
        'img/sudaderah4.png' => 'Sudadera Hombre 4',
        'img/sudaderah5.png' => 'Sudadera Hombre 5',
        'img/sudaderah6.png' => 'Sudadera Hombre 6',
        'img/sudaderah7.png' => 'Sudadera Hombre 7',
        'img/sudaderah8.png' => 'Sudadera Hombre 8',
        'img/sudaderah9.png' => 'Sudadera Hombre 9',
        'img/sudaderah10.png' => 'Sudadera Hombre 10',
        'img/sudaderad1.png' => 'Sudadera Mujer 1',
        'img/sudaderad2.png' => 'Sudadera Mujer 2',
        'img/sudaderad3.png' => 'Sudadera Mujer 3',
        'img/sudaderad4.png' => 'Sudadera Mujer 4',
        'img/sudaderad5.png' => 'Sudadera Mujer 5',
        'img/sudaderad6.png' => 'Sudadera Mujer 6',
        'img/sudaderad7.png' => 'Sudadera Mujer 7',
        'img/sudaderad8.png' => 'Sudadera Mujer 8',
        'img/sudaderad9.png' => 'Sudadera Mujer 9',
        'img/sudaderad10.png' => 'Sudadera Mujer 10',
        'img/sudaderad11.png' => 'Sudadera Mujer 11',
        'img/chaquetad1.png' => 'Chaqueta Mujer 1',
        'img/chaquetad2.png' => 'Chaqueta Mujer 2',
        'img/chaquetah1.png' => 'Chaqueta Hombre 1',
        'img/chaquetah2.png' => 'Chaqueta Hombre 2',
        'img/chaquetah3.png' => 'Chaqueta Hombre 3',
        'img/chaquetah4.png' => 'Chaqueta Hombre 4',
    ];
    
    foreach ($imagenes as $ruta => $texto) {
        $filename = __DIR__ . '/' . $ruta;
        
        // Solo crear si no existe
        if (!file_exists($filename)) {
            if (crearPlaceholder(300, 300, $texto, $filename)) {
                $creadas++;
            }
        }
    }
    
    $mensaje = "✅ Se crearon $creadas imágenes placeholder";
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>🎨 Crear Placeholders - Gravity</title>
    <meta charset="UTF-8">
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
        h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        .btn {
            background: #007bff;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin: 10px 5px;
        }
        .btn:hover { background: #0056b3; }
        .btn-success { background: #28a745; }
        .btn-warning { background: #ffc107; color: black; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 Crear Imágenes Placeholder</h1>
        
        <?php if ($mensaje): ?>
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <strong><?php echo $mensaje; ?></strong>
            </div>
        <?php endif; ?>
        
        <p>Esta herramienta creará imágenes placeholder temporales para que puedas probar tu tienda mientras consigues las imágenes reales.</p>
        
        <h3>📋 Lo que se creará:</h3>
        <ul>
            <li>✅ Imágenes de 300x300 píxeles</li>
            <li>✅ Formato PNG</li>
            <li>✅ Texto descriptivo en cada imagen</li>
            <li>✅ Solo se crean las que no existen</li>
        </ul>
        
        <?php if (extension_loaded('gd')): ?>
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <strong>✅ Extensión GD disponible</strong> - Se pueden crear imágenes
            </div>
            
            <form method="post">
                <button type="submit" name="crear" class="btn btn-success">
                    🎨 Crear Imágenes Placeholder
                </button>
            </form>
        <?php else: ?>
            <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <strong>❌ Extensión GD no disponible</strong><br>
                No se pueden crear imágenes automáticamente. Tendrás que copiar las imágenes manualmente.
            </div>
        <?php endif; ?>
        
        <h3>🔄 Alternativas:</h3>
        <ol>
            <li><strong>Copiar imágenes reales:</strong> Busca las imágenes en tu proyecto original y cópialas a la carpeta <code>img/</code></li>
            <li><strong>Descargar imágenes:</strong> Busca imágenes de productos similares en internet</li>
            <li><strong>Usar placeholders online:</strong> Usar servicios como placeholder.com</li>
        </ol>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="verificar-imagenes.php" class="btn">🔍 Verificar Imágenes</a>
            <a href="diagnostico.php" class="btn btn-warning">📊 Ver Diagnóstico</a>
        </div>
    </div>
</body>
</html>
