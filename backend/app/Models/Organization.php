<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'name',
        'code',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
    ];

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
