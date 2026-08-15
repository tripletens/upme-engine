<?php

namespace App\Domain\Health;

use App\Models\Activity;
use App\Models\Issue;
use App\Models\Project;
use App\Models\Risk;

class HealthExplanationService
{
    /**
     * Generate structured human-readable & JSON health explanation.
     */
    public function generateExplanation(Project $project, array $healthBreakdown): array
    {
        $contributors = [];

        $scheduleVarianceDays = (int) ($project->custom_fields['schedule_variance_days'] ?? 0);
        if ($scheduleVarianceDays > 0) {
            $contributors[] = [
                'type' => 'SCHEDULE_VARIANCE',
                'severity' => $scheduleVarianceDays > 7 ? 'HIGH' : 'MEDIUM',
                'message' => "Schedule variance lag of {$scheduleVarianceDays} days detected against baseline.",
            ];
        }

        $blockedCount = Activity::where('project_id', $project->id)->where('status', 'BLOCKED')->count();
        if ($blockedCount > 0) {
            $contributors[] = [
                'type' => 'BLOCKED_DEPENDENCIES',
                'severity' => 'HIGH',
                'message' => "{$blockedCount} activity(ies) are currently BLOCKED by predecessor delays.",
            ];
        }

        $openIssuesCount = Issue::where('project_id', $project->id)->whereIn('status', ['OPEN', 'IN_PROGRESS'])->count();
        if ($openIssuesCount > 0) {
            $contributors[] = [
                'type' => 'UNRESOLVED_ISSUES',
                'severity' => 'HIGH',
                'message' => "{$openIssuesCount} active open issue(s) require management resolution.",
            ];
        }

        $activeRisksCount = Risk::where('project_id', $project->id)->whereIn('status', ['IDENTIFIED', 'MONITORING'])->count();
        if ($activeRisksCount > 0) {
            $contributors[] = [
                'type' => 'ACTIVE_RISKS',
                'severity' => 'MEDIUM',
                'message' => "{$activeRisksCount} unmitigated risk(s) registered on risk log.",
            ];
        }

        if (empty($contributors)) {
            $contributors[] = [
                'type' => 'OPTIMAL_PERFORMANCE',
                'severity' => 'INFO',
                'message' => 'Project execution is running optimal with zero active blockages or schedule variance.',
            ];
        }

        return [
            'overall_health_score' => $healthBreakdown['overall_health_score'] ?? $project->overall_progress,
            'health_status' => $project->health_status,
            'primary_contributors' => $contributors,
            'dimension_subscores' => $healthBreakdown['breakdown'] ?? [],
        ];
    }
}
