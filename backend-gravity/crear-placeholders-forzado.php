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
    
    // Colores aleatorios para hacer más interesantes los placeholders
    $colors = [
        ['bg' => [240, 248, 255], 'text' => [25, 25, 112], 'border' => [70, 130, 180]],  // Azul
        ['bg' => [255, 240, 245], 'text' => [139, 69, 19], 'border' => [205, 92, 92]],   // Rosa
        ['bg' => [240, 255, 240], 'text' => [0, 100, 0], 'border' => [34, 139, 34]],     // Verde
        ['bg' => [255, 255, 240], 'text' => [184, 134, 11], 'border' => [255, 165, 0]],  // Amarillo
        ['bg' => [248, 248, 255], 'text' => [75, 0, 130], 'border' => [138, 43, 226]]    // Púrpura
    ];
    
    $colorSet = $colors[array_rand($colors)];
    
    // Aplicar colores
    $bg_color = imagecolorallocate($image, $colorSet['bg'][0], $colorSet['bg'][1], $colorSet['bg'][2]);
    $text_color = imagecolorallocate($image, $colorSet['text'][0], $colorSet['text'][1], $colorSet['text'][2]);
    $border_color = imagecolorallocate($image, $colorSet['border'][0], $colorSet['border'][1], $colorSet['border'][2]);
    
    // Fondo
    imagefill($image, 0, 0, $bg_color);
    
    // Borde
    imagerectangle($image, 0, 0, $width-1, $height-1, $border_color);
    imagerectangle($image, 2, 2, $width-3, $height-3, $border_color);
    
    // Texto principal
    $font_size = 4;
    $lines = explode(' ', $text);
    $y_start = ($height / 2) - (count($lines) * 20 / 2);
    
    foreach($lines as $i => $line) {
        $text_width = imagefontwidth($font_size) * strlen($line);
        $x = ($width - $text_width) / 2;
        $y = $y_start + ($i * 20);
        imagestring($image, $font_size, $x, $y, $line, $text_color);
    }
    
    // Agregar "PLACEHOLDER" en la parte inferior
    $placeholder_text = "PLACEHOLDER";
    $small_font = 2;
    $placeholder_width = imagefontwidth($small_font) * strlen($placeholder_text);
    $placeholder_x = ($width - $placeholder_width) / 2;
    $placeholder_y = $height - 25;
    imagestring($image, $small_font, $placeholder_x, $placeholder_y, $placeholder_text, $text_color);
    
    // Guardar
    $result = imagepng($image, $filename);
    imagedestroy($image);
    
    return $result;
}

$mensaje = "";
$creadas = 0;
$errores = [];

if (isset($_POST['crear']) || isset($_GET['auto'])) {
    // Crear carpeta img si no existe
    $imgDir = __DIR__ . '/img';
    if (!is_dir($imgDir)) {
        mkdir($imgDir, 0755, true);
    }
    
    // Lista de imágenes a crear basada en la BD
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
    
    foreach ($imagenes as $ruta => $texto) {
        $filename = __DIR__ . '/' . $ruta;
        
        // Crear directorio si no existe
        $dir = dirname($filename);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        
        // Crear imagen (forzar recreación)
        if (crearPlaceholder(300, 300, $texto, $filename)) {
            $creadas++;
        } else {
            $errores[] = "Error creando: $ruta";
        }
    }
    
    $mensaje = "✅ Se crearon/recrearon $creadas imágenes placeholder";
    if (count($errores) > 0) {
        $mensaje .= "<br>❌ Errores: " . implode(", ", $errores);
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>🔄 Crear Placeholders Forzado - Gravity</title>
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
        .btn-danger { background: #dc3545; }
        .btn-warning { background: #ffc107; color: black; }
        .status-box {
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            border-left: 4px solid;
        }
        .status-success { background: #d4edda; border-color: #28a745; }
        .status-error { background: #f8d7da; border-color: #dc3545; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔄 Crear Placeholders Forzado</h1>
        
        <?php if ($mensaje): ?>
            <div class="status-box status-success">
                <strong><?php echo $mensaje; ?></strong>
            </div>
        <?php endif; ?>
        
        <p><strong>⚠️ ATENCIÓN:</strong> Esta herramienta recreará TODAS las imágenes placeholder, incluso si ya existen.</p>
        
        <h3>📋 Lo que se creará:</h3>
        <ul>
            <li>✅ 27 imágenes de productos</li>
            <li>✅ Imágenes de 300x300 píxeles</li>
            <li>✅ Formato PNG con colores aleatorios</li>
            <li>✅ Texto descriptivo en cada imagen</li>
            <li>✅ Sobrescribirá imágenes existentes</li>
        </ul>
        
        <?php if (extension_loaded('gd')): ?>
            <div class="status-box status-success">
                <strong>✅ Extensión GD disponible</strong> - Se pueden crear imágenes
            </div>
            
            <form method="post">
                <button type="submit" name="crear" class="btn btn-danger">
                    🔄 RECREAR TODAS LAS IMÁGENES
                </button>
            </form>
            
            <p><strong>O crear automáticamente:</strong></p>
            <a href="?auto=1" class="btn btn-warning">⚡ Crear Automáticamente</a>
            
        <?php else: ?>
            <div class="status-box status-error">
                <strong>❌ Extensión GD no disponible</strong><br>
                No se pueden crear imágenes automáticamente.
            </div>
        <?php endif; ?>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="verificar-imagenes-detallado.php" class="btn">🔍 Verificar Imágenes</a>
            <a href="diagnostico.php" class="btn btn-warning">📊 Ver Diagnóstico</a>
        </div>
    </div>
</body>
</html>
