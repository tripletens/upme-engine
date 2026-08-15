<?php

namespace App\Contracts\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface
{
    public function findById(int $id): ?User;

    public function findByEmail(string $email): ?User;

    public function getByOrganization(int $organizationId): Collection;

    public function findInOrganization(int $organizationId, int $userId): ?User;

    public function create(array $attributes): User;

    public function update(User $user, array $attributes): bool;
}
