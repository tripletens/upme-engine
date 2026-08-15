<?php

namespace App\Services;

use App\Contracts\Services\BillingServiceInterface;
use App\Models\Organization;
use InvalidArgumentException;

class BillingService implements BillingServiceInterface
{
    public function __construct(
        private PaystackService $paystackService
    ) {}

    public function initializeSubscription(Organization $organization, string $planTier, string $email): array
    {
        return $this->paystackService->initializeSubscription($organization, $planTier, $email);
    }

    public function verifyPayment(string $reference): array
    {
        return $this->paystackService->verifyPayment($reference);
    }

    public function handleWebhook(string $signature, string $payloadContent, array $payloadData): array
    {
        $secretKey = env('PAYSTACK_SECRET_KEY', 'sk_test_mock_paystack_secret_key');

        if ($signature && hash_hmac('sha512', $payloadContent, $secretKey) !== $signature) {
            throw new InvalidArgumentException('Invalid webhook signature.');
        }

        $event = $payloadData['event'] ?? null;
        $data = $payloadData['data'] ?? [];

        if ($event === 'charge.success') {
            $reference = $data['reference'] ?? null;
            if ($reference) {
                $this->paystackService->verifyPayment($reference);
            }
        }

        return ['status' => 'success'];
    }
}
