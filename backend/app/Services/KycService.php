<?php

namespace App\Services;

use App\Contracts\Repositories\OrganizationRepositoryInterface;
use App\Contracts\Services\KycServiceInterface;
use App\Models\Organization;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;

class KycService implements KycServiceInterface
{
    public function __construct(
        private OrganizationRepositoryInterface $organizationRepository
    ) {}

    public function getStatus(Organization $organization): array
    {
        $settings = $organization->settings ?? [];

        return [
            'organization_id' => $organization->id,
            'organization_name' => $organization->name,
            'code' => $organization->code,
            'kyc_status' => $settings['kyc_status'] ?? 'UNVERIFIED',
            'documents' => $settings['kyc_documents'] ?? [],
            'submitted_at' => $settings['kyc_submitted_at'] ?? null,
            'verified_at' => $settings['kyc_verified_at'] ?? null,
        ];
    }

    public function submitKyc(Organization $organization, string $tin, string $rcNumber, UploadedFile $file): array
    {
        $path = $file->store('kyc_vault/' . $organization->uuid, 'local');

        $settings = $organization->settings ?? [];
        $settings['kyc_status'] = 'PENDING_REVIEW';
        $settings['kyc_submitted_at'] = Carbon::now()->toIso8601String();
        $settings['kyc_documents'] = [
            'tin' => $tin,
            'rc_number' => $rcNumber,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
        ];

        $this->organizationRepository->updateSettings($organization, $settings);

        return [
            'kyc_status' => 'PENDING_REVIEW',
            'submitted_at' => $settings['kyc_submitted_at'],
        ];
    }

    public function reviewKyc(Organization $organization, string $action, ?string $reason = null): array
    {
        $settings = $organization->settings ?? [];

        if ($action === 'APPROVE') {
            $settings['kyc_status'] = 'VERIFIED';
            $settings['kyc_verified_at'] = Carbon::now()->toIso8601String();
            $msg = 'Corporate KYC verified successfully. All project execution features are unlocked.';
        } else {
            $settings['kyc_status'] = 'REJECTED';
            $settings['kyc_rejection_reason'] = $reason;
            $msg = 'Corporate KYC verification rejected: ' . ($reason ?? '');
        }

        $this->organizationRepository->updateSettings($organization, $settings);

        return [
            'message' => $msg,
            'kyc_status' => $settings['kyc_status'],
        ];
    }
}
