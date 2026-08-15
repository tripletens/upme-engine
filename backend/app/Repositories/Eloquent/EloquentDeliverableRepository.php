<?php

namespace App\Repositories\Eloquent;

use App\Contracts\Repositories\DeliverableRepositoryInterface;
use App\Models\Deliverable;
use App\Models\Evidence;
use App\Models\ProjectEvent;

class EloquentDeliverableRepository implements DeliverableRepositoryInterface
{
    public function findOrFail(int $id): Deliverable
    {
        return Deliverable::findOrFail($id);
    }

    public function createEvidence(array $attributes): Evidence
    {
        return Evidence::create($attributes);
    }

    public function recordProjectEvent(int $projectId, string $eventType, array $payload): ProjectEvent
    {
        return ProjectEvent::create([
            'project_id' => $projectId,
            'event_type' => $eventType,
            'payload' => $payload,
        ]);
    }

    public function update(Deliverable $deliverable, array $attributes): bool
    {
        return $deliverable->update($attributes);
    }
}
