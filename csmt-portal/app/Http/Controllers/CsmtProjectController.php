<?php

namespace App\Http\Controllers;

use App\Services\UpmeEngineService;
use Database\Seeders\CsmtSchoolSeeder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CsmtProjectController
{
    public function __construct(private UpmeEngineService $upmeEngine) {}

    /**
     * GET /csmt/projects
     * Fetch all CSMT Schools campus projects across Library, Sports, Clubs, Hostels, & CS Labs.
     */
    public function index(Request $request): JsonResponse
    {
        $allProjects = CsmtSchoolSeeder::getSeededSchoolProjects();
        $category = $request->query('category');

        if ($category) {
            $allProjects = array_values(array_filter($allProjects, fn($p) => $p['category'] === strtoupper($category)));
        }

        // Enrich first project with live UPME engine calculated state
        $liveEngineState = $this->upmeEngine->getProjectState('proj-cs-lab-001');
        if (isset($allProjects[0]) && isset($liveEngineState['data'])) {
            $allProjects[0]['engine_live_state'] = $liveEngineState['data'];
        }

        return response()->json([
            'status' => 'success',
            'client_portal' => 'CSMT Schools Multi-Campus Infrastructure & Activities Portal',
            'organization_code' => env('UPME_ORGANIZATION_CODE', 'CSMT-SCHOOLS-DISTRICT'),
            'total_seeded_projects' => count($allProjects),
            'categories_summary' => [
                'ACADEMIC_LAB' => 1,
                'LIBRARY' => 1,
                'SPORTS' => 1,
                'HOSTEL' => 1,
                'CLUBS' => 1
            ],
            'projects' => $allProjects,
        ]);
    }

    /**
     * POST /csmt/projects/create
     * Create a new school campus project baseline in UPME Engine.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'school_name' => ['required', 'string'],
            'project_name' => ['required', 'string'],
            'category' => ['required', 'string', 'in:ACADEMIC_LAB,LIBRARY,SPORTS,HOSTEL,CLUBS'],
            'location' => ['required', 'string'],
        ]);

        $templateCode = match ($request->input('category')) {
            'LIBRARY' => 'TPL-LIB-2026',
            'SPORTS' => 'TPL-SPORTS-2026',
            'HOSTEL' => 'TPL-HOSTEL-2026',
            'CLUBS' => 'TPL-CLUBS-2026',
            default => 'TPL-CS-LAB-2026',
        };

        $result = $this->upmeEngine->createSchoolProjectFromTemplate(
            $templateCode,
            "{$request->input('school_name')} - {$request->input('project_name')}",
            "CSMT Schools Infrastructure Project ({$request->input('category')})"
        );

        return response()->json([
            'status' => 'success',
            'message' => 'New CSMT School project baseline instantiated in UPME Engine!',
            'result' => $result,
        ], 201);
    }
}
