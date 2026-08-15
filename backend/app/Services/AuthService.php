<?php

namespace App\Services;

use App\Contracts\Repositories\UserRepositoryInterface;
use App\Contracts\Services\AuthServiceInterface;
use Illuminate\Support\Facades\Hash;
use InvalidArgumentException;

class AuthService implements AuthServiceInterface
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private PermissionService $permissionService
    ) {}

    public function authenticate(string $email, string $password): array
    {
        $user = $this->userRepository->findByEmail($email);

        if (!$user || !Hash::check($password, $user->password)) {
            throw new InvalidArgumentException('Invalid email or password credentials.');
        }

        $organization = $user->organization;
        $permissions = $this->permissionService->getUserPermissions($user, $organization->id);

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'api_token' => $user->api_token,
            ],
            'organization' => [
                'id' => $organization->id,
                'code' => $organization->code,
                'name' => $organization->name,
                'kyc_status' => $organization->settings['kyc_status'] ?? 'UNVERIFIED',
                'subscription_tier' => $organization->settings['subscription_tier'] ?? 'STARTER',
            ],
            'permissions' => $permissions,
        ];
    }
}
