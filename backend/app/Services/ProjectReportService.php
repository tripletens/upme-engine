<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Activity;
use App\Models\Issue;
use App\Models\Risk;
use Carbon\Carbon;

class ProjectReportService
{
    /**
     * Generate an executive summary report payload for a project.
     */
    public function generateExecutiveReport(Project $project): array
    {
        $milestones = $project->milestones()->with('activities')->get();
        $activities = Activity::where('project_id', $project->id)->get();
        $openIssues = Issue::where('project_id', $project->id)->whereIn('status', ['OPEN', 'IN_PROGRESS'])->get();
        $activeRisks = Risk::where('project_id', $project->id)->where('status', 'IDENTIFIED')->get();

        $completedActivitiesCount = $activities->where('status', 'COMPLETED')->count();
        $blockedActivitiesCount = $activities->where('status', 'BLOCKED')->count();

        return [
            'report_metadata' => [
                'generated_at' => Carbon::now()->toIso8601String(),
                'engine_version' => '1.0.0',
            ],
            'project_summary' => [
                'code' => $project->code,
                'name' => $project->name,
                'health_status' => $project->health_status,
                'overall_progress' => (float) $project->overall_progress,
                'planned_start_date' => $project->planned_start_date?->toDateString(),
                'planned_end_date' => $project->planned_end_date?->toDateString(),
            ],
            'activity_metrics' => [
                'total' => $activities->count(),
                'completed' => $completedActivitiesCount,
                'blocked' => $blockedActivitiesCount,
                'in_progress' => $activities->where('status', 'IN_PROGRESS')->count(),
            ],
            'issues_and_risks' => [
                'open_issues_count' => $openIssues->count(),
                'critical_issues' => $openIssues->where('severity', 'CRITICAL')->values(),
                'active_risks_count' => $activeRisks->count(),
            ],
        ];
    }

    /**
     * Export activity status history to CSV format.
     */
    public function exportActivitiesToCsv(Project $project): string
    {
        $activities = Activity::where('project_id', $project->id)->with('milestone')->get();
        
        $output = "Activity ID,Milestone,Activity Name,Status,Progress %,Planned Start,Planned End,Is Critical Path\n";

        foreach ($activities as $act) {
            $output .= sprintf(
                "%d,\"%s\",\"%s\",%s,%.2f,%s,%s,%s\n",
                $act->id,
                str_replace('"', '""', $act->milestone?->name ?? ''),
                str_replace('"', '""', $act->name),
                $act->status,
                $act->progress,
                $act->planned_start_date?->toDateString() ?? '',
                $act->planned_end_date?->toDateString() ?? '',
                $act->is_critical_path ? 'YES' : 'NO'
            );
        }

        return $output;
    }
}
