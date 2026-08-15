<?php

namespace App\Http\Controllers\Api\v1;

use App\Contracts\Services\BillingServiceInterface;
use App\Http\Controllers\Controller;
use App\Models\Organization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use InvalidArgumentException;

class BillingController extends Controller
{
    public function __construct(
        private BillingServiceInterface $billingService
    ) {}

    /**
     * Initialize Paystack subscription payment.
     */
    public function initialize(Request $request): JsonResponse
    {
        $request->validate([
            'plan_tier' => ['required', 'string', 'in:STARTER,PROFESSIONAL,ENTERPRISE'],
            'email' => ['required', 'email'],
        ]);

        $tenant = app()->bound('current_tenant') ? app('current_tenant') : Organization::first();
        if (!$tenant) {
            return response()->json(['status' => 'error', 'message' => 'Tenant not found.'], 404);
        }

        $result = $this->billingService->initializeSubscription(
            $tenant,
            $request->input('plan_tier'),
            $request->input('email')
        );

        return response()->json($result);
    }

    /**
     * Verify Paystack payment transaction.
     */
    public function verify(Request $request): JsonResponse
    {
        $reference = $request->query('reference');
        if (!$reference) {
            return response()->json(['status' => 'error', 'message' => 'Reference query parameter required.'], 400);
        }

        $result = $this->billingService->verifyPayment($reference);
        return response()->json($result);
    }

    /**
     * Paystack automated webhook endpoint.
     */
    public function webhook(Request $request): JsonResponse
    {
        $paystackSignature = $request->header('x-paystack-signature') ?? '';

        try {
            $result = $this->billingService->handleWebhook(
                $paystackSignature,
                $request->getContent(),
                $request->all()
            );

            return response()->json($result);
        } catch (InvalidArgumentException $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
