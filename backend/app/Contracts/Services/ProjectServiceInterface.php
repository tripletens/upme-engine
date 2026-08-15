<?php

namespace App\Contracts\Services;

use App\Models\Project;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProjectServiceInterface
{
    public function listProjects(int $perPage = 15): LengthAwarePaginator;

    public function createProject(array $data, ?int $organizationId): Project;

    public function getProjectByUuid(string $uuid): Project;

    public function getProjectHealth(string $uuid): array;
}
