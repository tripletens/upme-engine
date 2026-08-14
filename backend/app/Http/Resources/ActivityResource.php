<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'milestone_id' => $this->milestone_id,
            'name' => $this->name,
            'description' => $this->description,
            'status' => $this->status,
            'planned_start_date' => $this->planned_start_date?->toDateString(),
            'planned_end_date' => $this->planned_end_date?->toDateString(),
            'actual_start_date' => $this->actual_start_date?->toDateString(),
            'actual_end_date' => $this->actual_end_date?->toDateString(),
            'planned_duration_days' => $this->planned_duration_days,
            'progress' => (float) $this->progress,
            'is_critical_path' => (bool) $this->is_critical_path,
            'checklist' => $this->checklist,
        ];
    }
}
