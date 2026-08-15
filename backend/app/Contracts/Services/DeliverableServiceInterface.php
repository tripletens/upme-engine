<?php

namespace App\Contracts\Services;

use App\Models\Deliverable;
use App\Models\Evidence;
use Illuminate\Http\UploadedFile;

interface DeliverableServiceInterface
{
    public function uploadEvidence(int $deliverableId, UploadedFile $file, ?string $notes, int $uploadedByUserId): Evidence;

    public function approveOrRejectEvidence(int $deliverableId, string $action, ?string $comments = null): Deliverable;
}
