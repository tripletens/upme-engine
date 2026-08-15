<?php

namespace App\Http\Controllers\Api\v1;

use App\Contracts\Services\ActivityServiceInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateDependencyRequest;
use Illuminate\Http\JsonResponse;
use InvalidArgumentException;

class DependencyController extends Controller
{
    public function __construct(
        private ActivityServiceInterface $activityService
    ) {}

    public function store(CreateDependencyRequest $request): JsonResponse
    {
        try {
            $dependency = $this->activityService->createDependency(
                $request->validated('predecessor_activity_id'),
                $request->validated('successor_activity_id'),
                $request->validated('dependency_type', 'FS'),
                $request->validated('lag_days', 0)
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Activity dependency link created successfully.',
                'data' => $dependency,
            ], 201);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
