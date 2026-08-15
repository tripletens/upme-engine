<?php

namespace App\Services;

use App\Contracts\Repositories\ActivityRepositoryInterface;
use App\Contracts\Repositories\ProjectRepositoryInterface;
use App\Contracts\Services\ActivityServiceInterface;
use App\Domain\Progress\ProgressCalculationEngine;
use App\Jobs\ProcessGraphDelayJob;
use App\Models\Activity;
use App\Models\ActivityDependency;
use InvalidArgumentException;

class ActivityService implements ActivityServiceInterface
{
    public function __construct(
        private ActivityRepositoryInterface $activityRepository,
        private ProjectRepositoryInterface $projectRepository,
        private DependencyEvaluationService $dependencyService,
        private ProjectHealthService $healthService,
        private ProgressCalculationEngine $progressEngine
    ) {}

    public function updateProgress(int $activityId, array $data): array
    {
        $activity = $this->activityRepository->findOrFail($activityId);

        $attributes = [
            'progress' => $data['progress'] ?? $activity->progress,
        ];

        if (isset($data['status'])) {
            $attributes['status'] = $data['status'];
        }
        if (isset($data['actual_start_date'])) {
            $attributes['actual_start_date'] = $data['actual_start_date'];
        }
        if (isset($data['actual_end_date'])) {
            $attributes['actual_end_date'] = $data['actual_end_date'];
        }

        if ((float) $attributes['progress'] >= 100.0) {
            $attributes['status'] = 'COMPLETED';
            $attributes['progress'] = 100.0;
        }

        $this->activityRepository->update($activity, $attributes);
        $activity->refresh();

        // Recalculate parent project overall progress
        $project = $activity->project;
        $projectProgress = $this->progressEngine->calculateProgress($project);
        
        $projectUpdate = [
            'overall_progress' => $projectProgress,
        ];

        if ((float) $projectProgress >= 100.0) {
            $projectUpdate['status'] = 'COMPLETED';
            $projectUpdate['health_status'] = 'ON_TRACK';
        }

        $this->projectRepository->update($project, $projectUpdate);
        $project->refresh();

        // Dispatch background DAG delay propagation job
        ProcessGraphDelayJob::dispatch($activity->id);

        // Immediate recalculation for active HTTP response payload
        $impactedActivities = $this->dependencyService->propagateDelay($activity);
        $this->healthService->calculateHealth($project);

        return [
            'activity' => $activity,
            'project' => $project,
            'calculated_project_progress' => $project->overall_progress,
            'downstream_impact' => $impactedActivities,
        ];
    }

    public function createDependency(int $predecessorId, int $successorId, string $type = 'FS', int $lagDays = 0): ActivityDependency
    {
        $pred = $this->activityRepository->findOrFail($predecessorId);
        $succ = $this->activityRepository->findOrFail($successorId);

        // Cycle Detection check using Kahn's algorithm
        $noCycle = $this->dependencyService->validateNoCycle(
            $pred->project_id,
            $pred->id,
            $succ->id
        );

        if (!$noCycle) {
            throw new InvalidArgumentException('Cannot create dependency: circular dependency graph cycle detected.');
        }

        return $this->activityRepository->createDependency([
            'project_id' => $pred->project_id,
            'predecessor_activity_id' => $pred->id,
            'successor_activity_id' => $succ->id,
            'dependency_type' => $type,
            'lag_days' => $lagDays,
        ]);
    }
}
