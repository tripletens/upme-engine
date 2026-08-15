<?php

namespace App\Http\Controllers\Api\v1;

use App\Contracts\Services\DeliverableServiceInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\ApproveEvidenceRequest;
use App\Http\Requests\UploadEvidenceRequest;
use Illuminate\Http\JsonResponse;

class DeliverableEvidenceController extends Controller
{
    public function __construct(
        private DeliverableServiceInterface $deliverableService
    ) {}

    public function upload(int $deliverableId, UploadEvidenceRequest $request): JsonResponse
    {
        $evidence = $this->deliverableService->uploadEvidence(
            $deliverableId,
            $request->file('file'),
            $request->validated('notes'),
            1 // Current authenticated user ID / context
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Evidence uploaded and deliverable submitted for approval.',
            'data' => $evidence,
        ], 201);
    }

    public function approve(int $deliverableId, ApproveEvidenceRequest $request): JsonResponse
    {
        $deliverable = $this->deliverableService->approveOrRejectEvidence(
            $deliverableId,
            $request->validated('action'),
            $request->validated('comments')
        );

        return response()->json([
            'status' => 'success',
            'message' => "Deliverable evidence status updated to {$deliverable->status}.",
            'data' => $deliverable,
        ]);
    }
}
