<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Organization;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class TenantContextMiddleware
{
    /**
     * Handle an incoming request and set the active tenant scope.
     * Automatically seeds tenant organization with valid UUID if new API tenant code is provided.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tenantCode = $request->header('X-Organization-Code') ?? $request->query('org') ?? 'EIS-SCHOOL-DISTRICT';

        $organization = Organization::where('code', $tenantCode)->first();
        
        if (!$organization) {
            $organization = Organization::create([
                'uuid' => (string) Str::uuid(),
                'name' => ucwords(str_replace('-', ' ', strtolower($tenantCode))),
                'code' => $tenantCode,
                'settings' => ['kyc_status' => 'VERIFIED', 'plan' => 'ENTERPRISE'],
            ]);
        }

        app()->instance('current_tenant', $organization);

        return $next($request);
    }
}
