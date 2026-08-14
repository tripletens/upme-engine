<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Activity;
use App\Models\Issue;
use App\Models\Risk;
use App\Models\Deliverable;
use Carbon\Carbon;

/**
 * ProjectHealthService
 * 
 * Deterministic engine for evaluating multi-dimensional project health scores (0 - 100)
 * and classifying status into ON_TRACK, WARNING, AT_RISK, or CRITICAL.
 */
class ProjectHealthService
{
    private float $weightSchedule = 0.30;
    private float $weightProgress = 0.25;
    private float $weightIssue = 0.20;
    private float $weightRisk = 0.15;
    private float $weightDeliverable = 0.10;

    /**
     * Calculate comprehensive health breakdown for a project.
     *
     * @param Project $project
     * @return array Health metrics breakdown and overall score
     */
    public function calculateHealth(Project $project): array
    {
        $scheduleScore = $this->calculateScheduleScore($project);
        $progressScore = $this->calculateProgressScore($project);
        $issueScore = $this->calculateIssueScore($project);
        $riskScore = $this->calculateRiskScore($project);
        $deliverableScore = $this->calculateDeliverableScore($project);

        $overallScore = round(
            ($scheduleScore * $this->weightSchedule) +
            ($progressScore * $this->weightProgress) +
            ($issueScore * $this->weightIssue) +
            ($riskScore * $this->weightRisk) +
            ($deliverableScore * $this->weightDeliverable),
            1
        );

        $status = match (true) {
            $overallScore >= 90.0 => 'ON_TRACK',
            $overallScore >= 75.0 => 'WARNING',
            $overallScore >= 50.0 => 'AT_RISK',
            default => 'CRITICAL',
        };

        // Update project model state
        $project->health_status = $status;
        $project->save();

        return [
            'overall_score' => $overallScore,
            'health_status' => $status,
            'dimensions' => [
                'schedule' => ['score' => $scheduleScore, 'weight' => $this->weightSchedule],
                'progress' => ['score' => $progressScore, 'weight' => $this->weightProgress],
                'issues' => ['score' => $issueScore, 'weight' => $this->weightIssue],
                'risks' => ['score' => $riskScore, 'weight' => $this->weightRisk],
                'deliverables' => ['score' => $deliverableScore, 'weight' => $this->weightDeliverable],
            ],
            'calculated_at' => Carbon::now()->toIso8601String(),
        ];
    }

    private function calculateScheduleScore(Project $project): float
    {
        $today = Carbon::now();
        $activities = Activity::where('project_id', $project->id)->get();
        if ($activities->isEmpty()) return 100.0;

        $overdueCount = 0;
        foreach ($activities as $act) {
            if ($act->status !== 'COMPLETED') {
                $plannedEnd = Carbon::parse($act->planned_end_date);
                if ($today->greaterThan($plannedEnd)) {
                    $overdueCount++;
                }
            }
        }

        $overdueRatio = $overdueCount / $activities->count();
        return max(0.0, round((1.0 - $overdueRatio) * 100, 1));
    }

    private function calculateProgressScore(Project $project): float
    {
        return (float) min(100.0, max(0.0, $project->overall_progress));
    }

    private function calculateIssueScore(Project $project): float
    {
        $openIssues = Issue::where('project_id', $project->id)
            ->whereIn('status', ['OPEN', 'IN_PROGRESS'])
            ->get();

        $penalty = 0;
        foreach ($openIssues as $issue) {
            $penalty += match ($issue->severity) {
                'CRITICAL' => 25,
                'HIGH' => 15,
                'MEDIUM' => 8,
                'LOW' => 3,
                default => 0,
            };
        }

        return max(0.0, (float)(100 - $penalty));
    }

    private function calculateRiskScore(Project $project): float
    {
        $activeRisks = Risk::where('project_id', $project->id)
            ->where('status', 'IDENTIFIED')
            ->get();

        $penalty = 0;
        foreach ($activeRisks as $risk) {
            $penalty += ($risk->severity_score ?? 10);
        }

        return max(0.0, (float)(100 - $penalty));
    }

    private function calculateDeliverableScore(Project $project): float
    {
        $deliverables = Deliverable::whereHas('activity', function ($q) use ($project) {
            $q->where('project_id', $project->id);
        })->get();

        if ($deliverables->isEmpty()) return 100.0;

        $approvedCount = $deliverables->where('status', 'APPROVED')->count();
        return round(($approvedCount / $deliverables->count()) * 100, 1);
    }
}
