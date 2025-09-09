<?php declare(strict_types = 1);

$directory = __DIR__; // Reemplaza con la ruta de tu directorio

// Verifica si el directorio existe
if (!is_dir($directory)) {
    die("Error: El directorio '{$directory}' no existe.\n");
}

$files = glob("{$directory}/*.json");
$file_keys = [];
$reference_file = '';
$max_keys_count = 0;

// 1. Recorre todos los archivos para extraer sus claves y encontrar el archivo de referencia
foreach ($files as $file) {
    $content = file_get_contents($file);
    if ($content === false) {
        echo "Error: No se pudo leer el archivo '{$file}'.\n";
        continue;
    }

    $data = json_decode($content, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "Error: El archivo '{$file}' no es un JSON válido. " . json_last_error_msg() . "\n";
        continue;
    }

    $keys = get_all_keys_recursively($data);
    $unique_keys = array_unique($keys);
    $file_keys[$file] = $unique_keys;

    // Actualiza el archivo de referencia si este tiene más claves
    if (count($unique_keys) > $max_keys_count) {
        $max_keys_count = count($unique_keys);
        $reference_file = $file;
    }
}

if (empty($file_keys) || empty($reference_file)) {
    die("No se encontraron archivos JSON válidos para comparar.\n");
}

$reference_keys = $file_keys[$reference_file];
sort($reference_keys);

echo "Archivo de referencia (con más claves): " . basename($reference_file) . "\n";
echo "Total de claves de referencia: " . count($reference_keys) . "\n\n";

// 2. Compara cada archivo con el modelo de referencia
foreach ($file_keys as $file => $keys) {
    $missing_keys = array_diff($reference_keys, $keys);
    
    echo "--- Archivo: " . basename($file) . " ---\n";
    if (empty($missing_keys)) {
        echo "✅ Todas las claves están presentes.\n";
    } else {
        echo "❌ Claves faltantes (" . count($missing_keys) . "):\n";
        foreach ($missing_keys as $key) {
            echo "  - {$key}\n";
        }
    }
    echo "\n";
}

function get_all_keys_recursively(array $array, ?string $prefix = null): array
{
    $keys = [];
    foreach ($array as $key => $value) {
        $current_key = $prefix ? "{$prefix}.{$key}" : $key;
        $keys[] = $current_key;

        if (is_array($value)) {
            $keys = array_merge($keys, get_all_keys_recursively($value, $current_key));
        }
    }
    return $keys;
}

?>