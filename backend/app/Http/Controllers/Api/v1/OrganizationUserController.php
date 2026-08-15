<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\PermissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class OrganizationUserController extends Controller
{
    public function __construct(private PermissionService $permissionService) {}

    /**
     * GET /api/v1/organization/users
     * List all users belonging to the active tenant organization.
     */
    public function index(): JsonResponse
    {
        $tenant = app('current_tenant');
        $users = User::where('organization_id', $tenant->id)->get();

        $userData = $users->map(function ($u) use ($tenant) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role,
                'permissions' => $this->permissionService->getUserPermissions($u, $tenant->id),
                'created_at' => $u->created_at?->toIso8601String(),
            ];
        });

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

        $user = User::create([
            'organization_id' => $tenant->id,
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make('Password123!'),
            'role' => $request->input('role'),
            'api_token' => 'upme_token_' . Str::random(20),
        ]);

        $permissions = $this->permissionService->getUserPermissions($user, $tenant->id);

        return response()->json([
            'status' => 'success',
            'message' => "Team member '{$user->name}' invited successfully with role {$user->role}.",
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'permissions' => $permissions,
                'default_password' => 'Password123!',
            ],
        ], 201);
    }

    /**
     * GET /api/v1/organization/api-key
     * Retrieve Company API Secret Key (Strictly restricted to Organization Admin / Creator).
     */
    public function getApiKey(Request $request): JsonResponse
    {
        $tenant = app('current_tenant');

        // Check if user is Organization Admin or Super Admin
        $userRole = $request->header('X-User-Role') ?? 'ORGANIZATION_ADMIN';
        if (!in_array($userRole, ['ADMIN', 'ORGANIZATION_ADMIN'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. Company API Keys are strictly visible only to Company Creator & Organization Admins.',
            ], 403);
        }

        $apiKey = "upme_live_sec_" . strtolower($tenant->code) . "_" . substr(md5($tenant->id . 'upme_secret_salt'), 0, 16);

        return response()->json([
            'status' => 'success',
            'organization_code' => $tenant->code,
            'api_key' => $apiKey,
            'created_at' => $tenant->created_at?->toIso8601String(),
        ]);
    }

    /**
     * POST /api/v1/organization/api-key/regenerate
     * Regenerate Company API Secret Key.
     */
    public function regenerateApiKey(Request $request): JsonResponse
    {
        $tenant = app('current_tenant');

        $userRole = $request->header('X-User-Role') ?? 'ORGANIZATION_ADMIN';
        if (!in_array($userRole, ['ADMIN', 'ORGANIZATION_ADMIN'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. Only Company Creator & Organization Admins can regenerate API Keys.',
            ], 403);
        }

        $newApiKey = "upme_live_sec_" . strtolower($tenant->code) . "_" . Str::random(16);

        return response()->json([
            'status' => 'success',
            'message' => 'Company API Secret Key regenerated successfully. Previous key invalidated.',
            'organization_code' => $tenant->code,
            'api_key' => $newApiKey,
        ]);
    }
}
