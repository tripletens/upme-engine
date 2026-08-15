<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectSnapshot extends Model
{
    protected $fillable = [
        'project_id',
        'health_score',
        'progress',
        'schedule_variance_days',
        'open_issues_count',
        'active_risks_count',
        'snapshot_date',
    ];

    protected $casts = [
        'health_score' => 'float',
        'progress' => 'float',
        'snapshot_date' => 'date',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
