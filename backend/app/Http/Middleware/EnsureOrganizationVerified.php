<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOrganizationVerified
{
    /**
     * Ensure the active organization has completed KYC verification.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tenant = app()->bound('current_tenant') ? app('current_tenant') : null;

        if ($tenant && isset($tenant->settings['kyc_status'])) {
            $status = $tenant->settings['kyc_status'];

            if ($status !== 'VERIFIED') {
                return response()->json([
                    'status' => 'error',
                    'code' => 'KYC_REQUIRED',
                    'message' => "Organization verification required. Current KYC status: {$status}. Please submit corporate verification documents to activate.",
                ], 403);
            }
        }

        return $next($request);
    }
}
