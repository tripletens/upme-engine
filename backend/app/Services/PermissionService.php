<?php

namespace App\Services;

use App\Models\User;
use App\Models\Organization;
use App\Models\Role;
use Illuminate\Support\Facades\Cache;

/**
 * PermissionService
 * 
 * Implements Option B: Query Database / Redis per request with 
 * fast Redis caching and instant cache invalidation upon role updates.
 */
class PermissionService
{
    private int $cacheTtlSeconds = 3600; // 1 hour TTL

    /**
     * Fetch user's active permissions for a specific organization.
     */
    public function getUserPermissions(User $user, int $organizationId): array
    {
        $cacheKey = "tenant:{$organizationId}:user:{$user->id}:permissions";

        return Cache::remember($cacheKey, $this->cacheTtlSeconds, function () use ($user, $organizationId) {
            // Fetch tenant-scoped role from pivot table
            $orgUser = \DB::table('organization_user')
                ->where('organization_id', $organizationId)
                ->where('user_id', $user->id)
                ->first();

            if (!$orgUser) {
                return [];
            }

            $role = Role::find($orgUser->role_id);
            if (!$role) {
                return [];
            }

            // Map role code to permission strings
            return match ($role->code) {
                'ORGANIZATION_ADMIN' => [
                    'org:manage', 'user:invite', 'kyc:submit', 'kyc:review',
                    'project:create', 'project:edit', 'project:delete', 'project:view',
                    'activity:assign', 'progress:update', 'evidence:upload', 'evidence:approve',
                    'budget:view', 'budget:update', 'report:view', 'report:export'
                ],
                'PROJECT_MANAGER' => [
                    'project:create', 'project:edit', 'project:view',
                    'activity:assign', 'progress:update', 'evidence:upload', 'evidence:approve',
                    'report:view', 'report:export'
                ],
                'FINANCE_OFFICER' => [
                    'project:view', 'budget:view', 'budget:update', 'report:view', 'report:export'
                ],
                'VERIFIER' => [
                    'project:view', 'evidence:review', 'evidence:approve', 'report:view'
                ],
                'TEAM_MEMBER' => [
                    'project:view', 'progress:update', 'evidence:upload'
                ],
                'EXTERNAL_OBSERVER' => [
                    'project:view', 'report:view'
                ],
                default => ['project:view'],
            };
        });
    }

    /**
     * Check if user possesses a specific permission in the active tenant.
     */
    public function hasPermission(User $user, int $organizationId, string $permission): bool
    {
        $permissions = $this->getUserPermissions($user, $organizationId);
        return in_array($permission, $permissions) || in_array('org:manage', $permissions);
    }

    /**
     * Instantly invalidate permission cache for a user in a tenant when role changes.
     */
    public function invalidateUserPermissionCache(int $userId, int $organizationId): void
    {
        $cacheKey = "tenant:{$organizationId}:user:{$userId}:permissions";
        Cache::forget($cacheKey);
    }
}
