<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Cache;

class PermissionService
{
    private array $rolePermissions = [
        'ADMIN' => [
            'org:manage', 'user:invite', 'kyc:submit', 'kyc:review',
            'project:create', 'project:edit', 'project:delete', 'project:view',
            'activity:assign', 'progress:update', 'evidence:upload', 'evidence:approve',
            'budget:view', 'budget:update', 'report:view', 'report:export'
        ],
        'ORGANIZATION_ADMIN' => [
            'org:manage', 'user:invite', 'kyc:submit',
            'project:create', 'project:edit', 'project:view',
            'activity:assign', 'progress:update', 'evidence:upload', 'evidence:approve',
            'budget:view', 'report:view', 'report:export'
        ],
        'PROJECT_MANAGER' => [
            'project:create', 'project:edit', 'project:view',
            'activity:assign', 'progress:update', 'evidence:upload', 'evidence:approve',
            'budget:view', 'report:view', 'report:export'
        ],
        'SUPERVISOR' => [
            'project:view', 'progress:update', 'evidence:upload', 'evidence:approve', 'report:view'
        ],
        'CONTRACTOR' => [
            'project:view', 'progress:update', 'evidence:upload'
        ]
    ];

    /**
     * Fetch user's active permissions for a specific organization.
     */
    public function getUserPermissions(User $user, int $organizationId): array
    {
        if ($user->organization_id !== $organizationId && $user->role !== 'ADMIN') {
            return [];
        }

        return $this->rolePermissions[$user->role] ?? $this->rolePermissions['CONTRACTOR'];
    }

    /**
     * Check if a user possesses a specific permission.
     */
    public function hasPermission(User $user, int $organizationId, string $permissionCode): bool
    {
        $permissions = $this->getUserPermissions($user, $organizationId);
        return in_array($permissionCode, $permissions);
    }
}
