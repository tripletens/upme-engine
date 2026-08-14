<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Organization;
use Symfony\Component\HttpFoundation\Response;

class TenantContextMiddleware
{
    /**
     * Handle an incoming request and set the active tenant scope.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tenantCode = $request->header('X-Organization-Code') ?? $request->query('org');

        if ($tenantCode) {
            $organization = Organization::where('code', $tenantCode)->first();
            if ($organization) {
                app()->instance('current_tenant', $organization);
            }
        }

        return $next($request);
    }
}
