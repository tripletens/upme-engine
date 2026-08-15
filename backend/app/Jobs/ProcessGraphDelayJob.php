<?php

namespace App\Jobs;

use App\Models\Activity;
use App\Services\DependencyEvaluationService;
use App\Services\ProjectHealthService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessGraphDelayJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 5;

    public function __construct(public int $activityId, public int $delayDays = 0) {}

    /**
     * Execute background DAG delay propagation and health score recalculation.
     */
    public function handle(DependencyEvaluationService $dependencyService, ProjectHealthService $healthService): void
    {
        $activity = Activity::find($this->activityId);
        if (!$activity) {
            Log::warning("ProcessGraphDelayJob failed: Activity #{$this->activityId} not found.");
            return;
        }

        Log::info("Processing asynchronous DAG delay propagation for Activity #{$activity->id} ('{$activity->name}').");

        // 1. Evaluate downstream DAG delay propagation
        $dependencyService->propagateDelay($activity, $this->delayDays);

        // 2. Recalculate composite project health score
        $healthService->calculateHealth($activity->project);

        Log::info("ProcessGraphDelayJob completed successfully for Project #{$activity->project_id}.");
    }
}
