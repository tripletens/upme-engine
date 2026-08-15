<?php

namespace App\Services;

use App\Contracts\Repositories\OrganizationRepositoryInterface;
use App\Contracts\Repositories\UserRepositoryInterface;
use App\Contracts\Services\OrganizationServiceInterface;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use InvalidArgumentException;

class OrganizationService implements OrganizationServiceInterface
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private OrganizationRepositoryInterface $organizationRepository,
        private PermissionService $permissionService
    ) {}

    public function getUsers(Organization $organization): array
    {
        $users = $this->userRepository->getByOrganization($organization->id);

        return $users->map(function ($u) use ($organization) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role,
                'permissions' => $this->permissionService->getUserPermissions($u, $organization->id),
                'created_at' => $u->created_at?->toIso8601String(),
            ];
        })->toArray();
    }

    public function updatePermissions(Organization $organization, int $userId, array $permissions): User
    {
        $user = $this->userRepository->findInOrganization($organization->id, $userId);

        if (!$user) {
            $user = $this->userRepository->findById($userId);
        }

        if (!$user) {
            throw new InvalidArgumentException("User with ID {$userId} not found.");
        }

        $this->permissionService->setUserPermissions($user, $organization->id, $permissions);

        return $user;
    }

    public function inviteUser(Organization $organization, array $userData): array
    {
        $user = $this->userRepository->create([
            'organization_id' => $organization->id,
            'name' => $userData['name'],
            'email' => $userData['email'],
            'password' => Hash::make('Password123!'),
            'role' => $userData['role'],
            'api_token' => 'upme_token_' . Str::random(20),
        ]);

        $permissions = $this->permissionService->getUserPermissions($user, $organization->id);

        return [
            'user' => $user,
            'permissions' => $permissions,
            'default_password' => 'Password123!',
        ];
    }

    public function getApiKey(Organization $organization, string $userRole): string
    {
        if (!in_array($userRole, ['ADMIN', 'ORGANIZATION_ADMIN'])) {
            throw new InvalidArgumentException('Unauthorized. Company API Keys are strictly visible only to Company Creator & Organization Admins.');
        }

        return "upme_live_sec_" . strtolower($organization->code) . "_" . substr(md5($organization->id . 'upme_secret_salt'), 0, 16);
    }

    public function regenerateApiKey(Organization $organization, string $userRole): string
    {
        if (!in_array($userRole, ['ADMIN', 'ORGANIZATION_ADMIN'])) {
            throw new InvalidArgumentException('Unauthorized. Only Company Creator & Organization Admins can regenerate API Keys.');
        }

        return "upme_live_sec_" . strtolower($organization->code) . "_" . Str::random(16);
    }
}
