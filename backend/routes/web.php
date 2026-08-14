<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'Universal Project Monitoring Engine (UPME) API Gateway',
        'version' => '1.0.0',
        'status' => 'ACTIVE',
        'documentation' => '/api/v1/projects',
    ]);
});
