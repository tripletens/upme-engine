<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateActivityProgressRequest;
use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use App\Services\DependencyEvaluationService;
use App\Services\ProjectHealthService;
use Illuminate\Http\JsonResponse;

class ActivityController extends Controller
{
    public function updateProgress(
        int $id,
        UpdateActivityProgressRequest $request,
        DependencyEvaluationService $dependencyService,
        ProjectHealthService $healthService
    ): JsonResponse {
        $activity = Activity::findOrFail($id);

        $activity->progress = $request->validated('progress');
        if ($request->has('status')) {
            $activity->status = $request->validated('status');
        }
        if ($request->has('actual_start_date')) {
            $activity->actual_start_date = $request->validated('actual_start_date');
        }
        if ($request->has('actual_end_date')) {
            $activity->actual_end_date = $request->validated('actual_end_date');
        }

        if ($activity->progress == 100.0) {
            $activity->status = 'COMPLETED';
        }

        $activity->save();

        // Propagate potential downstream delays across graph
        $impactedActivities = $dependencyService->propagateDelay($activity);

        // Recalculate project health score
        $project = $activity->project;
        $healthService->calculateHealth($project);

        return response()->json([
            'status' => 'success',
            'message' => 'Activity progress updated successfully.',
            'data' => new ActivityResource($activity),
            'downstream_impact' => $impactedActivities,
        ]);
    }
}
