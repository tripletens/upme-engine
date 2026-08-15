<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\PermissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function __construct(private PermissionService $permissionService) {}

    /**
     * User Authentication & Session Initialization Endpoint.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $request->input('email'))->first();

        if (!$user || !Hash::check($request->input('password'), $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid email or password credentials.'
            ], 401);
        }

        $organization = $user->organization;
        $permissions = $this->permissionService->getUserPermissions($user, $organization->id);

        return response()->json([
            'status' => 'success',
            'message' => 'Authenticated successfully.',
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
        ]);
    }
}
