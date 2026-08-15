<?php

namespace App\Http\Controllers\Api\v1;

use App\Domain\Health\HealthExplanationService;
use App\Domain\Progress\ProgressCalculationEngine;
use App\Domain\Risks\RiskIssueTransitionService;
use App\Domain\Rules\MonitoringRulesEngine;
use App\Domain\State\ProjectStateEngine;
use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\CorrectiveAction;
use App\Models\Project;
use App\Models\ProjectBaseline;
use App\Models\Risk;
use App\Services\ProjectHealthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MonitoringEngineController extends Controller
{
    private function resolveProject(string $identifier): Project
    {
        return Project::where('uuid', $identifier)
            ->orWhere('code', $identifier)
            ->orWhere('id', $identifier)
            ->first() ?? Project::firstOrFail();
    }

    /**
     * GET /projects/{uuid}/health/explanation
     */
    public function explainHealth(
        string $uuid,
        ProjectHealthService $healthService,
        HealthExplanationService $explanationService
    ): JsonResponse {
        $project = $this->resolveProject($uuid);
        $healthBreakdown = $healthService->calculateHealth($project);
        $explanation = $explanationService->generateExplanation($project, $healthBreakdown);

        return response()->json([
            'status' => 'success',
            'data' => $explanation,
        ]);
    }

    /**
     * GET /projects/{uuid}/alerts
     */
    public function indexAlerts(string $uuid): JsonResponse
    {
        $project = $this->resolveProject($uuid);
        $alerts = Alert::where('project_id', $project->id)->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $alerts,
        ]);
    }

    /**
     * GET /projects/{uuid}/corrective-actions
     */
    public function indexCorrectiveActions(string $uuid): JsonResponse
    {
        $project = $this->resolveProject($uuid);
        $actions = CorrectiveAction::where('project_id', $project->id)->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $actions,
        ]);
    }

    /**
     * POST /projects/{uuid}/baselines
     */
    public function createBaselineSnapshot(string $uuid): JsonResponse
    {
        $project = $this->resolveProject($uuid);

        // Deactivate previous baselines
        ProjectBaseline::where('project_id', $project->id)->update(['is_current' => false]);

        $nextVersion = ProjectBaseline::where('project_id', $project->id)->count() + 1;

        $snapshot = ProjectBaseline::create([
            'project_id' => $project->id,
            'version_number' => $nextVersion,
            'version_label' => "v{$nextVersion}",
            'snapshot_data' => [
                'planned_start_date' => $project->planned_start_date?->toDateString(),
                'planned_end_date' => $project->planned_end_date?->toDateString(),
                'overall_progress' => $project->overall_progress,
                'milestones_count' => $project->milestones()->count(),
                'activities_count' => $project->activities()->count(),
            ],
            'is_current' => true,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Baseline version v{$nextVersion} snapshotted successfully.",
            'data' => $snapshot,
        ], 201);
    }

    /**
     * POST /risks/{id}/materialize
     */
    public function materializeRisk(int $id, Request $request, RiskIssueTransitionService $transitionService): JsonResponse
    {
        $risk = Risk::findOrFail($id);
        $issue = $transitionService->materializeRisk($risk, $request->input('notes'));

        return response()->json([
            'status' => 'success',
            'message' => "Risk '{$risk->title}' materialized into Issue #{$issue->id}.",
            'data' => [
                'risk' => $risk,
                'materialized_issue' => $issue,
            ],
        ]);
    }

    /**
     * POST /monitoring/evaluate/{uuid}
     */
    public function evaluateMonitoring(
        string $uuid,
        ProjectHealthService $healthService,
        ProgressCalculationEngine $progressEngine,
        ProjectStateEngine $stateEngine,
        MonitoringRulesEngine $rulesEngine
    ): JsonResponse {
        $project = $this->resolveProject($uuid);

        // 1. Recalculate Progress using Strategy
        $project->overall_progress = $progressEngine->calculateProgress($project);

        // 2. Recalculate Health Score
        $healthBreakdown = $healthService->calculateHealth($project);
        $healthScore = (float) ($healthBreakdown['overall_health_score'] ?? 100.0);

        // 3. Derive State
        $scheduleVariance = (int) ($project->custom_fields['schedule_variance_days'] ?? 0);
        $project->health_status = $stateEngine->deriveState($project, $healthScore, $scheduleVariance);
        $project->save();

        // 4. Evaluate Dynamic Monitoring Rules
        $alerts = $rulesEngine->evaluateRules($project);

        return response()->json([
            'status' => 'success',
            'message' => 'Full project execution monitoring evaluation completed.',
            'data' => [
                'project_id' => $project->id,
                'calculated_progress' => $project->overall_progress,
                'health_score' => $healthScore,
                'health_status' => $project->health_status,
                'alerts_triggered' => count($alerts),
            ],
        ]);
    }
}
