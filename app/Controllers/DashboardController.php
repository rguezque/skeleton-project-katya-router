<?php
declare(strict_types=1);

namespace Project\App\Controllers;

use rguezque\HtmlResponse;
use rguezque\Request;
use rguezque\Services;

class DashboardController
{
    public static function homeAction(Request $request, Services $services)
    {
        $view = $services->view();
        $response = new HtmlResponse($view->fetch('home'));

        return $response;
    }
}
