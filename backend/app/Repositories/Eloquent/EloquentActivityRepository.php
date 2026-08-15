<?php

namespace App\Repositories\Eloquent;

use App\Contracts\Repositories\ActivityRepositoryInterface;
use App\Models\Activity;
use App\Models\ActivityDependency;

class EloquentActivityRepository implements ActivityRepositoryInterface
{
    public function findById(int $id): ?Activity
    {
        return Activity::find($id);
    }

    public function findOrFail(int $id): Activity
    {
        return Activity::findOrFail($id);
    }

    public function update(Activity $activity, array $attributes): bool
    {
        return $activity->update($attributes);
    }

    public function createDependency(array $attributes): ActivityDependency
    {
        return ActivityDependency::create($attributes);
    }
}
