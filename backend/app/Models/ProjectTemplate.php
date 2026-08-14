<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'uuid',
        'name',
        'category',
        'description',
        'template_data',
        'is_global',
    ];

    protected $casts = [
        'template_data' => 'array',
        'is_global' => 'boolean',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
