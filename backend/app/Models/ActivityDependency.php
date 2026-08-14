<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityDependency extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'predecessor_activity_id',
        'successor_activity_id',
        'dependency_type',
        'lag_days',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function predecessorActivity(): BelongsTo
    {
        return $this->belongsTo(Activity::class, 'predecessor_activity_id');
    }

    public function successorActivity(): BelongsTo
    {
        return $this->belongsTo(Activity::class, 'successor_activity_id');
    }
}
