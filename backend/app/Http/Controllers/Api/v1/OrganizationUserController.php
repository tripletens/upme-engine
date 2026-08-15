<?php

namespace App\Http\Controllers\Api\v1;

use App\Contracts\Services\OrganizationServiceInterface;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use InvalidArgumentException;

class OrganizationUserController extends Controller
{
    public function __construct(
        private OrganizationServiceInterface $organizationService
    ) {}

    /**
     * GET /api/v1/organization/users
     * List all users belonging to the active tenant organization.
     */
    public function index(): JsonResponse
    {
        $tenant = app('current_tenant');
        $userData = $this->organizationService->getUsers($tenant);

        return response()->json([
            'status' => 'success',
            'organization' => [
                'id' => $tenant->id,
                'code' => $tenant->code,
                'name' => $tenant->name,
            ],
            'data' => $userData,
        ]);
    }

    /**
     * POST /api/v1/organization/users/{id}/permissions
     * Update user permissions live and save directly to engine database.
     */
    public function updatePermissions(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'permissions' => ['required', 'array'],
        ]);

        $tenant = app('current_tenant');

        try {
            $user = $this->organizationService->updatePermissions(
                $tenant,
                $id,
                $request->input('permissions', [])
            );

            return response()->json([
                'status' => 'success',
                'message' => "Permissions for staff member '{$user->name}' updated and saved to engine database.",
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'permissions' => $request->input('permissions', []),
                ],
            ]);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * POST /api/v1/organization/users/invite
     * Invite / register a new team member under the active tenant organization.
     */
    public function invite(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'role' => ['required', 'string', 'in:ADMIN,ORGANIZATION_ADMIN,PROJECT_MANAGER,SUPERVISOR,CONTRACTOR'],
        ]);

        $tenant = app('current_tenant');

        $result = $this->organizationService->inviteUser($tenant, $request->only('name', 'email', 'role'));

        return response()->json([
            'status' => 'success',
            'message' => "Team member '{$result['user']->name}' invited successfully with role {$result['user']->role}.",
            'data' => [
                'id' => $result['user']->id,
                'name' => $result['user']->name,
                'email' => $result['user']->email,
                'role' => $result['user']->role,
                'permissions' => $result['permissions'],
                'default_password' => $result['default_password'],
            ],
        ], 201);
    }

    /**
     * GET /api/v1/organization/api-key
     * Retrieve Company API Secret Key.
     */
    public function getApiKey(Request $request): JsonResponse
    {
        $tenant = app('current_tenant');
        $userRole = $request->header('X-User-Role') ?? 'ORGANIZATION_ADMIN';

        try {
            $apiKey = $this->organizationService->getApiKey($tenant, $userRole);

            return response()->json([
                'status' => 'success',
                'organization_code' => $tenant->code,
                'api_key' => $apiKey,
                'created_at' => $tenant->created_at?->toIso8601String(),
            ]);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 403);
        }
    }

    /**
     * POST /api/v1/organization/api-key/regenerate
     * Regenerate Company API Secret Key.
     */
    public function regenerateApiKey(Request $request): JsonResponse
    {
        $tenant = app('current_tenant');
        $userRole = $request->header('X-User-Role') ?? 'ORGANIZATION_ADMIN';

        try {
            $newApiKey = $this->organizationService->regenerateApiKey($tenant, $userRole);

            return response()->json([
                'status' => 'success',
                'message' => 'Company API Secret Key regenerated successfully. Previous key invalidated.',
                'organization_code' => $tenant->code,
                'api_key' => $newApiKey,
            ]);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 403);
        }
    }
}
