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
use Illuminate\Support\Str;

class SchoolLaboratorySeeder extends Seeder
{
    public function run(): void
    {
        // 1. Organization
        $org = Organization::firstOrCreate(
            ['code' => 'EIS-SCHOOL-DISTRICT'],
            [
                'uuid' => Str::uuid(),
                'name' => 'Example International School',
                'settings' => ['theme' => 'dark', 'timezone' => 'UTC'],
            ]
        );

        // 2. Project
        $project = Project::create([
            'organization_id' => $org->id,
            'uuid' => Str::uuid(),
            'code' => 'SCH-LAB-2026',
            'name' => 'Computer Science Laboratory Implementation',
            'description' => 'Setup and rollout of a 40-workstation Computer Science laboratory.',
            'status' => 'ACTIVE',
            'health_status' => 'AT_RISK',
            'planned_start_date' => '2026-08-01',
            'planned_end_date' => '2026-09-30',
            'actual_start_date' => '2026-08-01',
            'overall_progress' => 42.00,
        ]);

        // 3. Milestones
        $m1 = Milestone::create([
            'project_id' => $project->id,
            'name' => '1. Planning & Budget Approval',
            'order_index' => 1,
            'planned_start_date' => '2026-08-01',
            'planned_end_date' => '2026-08-07',
            'progress' => 100.00,
            'status' => 'COMPLETED',
        ]);

        $m2 = Milestone::create([
            'project_id' => $project->id,
            'name' => '2. Procurement Phase',
            'order_index' => 2,
            'planned_start_date' => '2026-08-08',
            'planned_end_date' => '2026-08-20',
            'progress' => 60.00,
            'status' => 'DELAYED',
        ]);

        $m3 = Milestone::create([
            'project_id' => $project->id,
            'name' => '3. Room Preparation',
            'order_index' => 3,
            'planned_start_date' => '2026-08-15',
            'planned_end_date' => '2026-08-25',
            'progress' => 30.00,
            'status' => 'IN_PROGRESS',
        ]);

        $m4 = Milestone::create([
            'project_id' => $project->id,
            'name' => '4. Equipment Installation',
            'order_index' => 4,
            'planned_start_date' => '2026-08-23',
            'planned_end_date' => '2026-09-05',
            'progress' => 0.00,
            'status' => 'PENDING',
        ]);

        // 4. Activities
        $a11 = Activity::create([
            'project_id' => $project->id,
            'milestone_id' => $m1->id,
            'name' => 'Approve Lab Budget & Specifications',
            'status' => 'COMPLETED',
            'planned_start_date' => '2026-08-01',
            'planned_end_date' => '2026-08-07',
            'planned_duration_days' => 6,
            'progress' => 100.00,
            'is_critical_path' => true,
        ]);

        $a21 = Activity::create([
            'project_id' => $project->id,
            'milestone_id' => $m2->id,
            'name' => 'Purchase Workstation PCs (40 Units)',
            'status' => 'IN_PROGRESS',
            'planned_start_date' => '2026-08-08',
            'planned_end_date' => '2026-08-18',
            'planned_duration_days' => 10,
            'progress' => 50.00,
            'is_critical_path' => true,
        ]);

        $a41 = Activity::create([
            'project_id' => $project->id,
            'milestone_id' => $m4->id,
            'name' => 'Unpack & Mount Workstations',
            'status' => 'BLOCKED',
            'planned_start_date' => '2026-08-23',
            'planned_end_date' => '2026-08-30',
            'planned_duration_days' => 7,
            'progress' => 0.00,
            'is_critical_path' => true,
        ]);

        // 5. Dependency
        ActivityDependency::create([
            'project_id' => $project->id,
            'predecessor_activity_id' => $a21->id,
            'successor_activity_id' => $a41->id,
            'dependency_type' => 'FS',
            'lag_days' => 0,
        ]);

        // 6. Risk & Issue
        $risk = Risk::create([
            'project_id' => $project->id,
            'title' => 'PC Supplier Customs Clearing Delay',
            'probability' => 'HIGH',
            'impact' => 'HIGH',
            'severity_score' => 25,
            'mitigation_plan' => 'Contact customs broker to expedite clearance.',
            'status' => 'MATERIALIZED',
        ]);

        Issue::create([
            'project_id' => $project->id,
            'risk_id' => $risk->id,
            'title' => 'PC Vendor shipment delayed by 9 days at customs port',
            'severity' => 'CRITICAL',
            'description' => 'Computer supplier shipment of 40 PCs is held up at port customs clearance.',
            'status' => 'OPEN',
        ]);

        // 7. Project Event Log
        ProjectEvent::create([
            'project_id' => $project->id,
            'event_type' => 'DEPENDENCY_BLOCKAGE_DETECTED',
            'payload' => [
                'message' => "'Purchase Workstation PCs' delay of 9 days is blocking 'Unpack & Mount Workstations'."
            ]
        ]);
    }
}
