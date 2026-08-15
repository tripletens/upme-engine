<?php

namespace App\Contracts\Repositories;

use App\Models\Activity;
use App\Models\ActivityDependency;

interface ActivityRepositoryInterface
{
    public function findById(int $id): ?Activity;

    public function findOrFail(int $id): Activity;

    public function update(Activity $activity, array $attributes): bool;

    public function createDependency(array $attributes): ActivityDependency;
}
