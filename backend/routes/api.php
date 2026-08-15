<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\v1\ProjectController;
use App\Http\Controllers\Api\v1\ActivityController;
use App\Http\Controllers\Api\v1\DependencyController;
use App\Http\Controllers\Api\v1\DeliverableEvidenceController;
use App\Http\Controllers\Api\v1\TemplateAndReportController;
use App\Http\Controllers\Api\v1\KycController;
use App\Http\Controllers\Api\v1\BillingController;
use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\v1\MonitoringEngineController;
use App\Http\Controllers\Api\v1\OrganizationUserController;
use App\Http\Controllers\Api\v1\DocsController;

/*
|--------------------------------------------------------------------------
| UPME REST API Routes (v1)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->middleware(['api', \App\Http\Middleware\TenantContextMiddleware::class])->group(function () {
    // OpenAPI v3.0 Documentation Endpoint
    Route::get('/docs/openapi.json', [DocsController::class, 'openApiSpec']);

    // User Authentication
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Multi-Tenant Company User Management
    Route::get('/organization/users', [OrganizationUserController::class, 'index']);
    Route::post('/organization/users/invite', [OrganizationUserController::class, 'invite']);

    // Paystack SaaS Billing & Subscriptions
    Route::post('/billing/initialize', [BillingController::class, 'initialize']);
    Route::get('/billing/verify', [BillingController::class, 'verify']);
    Route::post('/billing/paystack/webhook', [BillingController::class, 'webhook']);

    // KYC Verification State Machine
    Route::get('/kyc/status', [KycController::class, 'status']);
    Route::post('/kyc/submit', [KycController::class, 'submit'])->middleware(\App\Http\Middleware\EnsureTenantPermission::class . ':kyc:submit');
    Route::post('/kyc/review', [KycController::class, 'review'])->middleware(\App\Http\Middleware\EnsureTenantPermission::class . ':kyc:review');

    // Projects (Gated by KYC Verification status)
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store'])
        ->middleware([\App\Http\Middleware\EnsureOrganizationVerified::class, \App\Http\Middleware\EnsureTenantPermission::class . ':project:create']);
    
    Route::get('/projects/{uuid}', [ProjectController::class, 'show']);
    Route::get('/projects/{uuid}/health', [ProjectController::class, 'health']);

    // Advanced Monitoring Engine & Intelligence Endpoints
    Route::get('/projects/{uuid}/health/explanation', [MonitoringEngineController::class, 'explainHealth']);
    Route::get('/projects/{uuid}/alerts', [MonitoringEngineController::class, 'indexAlerts']);
    Route::get('/projects/{uuid}/corrective-actions', [MonitoringEngineController::class, 'indexCorrectiveActions']);
    Route::post('/projects/{uuid}/baselines', [MonitoringEngineController::class, 'createBaselineSnapshot']);
    Route::post('/risks/{id}/materialize', [MonitoringEngineController::class, 'materializeRisk']);
    Route::post('/monitoring/evaluate/{uuid}', [MonitoringEngineController::class, 'evaluateMonitoring']);

    // Templates & Instantiation
    Route::get('/templates', [TemplateAndReportController::class, 'indexTemplates']);
    Route::post('/projects/from-template', [TemplateAndReportController::class, 'createFromTemplate'])
        ->middleware([\App\Http\Middleware\EnsureOrganizationVerified::class, \App\Http\Middleware\EnsureTenantPermission::class . ':project:create']);

    // Reports & CSV / PDF Export
    Route::get('/projects/{uuid}/report', [TemplateAndReportController::class, 'generateReport']);
    Route::get('/projects/{uuid}/report/export', [TemplateAndReportController::class, 'exportCsv']);
    Route::get('/projects/{uuid}/report/pdf', [TemplateAndReportController::class, 'exportPdfReport']);

    // Activities & Delay Propagation
    Route::post('/activities/{id}/progress', [ActivityController::class, 'updateProgress'])
        ->middleware(\App\Http\Middleware\EnsureTenantPermission::class . ':progress:update');

    // Dependencies (DAG links)
    Route::post('/dependencies', [DependencyController::class, 'store'])
        ->middleware(\App\Http\Middleware\EnsureTenantPermission::class . ':project:edit');

    // Evidence & Approvals
    Route::post('/deliverables/{id}/evidence', [DeliverableEvidenceController::class, 'upload'])
        ->middleware(\App\Http\Middleware\EnsureTenantPermission::class . ':evidence:upload');
    
    Route::post('/deliverables/{id}/approve', [DeliverableEvidenceController::class, 'approve'])
        ->middleware(\App\Http\Middleware\EnsureTenantPermission::class . ':evidence:approve');
});
