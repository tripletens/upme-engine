<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Issue extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'risk_id',
        'title',
        'severity',
        'description',
        'resolution',
        'status',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function risk(): BelongsTo
    {
        return $this->belongsTo(Risk::class);
    }
}
