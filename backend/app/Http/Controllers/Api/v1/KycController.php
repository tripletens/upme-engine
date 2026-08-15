<?php

namespace App\Http\Controllers\Api\v1;

use App\Contracts\Services\KycServiceInterface;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KycController extends Controller
{
    public function __construct(
        private KycServiceInterface $kycService
    ) {}

    /**
     * Get current tenant KYC verification status.
     */
    public function status(): JsonResponse
    {
        $tenant = app('current_tenant');
        $status = $this->kycService->getStatus($tenant);

        return response()->json([
            'status' => 'success',
            'data' => $status,
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
        $result = $this->kycService->submitKyc(
            $tenant,
            $request->input('tax_identification_number'),
            $request->input('registration_number'),
            $request->file('certificate_file')
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Corporate KYC verification documents submitted successfully. Status: PENDING_REVIEW.',
            'data' => $result,
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
        $result = $this->kycService->reviewKyc(
            $tenant,
            $request->input('action'),
            $request->input('reason')
        );

        return response()->json([
            'status' => 'success',
            'message' => $result['message'],
            'data' => [
                'kyc_status' => $result['kyc_status'],
            ]
        ]);
    }
}
