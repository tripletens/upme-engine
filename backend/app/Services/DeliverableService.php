<?php

namespace App\Services;

use App\Contracts\Repositories\ActivityRepositoryInterface;
use App\Contracts\Repositories\DeliverableRepositoryInterface;
use App\Contracts\Services\DeliverableServiceInterface;
use App\Models\Deliverable;
use App\Models\Evidence;
use Illuminate\Http\UploadedFile;

class DeliverableService implements DeliverableServiceInterface
{
    public function __construct(
        private DeliverableRepositoryInterface $deliverableRepository,
        private ActivityRepositoryInterface $activityRepository
    ) {}

    public function uploadEvidence(int $deliverableId, UploadedFile $file, ?string $notes, int $uploadedByUserId): Evidence
    {
        $deliverable = $this->deliverableRepository->findOrFail($deliverableId);
        $path = $file->store('evidence', 'public');

        $evidence = $this->deliverableRepository->createEvidence([
            'deliverable_id' => $deliverable->id,
            'uploaded_by_user_id' => $uploadedByUserId,
            'file_path' => $path,
            'file_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
            'notes' => $notes,
        ]);

        $this->deliverableRepository->update($deliverable, ['status' => 'SUBMITTED']);

        $this->deliverableRepository->recordProjectEvent(
            $deliverable->activity->project_id,
            'DELIVERABLE_SUBMITTED',
            [
                'deliverable_id' => $deliverable->id,
                'deliverable_title' => $deliverable->title,
                'message' => "Evidence uploaded for deliverable '{$deliverable->title}'. Awaiting supervisor sign-off.",
            ]
        );

        return $evidence;
    }

    public function approveOrRejectEvidence(int $deliverableId, string $action, ?string $comments = null): Deliverable
    {
        $deliverable = $this->deliverableRepository->findOrFail($deliverableId);

        if ($action === 'APPROVE') {
            $this->deliverableRepository->update($deliverable, ['status' => 'APPROVED']);
            $this->activityRepository->update($deliverable->activity, [
                'progress' => 100.0,
                'status' => 'COMPLETED',
            ]);

            $eventType = 'DELIVERABLE_APPROVED';
            $msg = "Deliverable '{$deliverable->title}' approved by supervisor.";
        } else {
            $this->deliverableRepository->update($deliverable, ['status' => 'REJECTED']);
            $eventType = 'DELIVERABLE_REJECTED';
            $msg = "Deliverable '{$deliverable->title}' rejected: " . ($comments ?? '');
        }

        $this->deliverableRepository->recordProjectEvent(
            $deliverable->activity->project_id,
            $eventType,
            [
                'deliverable_id' => $deliverable->id,
                'deliverable_title' => $deliverable->title,
                'message' => $msg,
            ]
        );

        return $deliverable->refresh();
    }
}
