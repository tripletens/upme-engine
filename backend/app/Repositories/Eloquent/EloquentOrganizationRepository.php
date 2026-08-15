<?php

namespace App\Repositories\Eloquent;

use App\Contracts\Repositories\OrganizationRepositoryInterface;
use App\Models\Organization;

class EloquentOrganizationRepository implements OrganizationRepositoryInterface
{
    public function findById(int $id): ?Organization
    {
        return Organization::find($id);
    }

    public function findByCode(string $code): ?Organization
    {
        return Organization::where('code', $code)->first();
    }

    public function first(): ?Organization
    {
        return Organization::first();
    }

    public function updateSettings(Organization $organization, array $settings): bool
    {
        $organization->settings = $settings;
        return $organization->save();
    }
}
