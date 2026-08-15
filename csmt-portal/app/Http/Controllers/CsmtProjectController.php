<?php

namespace App\Http\Controllers;

use App\Services\UpmeEngineService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CsmtProjectController
{
    public function __construct(private UpmeEngineService $upmeEngine) {}

    /**
     * GET /csmt/projects
     * Fetch CSMT Schools projects with live UPME engine health state.
     */
    public function index(): JsonResponse
    {
        $engineState = $this->upmeEngine->getProjectState('proj-cs-lab-001');

        return response()->json([
            'status' => 'success',
            'client_portal' => 'CSMT Schools Educational Infrastructure Portal',
            'tenant_code' => env('UPME_ORGANIZATION_CODE', 'CSMT-SCHOOLS-DISTRICT'),
            'school_projects' => [
                [
                    'id' => 101,
                    'school_name' => 'CSMT Main Science Campus',
                    'lab_name' => 'Computer Science & AI Lab 304',
                    'lab_type' => 'CS_LAB',
                    'principal_contact' => 'Dr. Robert Vance (Principal)',
                    'upme_project_uuid' => 'proj-cs-lab-001',
                    'engine_state' => $engineState['data'] ?? null,
                ]
            ]
        ]);
    }

    /**
     * POST /csmt/projects/create
     * Create a new CSMT school project baseline in UPME Engine.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'school_name' => ['required', 'string'],
            'lab_type' => ['required', 'string', 'in:CS_LAB,ROBOTICS_STUDIO,CHEMISTRY_LAB'],
            'lab_name' => ['required', 'string'],
        ]);

        $templateCode = match ($request->input('lab_type')) {
            'ROBOTICS_STUDIO' => 'TPL-ROBOTICS-2026',
            'CHEMISTRY_LAB' => 'TPL-CHEM-2026',
            default => 'TPL-CS-LAB-2026',
        };

        $result = $this->upmeEngine->createSchoolProjectFromTemplate(
            $templateCode,
            "{$request->input('school_name')} - {$request->input('lab_name')}",
            "CSMT Schools Infrastructure Upgrade Project"
        );

        return response()->json([
            'status' => 'success',
            'message' => 'School lab project created successfully in UPME Engine!',
            'result' => $result,
        ], 201);
    }

    /**
     * POST /csmt/activities/{id}/progress
     * Update task progress via UPME Engine SDK.
     */
    public function updateProgress(int $id, Request $request): JsonResponse
    {
        $progress = (float) $request->input('progress', 100);
        $result = $this->upmeEngine->updateTaskProgress($id, $progress);

        return response()->json([
            'status' => 'success',
            'message' => 'CSMT task progress updated via UPME Engine SDK.',
            'result' => $result,
        ]);
    }
}
