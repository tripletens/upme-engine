<?php

namespace App\Http\Controllers\Api\v1;

use App\Domain\Progress\ProgressCalculationEngine;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateActivityProgressRequest;
use App\Http\Resources\ActivityResource;
use App\Jobs\ProcessGraphDelayJob;
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
        ProjectHealthService $healthService,
        ProgressCalculationEngine $progressEngine
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

        if ((float) $activity->progress >= 100.0) {
            $activity->status = 'COMPLETED';
            $activity->progress = 100.0;
        }

        $activity->save();

        // Recalculate parent project overall progress & health score
        $project = $activity->project;
        $project->overall_progress = $progressEngine->calculateProgress($project);
        $project->save();

        // Dispatch asynchronous background DAG delay propagation job
        ProcessGraphDelayJob::dispatch($activity->id);

        // Immediate recalculation for active HTTP response payload
        $impactedActivities = $dependencyService->propagateDelay($activity);
        $healthService->calculateHealth($project);

        return response()->json([
            'status' => 'success',
            'message' => 'Activity progress updated successfully.',
            'data' => new ActivityResource($activity),
            'calculated_project_progress' => $project->overall_progress,
            'downstream_impact' => $impactedActivities,
            'job_dispatched' => true,
        ]);
    }
}
