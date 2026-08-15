<?php

namespace App\Contracts\Repositories;

use App\Models\Project;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProjectRepositoryInterface
{
    public function findById(int $id): ?Project;

    public function findByUuid(string $uuid, array $with = []): ?Project;

    public function findByIdentifier(string $identifier, array $with = []): Project;

    public function paginate(int $perPage = 15, array $with = []): LengthAwarePaginator;

    public function create(array $attributes): Project;

    public function update(Project $project, array $attributes): bool;
}
