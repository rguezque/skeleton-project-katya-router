<?php declare(strict_types = 1);

use Dotenv\Dotenv;
use Project\Core\App;
use Project\Core\VisitorsLogger;
use rguezque\Environment;

date_default_timezone_set('America/Mexico_City');

// Manejo de errores
Environment::register();
Environment::setLogPath(dirname(__DIR__) . '/logs');

$logger = new VisitorsLogger(dirname(__DIR__) . '/logs/visitors');
$logger->logAccess();

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
    ['name' => 'description', 'content' => env('APP_NAME', 'Katya Router Application')],
    ['name' => 'brand', 'content' => env('APP_BRAND', 'rguezque')],
    ['name' => 'description', 'content' => env('APP_DESCRIPTION', 'Project Skeleton - PHP Framework')],
    ['name' => 'version', 'content' => env('APP_VERSION', '1.0.0')],
    ['name' => 'author', 'content' => env('APP_AUTHOR', 'Luis Arturo Rodríguez')],
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