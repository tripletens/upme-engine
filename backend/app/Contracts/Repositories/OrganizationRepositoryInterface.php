<?php

namespace App\Contracts\Repositories;

use App\Models\Organization;

interface OrganizationRepositoryInterface
{
    public function findById(int $id): ?Organization;

    public function findByCode(string $code): ?Organization;

    public function first(): ?Organization;

    public function updateSettings(Organization $organization, array $settings): bool;
}
