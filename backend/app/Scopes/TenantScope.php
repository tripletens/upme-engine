<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class TenantScope implements Scope
{
    /**
     * Apply the tenant global scope to an Eloquent builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        if (app()->bound('current_tenant')) {
            $tenant = app('current_tenant');
            $builder->where($model->getTable() . '.organization_id', $tenant->id);
        }
    }
}
