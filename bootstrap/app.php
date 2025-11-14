<?php declare(strict_types = 1);

use Dotenv\Dotenv;
use Project\Core\App;
use Project\Core\VisitorsLogger;
use rguezque\Environment;

date_default_timezone_set('America/Mexico_City');

// Manejo de errores
// Para los bloques `try-catch` utiliza `Environment::handleException` en el `catch`
Environment::register();
Environment::setLogPath(dirname(__DIR__) . '/logs');

// Log de ip de visitantes para estadísticas
$logger = new VisitorsLogger(dirname(__DIR__) . '/logs/visitors');
$logger->logAccess();

// Carga de las variables de entorno desde el archivo .env
$dotenv = Dotenv::createImmutable(dirname(__DIR__));
/** @var array<string, string|null> Variables de entorno */
$env = $dotenv->load();

/** @var \rguezque\Services Definición de servicios */
$services = require __DIR__ . '/services.php';

// Configuración de la aplicación. Directorio raíz y directorio relativo de archivos estáticos
App::configure(
    base_path: dirname(__DIR__), 
    static_dir: '/static', 
    services: $services
);

/** @var array Colección de metadata */
$metadata = require __DIR__.'/metadata.php';
App::setMetadata($metadata);

// Se usan cookies para recuperar las variables de entorno en el Javascript del front-end
setcookie('API_URL', $env['API_URL']);
setcookie('BASE_URL', $env['BASE_URL'] ?? App::getBaseUrl());

?>