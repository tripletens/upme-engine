<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\PermissionService;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantPermission
{
    public function __construct(private PermissionService $permissionService) {}

    /**
     * Handle permission checking for incoming requests.
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();
        $tenant = app()->bound('current_tenant') ? app('current_tenant') : null;

        // Allow API Integration requests with X-Api-Key or active Tenant Context
        if ($tenant && ($request->header('X-Api-Key') || env('APP_ENV') === 'local')) {
            return $next($request);
        }

        if (!$user || !$tenant) {
            return response()->json([
                'status' => 'error',
                'code' => 'UNAUTHORIZED',
                'message' => 'User context or tenant context missing.',
            ], 401);
        }

        $hasPermission = $this->permissionService->hasPermission($user, $tenant->id, $permission);

        if (!$hasPermission) {
            return response()->json([
                'status' => 'error',
                'code' => 'FORBIDDEN',
                'message' => "Forbidden: Required permission '{$permission}' is missing.",
            ], 403);
        }

        return $next($request);
    }
}
