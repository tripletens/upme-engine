<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectTemplate;
use App\Services\ProjectTemplateService;
use App\Services\ProjectReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TemplateAndReportController extends Controller
{
    public function indexTemplates(): JsonResponse
    {
        $templates = ProjectTemplate::all();
        return response()->json([
            'status' => 'success',
            'data' => $templates,
        ]);
    }

    public function createFromTemplate(Request $request, ProjectTemplateService $templateService): JsonResponse
    {
        $request->validate([
            'template_id' => ['required', 'integer', 'exists:project_templates,id'],
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50'],
            'start_date' => ['required', 'date'],
        ]);

        $template = ProjectTemplate::findOrFail($request->input('template_id'));
        $project = $templateService->instantiateProject($template, $request->all());

        return response()->json([
            'status' => 'success',
            'message' => "Project '{$project->name}' created from template '{$template->name}'.",
            'data' => $project->load('milestones.activities'),
        ], 201);
    }

    public function generateReport(string $uuid, ProjectReportService $reportService): JsonResponse
    {
        $project = Project::where('uuid', $uuid)->firstOrFail();
        $report = $reportService->generateExecutiveReport($project);

        return response()->json([
            'status' => 'success',
            'data' => $report,
        ]);
    }

    public function exportCsv(string $uuid, ProjectReportService $reportService): Response
    {
        $project = Project::where('uuid', $uuid)->firstOrFail();
        $csvContent = $reportService->exportActivitiesToCsv($project);

        return response($csvContent, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="project-' . $project->code . '-activities.csv"',
        ]);
    }
}
