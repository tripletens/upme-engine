<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectBaseline extends Model
{
    protected $fillable = [
        'project_id',
        'version_number',
        'version_label',
        'snapshot_data',
        'is_current',
    ];

    protected $casts = [
        'snapshot_data' => 'array',
        'is_current' => 'boolean',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
