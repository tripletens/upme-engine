<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class KycController extends Controller
{
    /**
     * Get current tenant KYC verification status.
     */
    public function status(): JsonResponse
    {
        $tenant = app('current_tenant');
        $settings = $tenant->settings ?? [];

        return response()->json([
            'status' => 'success',
            'data' => [
                'organization_id' => $tenant->id,
                'organization_name' => $tenant->name,
                'code' => $tenant->code,
                'kyc_status' => $settings['kyc_status'] ?? 'UNVERIFIED',
                'documents' => $settings['kyc_documents'] ?? [],
                'submitted_at' => $settings['kyc_submitted_at'] ?? null,
                'verified_at' => $settings['kyc_verified_at'] ?? null,
            ]
        ]);
    }

    /**
     * Submit corporate KYC verification assets.
     */
    public function submit(Request $request): JsonResponse
    {
        $request->validate([
            'tax_identification_number' => ['required', 'string', 'max:50'],
            'registration_number' => ['required', 'string', 'max:50'],
            'certificate_file' => ['required', 'file', 'max:10240', 'mimes:pdf,jpg,png'],
        ]);

        $tenant = app('current_tenant');
        $file = $request->file('certificate_file');
        $path = $file->store('kyc_vault/' . $tenant->uuid, 'local');

        $settings = $tenant->settings ?? [];
        $settings['kyc_status'] = 'PENDING_REVIEW';
        $settings['kyc_submitted_at'] = Carbon::now()->toIso8601String();
        $settings['kyc_documents'] = [
            'tin' => $request->input('tax_identification_number'),
            'rc_number' => $request->input('registration_number'),
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
        ];

        $tenant->settings = $settings;
        $tenant->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Corporate KYC verification documents submitted successfully. Status: PENDING_REVIEW.',
            'data' => [
                'kyc_status' => 'PENDING_REVIEW',
                'submitted_at' => $settings['kyc_submitted_at'],
            ]
        ]);
    }

    /**
     * Compliance review approval or rejection endpoint.
     */
    public function review(Request $request): JsonResponse
    {
        $request->validate([
            'action' => ['required', 'string', 'in:APPROVE,REJECT'],
            'reason' => ['nullable', 'string'],
        ]);

        $tenant = app('current_tenant');
        $action = $request->input('action');
        $settings = $tenant->settings ?? [];

        if ($action === 'APPROVE') {
            $settings['kyc_status'] = 'VERIFIED';
            $settings['kyc_verified_at'] = Carbon::now()->toIso8601String();
            $msg = 'Corporate KYC verified successfully. All project execution features are unlocked.';
        } else {
            $settings['kyc_status'] = 'REJECTED';
            $settings['kyc_rejection_reason'] = $request->input('reason');
            $msg = 'Corporate KYC verification rejected: ' . $request->input('reason');
        }

        $tenant->settings = $settings;
        $tenant->save();

        return response()->json([
            'status' => 'success',
            'message' => $msg,
            'data' => [
                'kyc_status' => $settings['kyc_status'],
            ]
        ]);
    }
}
