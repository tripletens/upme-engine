<?php

namespace App\Contracts\Services;

use App\Models\ProjectBaseline;
use Illuminate\Database\Eloquent\Collection;

interface MonitoringEngineServiceInterface
{
    public function explainHealth(string $projectIdentifier): array;

    public function getAlerts(string $projectIdentifier): Collection;

    public function getCorrectiveActions(string $projectIdentifier): Collection;

    public function createBaselineSnapshot(string $projectIdentifier): ProjectBaseline;

    public function materializeRisk(int $riskId, ?string $notes = null): array;

    public function evaluateMonitoring(string $projectIdentifier): array;
}
