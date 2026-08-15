<?php

namespace App\Domain\Progress;

use App\Models\Activity;
use App\Models\Deliverable;
use App\Models\Project;

class ProgressCalculationEngine
{
    /**
     * Calculate project overall progress based on strategy.
     */
    public function calculateProgress(Project $project): float
    {
        $strategy = $project->progress_strategy ?? 'WEIGHTED_ACTIVITY_PROGRESS';

        return match ($strategy) {
            'WEIGHTED_ACTIVITY_PROGRESS' => $this->calculateWeightedActivityProgress($project),
            'DELIVERABLE_PROGRESS' => $this->calculateDeliverableProgress($project),
            'MILESTONE_PROGRESS' => $this->calculateMilestoneProgress($project),
            'MANUAL_PROGRESS' => (float) $project->overall_progress,
            default => $this->calculateWeightedActivityProgress($project),
        };
    }

    /**
     * Weighted Activity Strategy: Sum(progress * weight) / Sum(weight)
     */
    private function calculateWeightedActivityProgress(Project $project): float
    {
        $activities = Activity::where('project_id', $project->id)->get();
        if ($activities->isEmpty()) {
            return 0.0;
        }

        $totalWeight = $activities->sum('weight');
        if ($totalWeight <= 0) {
            return (float) round($activities->avg('progress'), 2);
        }

        $weightedProgressSum = 0.0;
        foreach ($activities as $act) {
            $weightedProgressSum += ($act->progress * $act->weight);
        }

        return (float) round($weightedProgressSum / $totalWeight, 2);
    }

    /**
     * Deliverable Progress Strategy
     */
    private function calculateDeliverableProgress(Project $project): float
    {
        $deliverables = Deliverable::whereHas('activity', function ($query) use ($project) {
            $query->where('project_id', $project->id);
        })->get();

        if ($deliverables->isEmpty()) {
            return $this->calculateWeightedActivityProgress($project);
        }

        $approvedCount = $deliverables->where('status', 'APPROVED')->count();
        return (float) round(($approvedCount / $deliverables->count()) * 100, 2);
    }

    /**
     * Milestone Progress Strategy
     */
    private function calculateMilestoneProgress(Project $project): float
    {
        $milestones = $project->milestones;
        if ($milestones->isEmpty()) {
            return 0.0;
        }

        return (float) round($milestones->avg('progress'), 2);
    }
}
