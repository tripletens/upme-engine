<?php

namespace App\Contracts\Services;

use App\Models\Activity;
use App\Models\ActivityDependency;

interface ActivityServiceInterface
{
    public function updateProgress(int $activityId, array $data): array;

    public function createDependency(int $predecessorId, int $successorId, string $type = 'FS', int $lagDays = 0): ActivityDependency;
}
