<?php declare(strict_types = 1);

use rguezque\Exceptions\{
    RouteNotFoundException,
    UnsupportedRequestMethodException
};
use rguezque\{
    HttpStatus,
    Request,
    Response,
    SapiEmitter
};

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../views/site/maintenance.php')) {
    require $maintenance;
    exit;
}

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../bootstrap/app.php';
$app = require __DIR__ . '/../routes/web.php';


try {
    $response = $app->run(Request::fromGlobals());
} catch(RouteNotFoundException $e) {
    $message = sprintf('<h1>Not Found</h1><p>%s</p>', $e->getMessage());
    $response = new Response($message, HttpStatus::HTTP_NOT_FOUND);
} catch(UnsupportedRequestMethodException $e) {
    $message = sprintf('<h1>Not Allowed</h1><p>%s</p>', $e->getMessage());
    $response = new Response($message, HttpStatus::HTTP_METHOD_NOT_ALLOWED);
} catch(UnexpectedValueException $e) {
    $message = sprintf('<h1>Unexpected Value</h1><p>%s</p>', $e->getMessage());
    $response = new Response($message, HttpStatus::HTTP_NOT_ACCEPTABLE);
}

SapiEmitter::emit($response);

?>