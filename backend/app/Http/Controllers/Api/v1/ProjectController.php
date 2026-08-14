<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Services\ProjectHealthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index(): JsonResponse
    {
        $projects = Project::with('milestones.activities')->paginate(15);
        return response()->json([
            'status' => 'success',
            'data' => ProjectResource::collection($projects),
            'meta' => [
                'current_page' => $projects->currentPage(),
                'total' => $projects->total(),
            ]
        ]);
    }

    public function store(CreateProjectRequest $request): JsonResponse
    {
        $tenant = app('current_tenant');
        
        $project = Project::create([
            'organization_id' => $tenant->id ?? 1,
            'uuid' => Str::uuid(),
            'code' => $request->validated('code'),
            'name' => $request->validated('name'),
            'description' => $request->validated('description'),
            'planned_start_date' => $request->validated('planned_start_date'),
            'planned_end_date' => $request->validated('planned_end_date'),
            'status' => 'PLANNING',
            'health_status' => 'ON_TRACK',
            'overall_progress' => 0.0,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Project baseline created successfully.',
            'data' => new ProjectResource($project),
        ], 201);
    }

    public function show(string $uuid): JsonResponse
    {
        $project = Project::where('uuid', $uuid)->with('milestones.activities', 'risks', 'issues')->firstOrFail();
        return response()->json([
            'status' => 'success',
            'data' => new ProjectResource($project),
        ]);
    }

    public function health(string $uuid, ProjectHealthService $healthService): JsonResponse
    {
        $project = Project::where('uuid', $uuid)->firstOrFail();
        $healthBreakdown = $healthService->calculateHealth($project);

        return response()->json([
            'status' => 'success',
            'data' => $healthBreakdown,
        ]);
    }
}
