<?php

/**
 * Lightweight PSR-4 Autoloader for UPME Engine Backend
 */
spl_autoload_register(function ($class) {
    $prefixes = [
        'App\\' => __DIR__ . '/../app/',
        'Database\\Seeders\\' => __DIR__ . '/../database/seeders/',
        'Database\\Factories\\' => __DIR__ . '/../database/factories/',
        'Tests\\' => __DIR__ . '/../tests/',
    ];

    foreach ($prefixes as $prefix => $baseDir) {
        $len = strlen($prefix);
        if (strncmp($prefix, $class, $len) !== 0) {
            continue;
        }

        $relativeClass = substr($class, $len);
        $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

        if (file_exists($file)) {
            require $file;
            return true;
        }
    }

    return false;
});
