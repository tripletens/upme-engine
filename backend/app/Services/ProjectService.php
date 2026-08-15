<?php

namespace App\Services;

use App\Contracts\Repositories\ProjectRepositoryInterface;
use App\Contracts\Services\ProjectServiceInterface;
use App\Models\Project;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class ProjectService implements ProjectServiceInterface
{
    public function __construct(
        private ProjectRepositoryInterface $projectRepository,
        private ProjectHealthService $healthService
    ) {}

    public function listProjects(int $perPage = 15): LengthAwarePaginator
    {
        return $this->projectRepository->paginate($perPage, ['milestones.activities']);
    }

    public function createProject(array $data, ?int $organizationId): Project
    {
        return $this->projectRepository->create([
            'organization_id' => $organizationId ?? 1,
            'uuid' => (string) Str::uuid(),
            'code' => $data['code'],
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'planned_start_date' => $data['planned_start_date'] ?? null,
            'planned_end_date' => $data['planned_end_date'] ?? null,
            'status' => 'PLANNING',
            'health_status' => 'ON_TRACK',
            'overall_progress' => 0.0,
        ]);
    }

    public function getProjectByUuid(string $uuid): Project
    {
        $project = $this->projectRepository->findByUuid($uuid, ['milestones.activities', 'risks', 'issues']);
        if (!$project) {
            return $this->projectRepository->findByIdentifier($uuid, ['milestones.activities', 'risks', 'issues']);
        }
        return $project;
    }

    public function getProjectHealth(string $uuid): array
    {
        $project = $this->getProjectByUuid($uuid);
        return $this->healthService->calculateHealth($project);
    }
}
