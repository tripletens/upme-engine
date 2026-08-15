<?php

namespace App\Contracts\Repositories;

use App\Models\Deliverable;
use App\Models\Evidence;
use App\Models\ProjectEvent;

interface DeliverableRepositoryInterface
{
    public function findOrFail(int $id): Deliverable;

    public function createEvidence(array $attributes): Evidence;

    public function recordProjectEvent(int $projectId, string $eventType, array $payload): ProjectEvent;

    public function update(Deliverable $deliverable, array $attributes): bool;
}
