<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Organization;
use App\Models\Project;
use App\Models\Milestone;
use App\Models\Activity;
use App\Models\ActivityDependency;
use App\Models\Risk;
use App\Models\Issue;
use App\Models\ProjectEvent;

class SchoolLaboratorySeeder extends Seeder
{
    public function run(): void
    {
        // 1. Organization
        $org = Organization::firstOrCreate(
            ['code' => 'EIS-SCHOOL-DISTRICT'],
            [
                'uuid' => 'org-school-district-001',
                'name' => 'Example International School',
                'settings' => ['theme' => 'dark', 'timezone' => 'UTC'],
            ]
        );

        // 2. Project
        $project = Project::updateOrCreate(
            ['code' => 'SCH-LAB-2026'],
            [
                'organization_id' => $org->id,
                'uuid' => 'proj-cs-lab-001',
                'name' => 'Computer Science Laboratory Implementation',
                'description' => 'Setup and rollout of a 40-workstation Computer Science laboratory.',
                'status' => 'ACTIVE',
                'health_status' => 'ON_TRACK',
                'planned_start_date' => '2026-08-01',
                'planned_end_date' => '2026-09-30',
                'actual_start_date' => '2026-08-01',
                'overall_progress' => 68.00,
            ]
        );

        // 3. Milestones
        $m1 = Milestone::updateOrCreate(
            ['project_id' => $project->id, 'order_index' => 1],
            [
                'name' => '1. Planning & Budget Approval',
                'planned_start_date' => '2026-08-01',
                'planned_end_date' => '2026-08-07',
                'progress' => 100.00,
                'status' => 'COMPLETED',
            ]
        );

        $m2 = Milestone::updateOrCreate(
            ['project_id' => $project->id, 'order_index' => 2],
            [
                'name' => '2. Procurement Phase',
                'planned_start_date' => '2026-08-08',
                'planned_end_date' => '2026-08-20',
                'progress' => 100.00,
                'status' => 'COMPLETED',
            ]
        );

        $m3 = Milestone::updateOrCreate(
            ['project_id' => $project->id, 'order_index' => 3],
            [
                'name' => '3. Room Preparation',
                'planned_start_date' => '2026-08-15',
                'planned_end_date' => '2026-08-25',
                'progress' => 80.00,
                'status' => 'IN_PROGRESS',
            ]
        );

        $m4 = Milestone::updateOrCreate(
            ['project_id' => $project->id, 'order_index' => 4],
            [
                'name' => '4. Equipment Installation',
                'planned_start_date' => '2026-08-23',
                'planned_end_date' => '2026-09-05',
                'progress' => 25.00,
                'status' => 'IN_PROGRESS',
            ]
        );

        // 4. Activities
        $a11 = Activity::updateOrCreate(
            ['project_id' => $project->id, 'name' => 'Approve Lab Budget & Specifications'],
            [
                'milestone_id' => $m1->id,
                'status' => 'COMPLETED',
                'planned_start_date' => '2026-08-01',
                'planned_end_date' => '2026-08-07',
                'planned_duration_days' => 6,
                'progress' => 100.00,
                'is_critical_path' => true,
            ]
        );

        $a21 = Activity::updateOrCreate(
            ['project_id' => $project->id, 'name' => 'Purchase Workstation PCs (40 Units)'],
            [
                'milestone_id' => $m2->id,
                'status' => 'COMPLETED',
                'planned_start_date' => '2026-08-08',
                'planned_end_date' => '2026-08-18',
                'planned_duration_days' => 10,
                'progress' => 100.00,
                'is_critical_path' => true,
            ]
        );

        $a41 = Activity::updateOrCreate(
            ['project_id' => $project->id, 'name' => 'Unpack & Mount Workstations'],
            [
                'milestone_id' => $m4->id,
                'status' => 'IN_PROGRESS',
                'planned_start_date' => '2026-08-23',
                'planned_end_date' => '2026-08-30',
                'planned_duration_days' => 7,
                'progress' => 25.00,
                'is_critical_path' => true,
            ]
        );

        // 5. Dependency
        ActivityDependency::firstOrCreate([
            'project_id' => $project->id,
            'predecessor_activity_id' => $a21->id,
            'successor_activity_id' => $a41->id,
        ], [
            'dependency_type' => 'FS',
            'lag_days' => 0,
        ]);

        // 6. Risk
        Risk::firstOrCreate([
            'project_id' => $project->id,
            'title' => 'PC Supplier Customs Clearing Delay',
        ], [
            'probability' => 'LOW',
            'impact' => 'LOW',
            'severity_score' => 5,
            'mitigation_plan' => 'Contact customs broker to expedite clearance.',
            'status' => 'MITIGATED',
        ]);
    }
}
