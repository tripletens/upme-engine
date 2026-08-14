<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadEvidenceRequest;
use App\Http\Requests\ApproveEvidenceRequest;
use App\Models\Deliverable;
use App\Models\Evidence;
use App\Models\ProjectEvent;
use Illuminate\Http\JsonResponse;

class DeliverableEvidenceController extends Controller
{
    public function upload(int $deliverableId, UploadEvidenceRequest $request): JsonResponse
    {
        $deliverable = Deliverable::findOrFail($deliverableId);
        $file = $request->file('file');

        $path = $file->store('evidence', 'public');

        $evidence = Evidence::create([
            'deliverable_id' => $deliverable->id,
            'uploaded_by_user_id' => 1, // Current authenticated user ID
            'file_path' => $path,
            'file_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
            'notes' => $request->validated('notes'),
        ]);

        $deliverable->status = 'SUBMITTED';
        $deliverable->save();

        ProjectEvent::create([
            'project_id' => $deliverable->activity->project_id,
            'event_type' => 'DELIVERABLE_SUBMITTED',
            'payload' => [
                'deliverable_id' => $deliverable->id,
                'deliverable_title' => $deliverable->title,
                'message' => "Evidence uploaded for deliverable '{$deliverable->title}'. Awaiting supervisor sign-off."
            ]
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Evidence uploaded and deliverable submitted for approval.',
            'data' => $evidence,
        ], 201);
    }

    public function approve(int $deliverableId, ApproveEvidenceRequest $request): JsonResponse
    {
        $deliverable = Deliverable::findOrFail($deliverableId);
        $action = $request->validated('action');

        if ($action === 'APPROVE') {
            $deliverable->status = 'APPROVED';
            $deliverable->activity->progress = 100.0;
            $deliverable->activity->status = 'COMPLETED';
            $deliverable->activity->save();

            $eventType = 'DELIVERABLE_APPROVED';
            $msg = "Deliverable '{$deliverable->title}' approved by supervisor.";
        } else {
            $deliverable->status = 'REJECTED';
            $eventType = 'DELIVERABLE_REJECTED';
            $msg = "Deliverable '{$deliverable->title}' rejected: " . $request->validated('comments');
        }

        $deliverable->save();

        ProjectEvent::create([
            'project_id' => $deliverable->activity->project_id,
            'event_type' => $eventType,
            'payload' => [
                'deliverable_id' => $deliverable->id,
                'deliverable_title' => $deliverable->title,
                'message' => $msg,
            ]
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Deliverable evidence status updated to {$deliverable->status}.",
            'data' => $deliverable,
        ]);
    }
}
