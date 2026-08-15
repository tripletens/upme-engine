<?php

namespace App\Contracts\Services;

use App\Models\Organization;
use Illuminate\Http\UploadedFile;

interface KycServiceInterface
{
    public function getStatus(Organization $organization): array;

    public function submitKyc(Organization $organization, string $tin, string $rcNumber, UploadedFile $file): array;

    public function reviewKyc(Organization $organization, string $action, ?string $reason = null): array;
}
