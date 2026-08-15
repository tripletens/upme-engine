<?php

namespace App\Contracts\Repositories;

use App\Models\Alert;
use App\Models\CorrectiveAction;
use App\Models\ProjectBaseline;
use App\Models\Risk;
use Illuminate\Database\Eloquent\Collection;

interface MonitoringRepositoryInterface
{
    public function getAlertsByProject(int $projectId): Collection;

    public function getCorrectiveActionsByProject(int $projectId): Collection;

    public function createBaselineSnapshot(int $projectId, array $data): ProjectBaseline;

    public function deactivatePreviousBaselines(int $projectId): int;

    public function getNextBaselineVersion(int $projectId): int;

    public function findRiskById(int $id): Risk;
}
