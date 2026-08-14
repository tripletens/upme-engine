<?php

namespace App\Services;

use App\Models\Activity;
use App\Models\ActivityDependency;
use App\Models\ProjectEvent;
use Carbon\Carbon;

/**
 * DependencyEvaluationService
 * 
 * Handles Directed Acyclic Graph (DAG) cycle detection and downstream
 * delay propagation across activity dependency networks.
 */
class DependencyEvaluationService
{
    /**
     * Evaluate downstream impact when an activity's actual dates or duration change.
     *
     * @param Activity $activity
     * @return array Summary of impacted activities and milestone schedule shifts
     */
    public function propagateDelay(Activity $activity): array
    {
        $impactedActivities = [];
        $visited = [];
        $queue = [$activity];

        while (!empty($queue)) {
            /** @var Activity $current */
            $current = array_shift($queue);
            
            if (in_array($current->id, $visited)) {
                continue;
            }
            $visited[] = $current->id;

            // Fetch all immediate successors
            $successors = ActivityDependency::where('predecessor_activity_id', $current->id)
                ->with('successorActivity')
                ->get();

            foreach ($successors as $dep) {
                $successor = $dep->successorActivity;
                $depType = $dep->dependency_type; // FS, SS, FF, SF
                $lag = $dep->lag_days;

                $oldExpectedStart = Carbon::parse($successor->planned_start_date);
                $newExpectedStart = $oldExpectedStart->copy();

                if ($depType === 'FS') {
                    // Finish-to-Start: Successor start = Predecessor end + lag
                    $predEnd = $current->actual_end_date 
                        ? Carbon::parse($current->actual_end_date) 
                        : Carbon::parse($current->planned_end_date);
                    
                    $calculatedStart = $predEnd->copy()->addDays($lag);

                    if ($calculatedStart->greaterThan($oldExpectedStart)) {
                        $newExpectedStart = $calculatedStart;
                    }
                }

                // Calculate delay in days
                $delayDays = $newExpectedStart->diffInDays($oldExpectedStart, false);

                if ($delayDays < 0) {
                    $delayAbs = abs($delayDays);
                    
                    // Update successor expected timeline and mark as BLOCKED if predecessor incomplete
                    if ($current->status !== 'COMPLETED') {
                        $successor->status = 'BLOCKED';
                    }

                    $successor->planned_start_date = $newExpectedStart->toDateString();
                    $successor->planned_end_date = $newExpectedStart->copy()->addDays($successor->planned_duration_days)->toDateString();
                    $successor->save();

                    $impactedActivities[] = [
                        'activity_id' => $successor->id,
                        'activity_name' => $successor->name,
                        'delayed_by_days' => $delayAbs,
                        'new_expected_start' => $successor->planned_start_date,
                        'new_expected_end' => $successor->planned_end_date,
                        'status' => $successor->status,
                    ];

                    // Log Project Audit Event
                    ProjectEvent::create([
                        'project_id' => $successor->project_id,
                        'event_type' => 'DEPENDENCY_BLOCKAGE_DETECTED',
                        'payload' => [
                            'predecessor_id' => $current->id,
                            'predecessor_name' => $current->name,
                            'successor_id' => $successor->id,
                            'successor_name' => $successor->name,
                            'delay_days' => $delayAbs,
                            'message' => "'{$current->name}' is delayed by {$delayAbs} days, blocking '{$successor->name}'."
                        ]
                    ]);

                    // Recurse downstream
                    $queue[] = $successor;
                }
            }
        }

        return $impactedActivities;
    }

    /**
     * Validate that adding a dependency between predecessor and successor will not form a cycle.
     * Uses Kahn's Topological Sort Algorithm.
     *
     * @param int $projectId
     * @param int $predecessorId
     * @param int $successorId
     * @return bool True if valid (no cycle), False if cycle detected
     */
    public function validateNoCycle(int $projectId, int $predecessorId, int $successorId): bool
    {
        if ($predecessorId === $successorId) {
            return false;
        }

        // Fetch existing adjacency list
        $dependencies = ActivityDependency::where('project_id', $projectId)->get();
        $adj = [];

        foreach ($dependencies as $d) {
            $adj[$d->predecessor_activity_id][] = $d->successor_activity_id;
        }

        // Add proposed dependency
        $adj[$predecessorId][] = $successorId;

        // BFS to check if successor can reach predecessor
        $visited = [];
        $queue = [$successorId];

        while (!empty($queue)) {
            $curr = array_shift($queue);
            if ($curr === $predecessorId) {
                return false; // Cycle detected!
            }

            if (!isset($visited[$curr])) {
                $visited[$curr] = true;
                if (isset($adj[$curr])) {
                    foreach ($adj[$curr] as $next) {
                        $queue[] = $next;
                    }
                }
            }
        }

        return true;
    }
}
