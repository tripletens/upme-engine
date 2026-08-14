<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('upme:health', function () {
    $this->info('Universal Project Monitoring Engine is Healthy.');
})->purpose('Check UPME system status');
