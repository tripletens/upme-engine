<?php

namespace App\Repositories\Eloquent;

use App\Contracts\Repositories\MonitoringRepositoryInterface;
use App\Models\Alert;
use App\Models\CorrectiveAction;
use App\Models\ProjectBaseline;
use App\Models\Risk;
use Illuminate\Database\Eloquent\Collection;

class EloquentMonitoringRepository implements MonitoringRepositoryInterface
{
    public function getAlertsByProject(int $projectId): Collection
    {
        return Alert::where('project_id', $projectId)->orderBy('created_at', 'desc')->get();
    }

    public function getCorrectiveActionsByProject(int $projectId): Collection
    {
        return CorrectiveAction::where('project_id', $projectId)->orderBy('created_at', 'desc')->get();
    }

    public function createBaselineSnapshot(int $projectId, array $data): ProjectBaseline
    {
        return ProjectBaseline::create(array_merge(['project_id' => $projectId], $data));
    }

    public function deactivatePreviousBaselines(int $projectId): int
    {
        return ProjectBaseline::where('project_id', $projectId)->update(['is_current' => false]);
    }

    public function getNextBaselineVersion(int $projectId): int
    {
        return ProjectBaseline::where('project_id', $projectId)->count() + 1;
    }

    public function findRiskById(int $id): Risk
    {
        return Risk::findOrFail($id);
    }
}
