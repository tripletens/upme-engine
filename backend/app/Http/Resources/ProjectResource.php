<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
            'status' => $this->status,
            'health_status' => $this->health_status,
            'planned_start_date' => $this->planned_start_date?->toDateString(),
            'planned_end_date' => $this->planned_end_date?->toDateString(),
            'actual_start_date' => $this->actual_start_date?->toDateString(),
            'actual_end_date' => $this->actual_end_date?->toDateString(),
            'overall_progress' => (float) $this->overall_progress,
            'milestones' => MilestoneResource::collection($this->whenLoaded('milestones')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
