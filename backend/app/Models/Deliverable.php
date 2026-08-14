<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Deliverable extends Model
{
    use HasFactory;

    protected $fillable = [
        'activity_id',
        'title',
        'requires_evidence',
        'status',
    ];

    protected $casts = [
        'requires_evidence' => 'boolean',
    ];

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }
}
