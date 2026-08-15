<?php

namespace App\Repositories\Eloquent;

use App\Contracts\Repositories\ProjectRepositoryInterface;
use App\Models\Project;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentProjectRepository implements ProjectRepositoryInterface
{
    public function findById(int $id): ?Project
    {
        return Project::find($id);
    }

    public function findByUuid(string $uuid, array $with = []): ?Project
    {
        return Project::with($with)->where('uuid', $uuid)->first();
    }

    public function findByIdentifier(string $identifier, array $with = []): Project
    {
        return Project::with($with)
            ->where('uuid', $identifier)
            ->orWhere('code', $identifier)
            ->orWhere('id', $identifier)
            ->first() ?? Project::with($with)->firstOrFail();
    }

    public function paginate(int $perPage = 15, array $with = ['milestones.activities']): LengthAwarePaginator
    {
        return Project::with($with)->latest('created_at')->paginate($perPage);
    }

    public function create(array $attributes): Project
    {
        return Project::create($attributes);
    }

    public function update(Project $project, array $attributes): bool
    {
        return $project->update($attributes);
    }
}
