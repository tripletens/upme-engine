<?php

namespace App\Contracts\Services;

use App\Models\Organization;

interface BillingServiceInterface
{
    public function initializeSubscription(Organization $organization, string $planTier, string $email): array;

    public function verifyPayment(string $reference): array;

    public function handleWebhook(string $signature, string $payloadContent, array $payloadData): array;
}
