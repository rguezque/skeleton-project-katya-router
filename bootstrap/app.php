<?php declare(strict_types = 1);

use Dotenv\Dotenv;
use Project\App\Config\App;
use rguezque\Environment;

// Manejo de errores
Environment::register();
Environment::setLogPath(dirname(__DIR__) . '/logs');

// Carga de las variables de entorno desde el archivo .env
$dotenv = Dotenv::createImmutable(dirname(__DIR__));
$env = $dotenv->load();

// Registro de servicios
$services = require __DIR__ . '/services.php';

// Configuración de la aplicación. Directorio raíz y directorio relativo de archivos estáticos
App::configure(
    base_path: dirname(__DIR__), 
    static_dir: '/static', 
    services: $services
);

App::setMetadata([
    ['charset' => 'UTF-8'],
    ['name' => 'vierport', 'content' => 'width=device-width, initial-scale=1.0'],
    ['name' => 'description', 'content' => env('app.name', 'Katya Router Application')],
    ['name' => 'brand', 'content' => env('app.brand', 'rguezque')],
    ['name' => 'description', 'content' => env('app.description', 'Project Skeleton - PHP Framework')],
    ['name' => 'version', 'content' => env('app.version', '1.0.0')],
    ['name' => 'author', 'content' => env('app.author', 'Luis Arturo Rodríguez')],
    ['http-equiv' => 'Expires', 'content' => '0'],
    ['http-equiv' => 'Last-Modified', 'content' => '0'],
    ['http-equiv' => 'Cache-Control', 'content' => 'no-store, no-cache, must-revalidate'],
    ['http-equiv' => 'Cache-Control', 'content' => 'post-check=0, pre-check=0'],
    ['http-equiv' => 'Pragma', 'content' => 'no-cache']
]);

// Se usan cookies para recuperar las variables de entorno en el Javascript del front-end
setcookie('API_URL', $env['API_URL']);
setcookie('BASE_URL', $env['BASE_URL'] ?? App::getBaseUrl());

?>