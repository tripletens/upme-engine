<?php

namespace App\Http\Controllers\Api\v1;

use App\Contracts\Services\ActivityServiceInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateActivityProgressRequest;
use App\Http\Resources\ActivityResource;
use Illuminate\Http\JsonResponse;

class ActivityController extends Controller
{
    public function __construct(
        private ActivityServiceInterface $activityService
    ) {}

    public function updateProgress(
        int $id,
        UpdateActivityProgressRequest $request
    ): JsonResponse {
        $result = $this->activityService->updateProgress($id, $request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Activity progress updated successfully.',
            'data' => new ActivityResource($result['activity']),
            'calculated_project_progress' => $result['calculated_project_progress'],
            'downstream_impact' => $result['downstream_impact'],
            'job_dispatched' => true,
        ]);
    }
}
