<!DOCTYPE html>
<html lang="<?= env('APP_LANG') ?>" data-bs-theme="light">

<head>
    <?= metadata(); ?>
    <title><?= env('APP_NAME') ?></title>

    <!-- Favicon -->
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/favicon-16x16.png">
    <link rel="manifest" href="/favicon_io/site.webmanifest">

    <?php
    resources(
        styles: [
            'css/app.css'
        ],
        scripts: [
            'js/app.module.js'
        ]
    );
    ?>
</head>

<body>
    <div class="d-flex justify-content-center align-items-center" style="height:100vh;">
        <div class="text-center" x-data="{ open: false }">
            <small class="d-block small text-body-tertiary" x-text="open ? '' : 'Click the title below'"></small>
            <h3 class="d-block" role="button" @click="open = ! open">Counter with <span class="font-monospace fw-bold">Alpine.js</span></h3>

            <div x-show="open">
                <div class="d-flex flex-column gap-3 mb-3">
                    <div x-data="{ count: 0 }">
                        <button class="btn btn-primary" @click="count++"><i class="fa fa-plus me-2"></i>Increase</button>
                        <button class="btn btn-warning" @click="count--"><i class="fa fa-minus me-2"></i>Decrease</button>
                        <span class="d-block my-2 fs-1 text-center font-monospace fw-bolder" x-text="count"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>