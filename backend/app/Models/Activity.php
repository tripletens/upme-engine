<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'milestone_id',
        'name',
        'description',
        'status',
        'planned_start_date',
        'planned_end_date',
        'actual_start_date',
        'actual_end_date',
        'planned_duration_days',
        'actual_duration_days',
        'progress',
        'is_critical_path',
        'assigned_to_user_id',
        'checklist',
    ];

    protected $casts = [
        'planned_start_date' => 'date',
        'planned_end_date' => 'date',
        'actual_start_date' => 'date',
        'actual_end_date' => 'date',
        'progress' => 'float',
        'is_critical_path' => 'boolean',
        'checklist' => 'array',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function milestone(): BelongsTo
    {
        return $this->belongsTo(Milestone::class);
    }

    public function predecessors(): HasMany
    {
        return $this->hasMany(ActivityDependency::class, 'successor_activity_id');
    }

    public function successors(): HasMany
    {
        return $this->hasMany(ActivityDependency::class, 'predecessor_activity_id');
    }

    public function deliverables(): HasMany
    {
        return $this->hasMany(Deliverable::class);
    }
}
