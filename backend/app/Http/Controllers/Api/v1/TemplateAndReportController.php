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
    private function resolveProject(string $identifier): Project
    {
        return Project::where('uuid', $identifier)
            ->orWhere('code', $identifier)
            ->orWhere('id', $identifier)
            ->first() ?? Project::firstOrFail();
    }

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
        $project = $this->resolveProject($uuid);
        $report = $reportService->generateExecutiveReport($project);

        return response()->json([
            'status' => 'success',
            'data' => $report,
        ]);
    }

    public function exportCsv(string $uuid, ProjectReportService $reportService): Response
    {
        $project = $this->resolveProject($uuid);
        $csvContent = $reportService->exportActivitiesToCsv($project);

        return response($csvContent, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="project-' . $project->code . '-activities.csv"',
        ]);
    }

    public function exportPdfReport(string $uuid, ProjectReportService $reportService): Response
    {
        $project = $this->resolveProject($uuid);
        $report = $reportService->generateExecutiveReport($project);

        $healthStatus = $report['project_summary']['health_status'] ?? $project->health_status;
        $overallProgress = $report['project_summary']['overall_progress'] ?? $project->overall_progress;
        $completedActivities = $report['activity_metrics']['completed'] ?? 0;
        $totalActivities = $report['activity_metrics']['total'] ?? 0;

        $html = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <title>Executive Report - {$project->name}</title>
            <style>
                body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0f172a; padding: 40px; background: #fff; }
                .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
                .title { font-size: 24px; font-weight: bold; color: #0f172a; }
                .subtitle { color: #64748b; font-size: 14px; margin-top: 5px; }
                .grid { display: flex; gap: 20px; margin-bottom: 30px; }
                .card { flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; background: #f8fafc; }
                .card-title { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; }
                .card-val { font-size: 28px; font-weight: bold; color: #4f46e5; margin-top: 5px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; font-size: 13px; }
                th { background: #f1f5f9; color: #334155; font-weight: bold; }
                .badge { padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
                .badge-track { background: #ecfdf5; color: #047857; }
            </style>
        </head>
        <body>
            <div class='header'>
                <div class='title'>UPME Executive Project Health Report</div>
                <div class='subtitle'>Project: {$project->name} ({$project->code})</div>
            </div>

            <div class='grid'>
                <div class='card'>
                    <div class='card-title'>Health Status</div>
                    <div class='card-val' style='color:#059669;'>{$healthStatus}</div>
                </div>
                <div class='card'>
                    <div class='card-title'>Overall Progress</div>
                    <div class='card-val'>{$overallProgress}%</div>
                </div>
                <div class='card'>
                    <div class='card-title'>Activities Completed</div>
                    <div class='card-val'>{$completedActivities} / {$totalActivities}</div>
                </div>
            </div>

            <h3>Milestone & Activity Status</h3>
            <table>
                <thead>
                    <tr>
                        <th>Activity Name</th>
                        <th>Milestone</th>
                        <th>Status</th>
                        <th>Progress</th>
                        <th>Assigned To</th>
                    </tr>
                </thead>
                <tbody>";

        foreach ($project->milestones as $m) {
            foreach ($m->activities as $a) {
                $html .= "
                    <tr>
                        <td>{$a->name}</td>
                        <td>{$m->name}</td>
                        <td><span class='badge badge-track'>{$a->status}</span></td>
                        <td>{$a->progress}%</td>
                        <td>" . ($a->assigned_to_user_id ? 'Assigned' : 'Unassigned') . "</td>
                    </tr>";
            }
        }

        $html .= "
                </tbody>
            </table>
        </body>
        </html>";

        return response($html, 200, [
            'Content-Type' => 'text/html',
            'Content-Disposition' => 'inline; filename="executive-report-' . $project->code . '.html"',
        ]);
    }
}
