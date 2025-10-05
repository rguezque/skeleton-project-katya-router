<?php declare(strict_types = 1);

use Project\App\Controllers\DashboardController;
use Project\Core\App;
use rguezque\HtmlResponse;
use rguezque\Request;
use rguezque\Response;
use rguezque\Services;

$app = App::getApplication();

$app->get('/', [DashboardController::class, 'homeAction']);
$app->get('/info', function(Request $request, Services $services) {
    $view = $services->view->fetch('phpinfo');
    return new HtmlResponse($view);
});

return $app;

?>