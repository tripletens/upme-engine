<?php

namespace App\Services;

use App\Contracts\Repositories\MonitoringRepositoryInterface;
use App\Contracts\Repositories\ProjectRepositoryInterface;
use App\Contracts\Services\MonitoringEngineServiceInterface;
use App\Domain\Health\HealthExplanationService;
use App\Domain\Progress\ProgressCalculationEngine;
use App\Domain\Risks\RiskIssueTransitionService;
use App\Domain\Rules\MonitoringRulesEngine;
use App\Domain\State\ProjectStateEngine;
use App\Models\ProjectBaseline;
use Illuminate\Database\Eloquent\Collection;

class MonitoringEngineService implements MonitoringEngineServiceInterface
{
    public function __construct(
        private ProjectRepositoryInterface $projectRepository,
        private MonitoringRepositoryInterface $monitoringRepository,
        private ProjectHealthService $healthService,
        private HealthExplanationService $explanationService,
        private ProgressCalculationEngine $progressEngine,
        private ProjectStateEngine $stateEngine,
        private MonitoringRulesEngine $rulesEngine,
        private RiskIssueTransitionService $transitionService
    ) {}

    public function explainHealth(string $projectIdentifier): array
    {
        $project = $this->projectRepository->findByIdentifier($projectIdentifier);
        $healthBreakdown = $this->healthService->calculateHealth($project);
        return $this->explanationService->generateExplanation($project, $healthBreakdown);
    }

    public function getAlerts(string $projectIdentifier): Collection
    {
        $project = $this->projectRepository->findByIdentifier($projectIdentifier);
        return $this->monitoringRepository->getAlertsByProject($project->id);
    }

    public function getCorrectiveActions(string $projectIdentifier): Collection
    {
        $project = $this->projectRepository->findByIdentifier($projectIdentifier);
        return $this->monitoringRepository->getCorrectiveActionsByProject($project->id);
    }

    public function createBaselineSnapshot(string $projectIdentifier): ProjectBaseline
    {
        $project = $this->projectRepository->findByIdentifier($projectIdentifier);

        // Deactivate previous baselines
        $this->monitoringRepository->deactivatePreviousBaselines($project->id);

        $nextVersion = $this->monitoringRepository->getNextBaselineVersion($project->id);

        return $this->monitoringRepository->createBaselineSnapshot($project->id, [
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
    }

    public function materializeRisk(int $riskId, ?string $notes = null): array
    {
        $risk = $this->monitoringRepository->findRiskById($riskId);
        $issue = $this->transitionService->materializeRisk($risk, $notes);

        return [
            'risk' => $risk,
            'materialized_issue' => $issue,
        ];
    }

    public function evaluateMonitoring(string $projectIdentifier): array
    {
        $project = $this->projectRepository->findByIdentifier($projectIdentifier);

        // 1. Recalculate Progress using Strategy
        $progress = $this->progressEngine->calculateProgress($project);

        // 2. Recalculate Health Score
        $healthBreakdown = $this->healthService->calculateHealth($project);
        $healthScore = (float) ($healthBreakdown['overall_health_score'] ?? 100.0);

        // 3. Derive State
        $scheduleVariance = (int) ($project->custom_fields['schedule_variance_days'] ?? 0);
        $healthStatus = $this->stateEngine->deriveState($project, $healthScore, $scheduleVariance);

        $this->projectRepository->update($project, [
            'overall_progress' => $progress,
            'health_status' => $healthStatus,
        ]);
        $project->refresh();

        // 4. Evaluate Dynamic Monitoring Rules
        $alerts = $this->rulesEngine->evaluateRules($project);

        return [
            'project_id' => $project->id,
            'calculated_progress' => $project->overall_progress,
            'health_score' => $healthScore,
            'health_status' => $project->health_status,
            'alerts_triggered' => count($alerts),
        ];
    }
}
