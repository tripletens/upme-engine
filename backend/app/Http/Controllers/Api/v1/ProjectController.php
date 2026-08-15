<?php

namespace App\Http\Controllers\Api\v1;

use App\Contracts\Services\ProjectServiceInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateProjectRequest;
use App\Http\Resources\ProjectResource;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    public function __construct(
        private ProjectServiceInterface $projectService
    ) {}

    public function index(): JsonResponse
    {
        $projects = $this->projectService->listProjects(15);

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
        $tenant = app()->bound('current_tenant') ? app('current_tenant') : null;
        
        $project = $this->projectService->createProject($request->validated(), $tenant?->id);

        return response()->json([
            'status' => 'success',
            'message' => 'Project baseline created successfully.',
            'data' => new ProjectResource($project),
        ], 201);
    }

    public function show(string $uuid): JsonResponse
    {
        $project = $this->projectService->getProjectByUuid($uuid);

        return response()->json([
            'status' => 'success',
            'data' => new ProjectResource($project),
        ]);
    }

    public function health(string $uuid): JsonResponse
    {
        $healthBreakdown = $this->projectService->getProjectHealth($uuid);

        return response()->json([
            'status' => 'success',
            'data' => $healthBreakdown,
        ]);
    }
}
