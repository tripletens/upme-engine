<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\v1\ProjectController;
use App\Http\Controllers\Api\v1\ActivityController;
use App\Http\Controllers\Api\v1\DependencyController;
use App\Http\Controllers\Api\v1\DeliverableEvidenceController;

/*
|--------------------------------------------------------------------------
| UPME REST API Routes (v1)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->middleware(['api', \App\Http\Middleware\TenantContextMiddleware::class])->group(function () {
    // Projects
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::get('/projects/{uuid}', [ProjectController::class, 'show']);
    Route::get('/projects/{uuid}/health', [ProjectController::class, 'health']);

    // Activities & Delay Propagation
    Route::post('/activities/{id}/progress', [ActivityController::class, 'updateProgress']);

    // Dependencies (DAG links)
    Route::post('/dependencies', [DependencyController::class, 'store']);

    // Evidence & Approvals
    Route::post('/deliverables/{id}/evidence', [DeliverableEvidenceController::class, 'upload']);
    Route::post('/deliverables/{id}/approve', [DeliverableEvidenceController::class, 'approve']);
});
