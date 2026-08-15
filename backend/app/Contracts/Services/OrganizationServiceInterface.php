<?php

namespace App\Contracts\Services;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface OrganizationServiceInterface
{
    public function getUsers(Organization $organization): array;

    public function updatePermissions(Organization $organization, int $userId, array $permissions): User;

    public function inviteUser(Organization $organization, array $userData): array;

    public function getApiKey(Organization $organization, string $userRole): string;

    public function regenerateApiKey(Organization $organization, string $userRole): string;
}
