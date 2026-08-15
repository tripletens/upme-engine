<?php

namespace App\Http\Controllers\Api\v1;

use App\Contracts\Services\AuthServiceInterface;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use InvalidArgumentException;

class AuthController extends Controller
{
    public function __construct(
        private AuthServiceInterface $authService
    ) {}

    /**
     * User Authentication & Session Initialization Endpoint.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        try {
            $authData = $this->authService->authenticate(
                $request->input('email'),
                $request->input('password')
            );

            return response()->json(array_merge([
                'status' => 'success',
                'message' => 'Authenticated successfully.',
            ], $authData));
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 401);
        }
    }
}
