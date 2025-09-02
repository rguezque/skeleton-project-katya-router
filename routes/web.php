<?php declare(strict_types = 1);

use Project\App\Controllers\DashboardController;
use Project\App\Config\App;
use rguezque\Request;
use rguezque\Response;
use rguezque\Services;

$app = App::getApplication();

$app->get('/', [DashboardController::class, 'homeAction']);
$app->get('/home/test', [DashboardController::class, 'homeAction']);

$app->get('/info', function(Request $request, Services $services) {
    return new Response(App::getBaseUrl());
});

return $app;

?>