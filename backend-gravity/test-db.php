<?php
$host = "localhost";
$dbname = "gravity";
$username = "tu_usuario";
$password = "tu_contraseña";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "¡Conexión exitosa a la base de datos!";
} catch(PDOException $e) {
    echo "Error de conexión: " . $e->getMessage();
}
?>