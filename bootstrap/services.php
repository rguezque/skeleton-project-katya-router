<?php declare(strict_types = 1);

use Project\App\Config\App;
use rguezque\Services;
use rguezque\ViewEngine;

$services = new Services();
$services->register('view', function() {
    static $view = null;
    if ($view === null) {
        $view = new ViewEngine(App::getBasepath().'/views');
    }

    return $view;
});

//App::setServices($services);
return $services;

?>