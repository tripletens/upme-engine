<?php

namespace App\Domain\State;

use App\Models\Project;

class ProjectStateEngine
{
    /**
     * Determine system-controlled project status based on metrics & rules.
     */
    public function deriveState(Project $project, float $healthScore, int $scheduleVarianceDays): string
    {
        // Manual override states are preserved
        if (in_array($project->status, ['ON_HOLD', 'CANCELLED'])) {
            return $project->status;
        }

        if ($project->overall_progress >= 100.0) {
            return 'COMPLETED';
        }

        if ($project->overall_progress == 0.0) {
            return 'NOT_STARTED';
        }

        // Composite Health & Schedule Evaluation
        if ($healthScore >= 90.0 && $scheduleVarianceDays <= 0) {
            return 'ON_TRACK';
        }

        if ($healthScore >= 75.0 && $scheduleVarianceDays <= 3) {
            return 'WARNING';
        }

        if ($healthScore >= 50.0 || $scheduleVarianceDays <= 10) {
            return 'AT_RISK';
        }

        return 'CRITICAL';
    }
}
