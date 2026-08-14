<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Services\PaystackService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BillingController extends Controller
{
    public function __construct(private PaystackService $paystackService) {}

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

        $result = $this->paystackService->initializeSubscription(
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

        $result = $this->paystackService->verifyPayment($reference);
        return response()->json($result);
    }

    /**
     * Paystack automated webhook endpoint.
     */
    public function webhook(Request $request): JsonResponse
    {
        $paystackSignature = $request->header('x-paystack-signature');
        $secretKey = env('PAYSTACK_SECRET_KEY', 'sk_test_mock_paystack_secret_key');

        // Signature validation
        if ($paystackSignature && hash_hmac('sha512', $request->getContent(), $secretKey) !== $paystackSignature) {
            return response()->json(['status' => 'error', 'message' => 'Invalid webhook signature.'], 400);
        }

        $event = $request->input('event');
        $data = $request->input('data');

        if ($event === 'charge.success') {
            $reference = $data['reference'] ?? null;
            if ($reference) {
                $this->paystackService->verifyPayment($reference);
            }
        }

        return response()->json(['status' => 'success']);
    }
}
