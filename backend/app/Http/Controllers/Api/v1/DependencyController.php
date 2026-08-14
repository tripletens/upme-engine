<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateDependencyRequest;
use App\Models\Activity;
use App\Models\ActivityDependency;
use App\Services\DependencyEvaluationService;
use Illuminate\Http\JsonResponse;

class DependencyController extends Controller
{
    public function store(CreateDependencyRequest $request, DependencyEvaluationService $dependencyService): JsonResponse
    {
        $pred = Activity::findOrFail($request->validated('predecessor_activity_id'));
        $succ = Activity::findOrFail($request->validated('successor_activity_id'));

        // Cycle Detection check using Kahn's algorithm
        $noCycle = $dependencyService->validateNoCycle(
            $pred->project_id,
            $pred->id,
            $succ->id
        );

        if (!$noCycle) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot create dependency: circular dependency graph cycle detected.',
            ], 422);
        }

        $dependency = ActivityDependency::create([
            'project_id' => $pred->project_id,
            'predecessor_activity_id' => $pred->id,
            'successor_activity_id' => $succ->id,
            'dependency_type' => $request->validated('dependency_type', 'FS'),
            'lag_days' => $request->validated('lag_days', 0),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Activity dependency link created successfully.',
            'data' => $dependency,
        ], 201);
    }
}
