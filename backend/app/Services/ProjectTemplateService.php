<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Milestone;
use App\Models\Activity;
use App\Models\ActivityDependency;
use App\Models\ProjectTemplate;
use App\Models\ProjectEvent;
use Carbon\Carbon;
use Illuminate\Support\Str;

class ProjectTemplateService
{
    /**
     * Instantiate a new project from a reusable template.
     *
     * @param ProjectTemplate $template
     * @param array $projectParams
     * @return Project
     */
    public function instantiateProject(ProjectTemplate $template, array $projectParams): Project
    {
        $startDate = Carbon::parse($projectParams['start_date'] ?? now());

        $project = Project::create([
            'organization_id' => $projectParams['organization_id'] ?? 1,
            'uuid' => Str::uuid(),
            'code' => $projectParams['code'] ?? strtoupper(Str::random(8)),
            'name' => $projectParams['name'] ?? $template->name,
            'description' => $projectParams['description'] ?? $template->description,
            'status' => 'PLANNING',
            'health_status' => 'ON_TRACK',
            'planned_start_date' => $startDate->toDateString(),
            'planned_end_date' => $startDate->copy()->addDays(60)->toDateString(),
            'overall_progress' => 0.0,
        ]);

        $activityMapping = [];
        $currentOffsetDays = 0;

        foreach ($template->template_data['milestones'] ?? [] as $mIndex => $mDef) {
            $mStart = $startDate->copy()->addDays($currentOffsetDays);
            $mDuration = $mDef['duration_days'] ?? 14;
            $mEnd = $mStart->copy()->addDays($mDuration);

            $milestone = Milestone::create([
                'project_id' => $project->id,
                'name' => $mDef['name'],
                'order_index' => $mIndex + 1,
                'planned_start_date' => $mStart->toDateString(),
                'planned_end_date' => $mEnd->toDateString(),
                'progress' => 0.0,
                'status' => 'PENDING',
            ]);

            foreach ($mDef['activities'] ?? [] as $aDef) {
                $aDuration = $aDef['duration_days'] ?? 5;
                $aStart = $mStart->copy();
                $aEnd = $aStart->copy()->addDays($aDuration);

                $activity = Activity::create([
                    'project_id' => $project->id,
                    'milestone_id' => $milestone->id,
                    'name' => $aDef['name'],
                    'description' => $aDef['description'] ?? null,
                    'status' => 'NOT_STARTED',
                    'planned_start_date' => $aStart->toDateString(),
                    'planned_end_date' => $aEnd->toDateString(),
                    'planned_duration_days' => $aDuration,
                    'progress' => 0.0,
                    'is_critical_path' => $aDef['is_critical_path'] ?? false,
                ]);

                if (isset($aDef['key'])) {
                    $activityMapping[$aDef['key']] = $activity->id;
                }
            }

            $currentOffsetDays += $mDuration;
        }

        // Link dependencies specified in template
        foreach ($template->template_data['dependencies'] ?? [] as $depDef) {
            $predKey = $depDef['predecessor_key'] ?? null;
            $succKey = $depDef['successor_key'] ?? null;

            if (isset($activityMapping[$predKey], $activityMapping[$succKey])) {
                ActivityDependency::create([
                    'project_id' => $project->id,
                    'predecessor_activity_id' => $activityMapping[$predKey],
                    'successor_activity_id' => $activityMapping[$succKey],
                    'dependency_type' => $depDef['type'] ?? 'FS',
                    'lag_days' => $depDef['lag_days'] ?? 0,
                ]);
            }
        }

        ProjectEvent::create([
            'project_id' => $project->id,
            'event_type' => 'PROJECT_CREATED_FROM_TEMPLATE',
            'payload' => [
                'template_id' => $template->id,
                'template_name' => $template->name,
                'message' => "Project '{$project->name}' created from template '{$template->name}'."
            ]
        ]);

        return $project;
    }
}
