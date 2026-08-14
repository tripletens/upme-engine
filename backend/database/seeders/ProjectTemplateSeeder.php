<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProjectTemplate;
use Illuminate\Support\Str;

class ProjectTemplateSeeder extends Seeder
{
    public function run(): void
    {
        // 1. School CS Lab Template
        ProjectTemplate::create([
            'uuid' => Str::uuid(),
            'name' => 'School Computer Science Laboratory Setup',
            'category' => 'Education',
            'description' => 'Standard template for setting up a 30-40 workstation school computer science laboratory.',
            'is_global' => true,
            'template_data' => [
                'milestones' => [
                    [
                        'name' => '1. Planning & Procurement',
                        'duration_days' => 14,
                        'activities' => [
                            ['key' => 'spec_approval', 'name' => 'Approve Hardware Specs', 'duration_days' => 5, 'is_critical_path' => true],
                            ['key' => 'pc_procurement', 'name' => 'Purchase PCs & Switches', 'duration_days' => 10, 'is_critical_path' => true],
                        ]
                    ],
                    [
                        'name' => '2. Room Preparation',
                        'duration_days' => 10,
                        'activities' => [
                            ['key' => 'elec_work', 'name' => 'Electrical Outlets & Trunking', 'duration_days' => 7, 'is_critical_path' => true],
                            ['key' => 'furniture_setup', 'name' => 'Install Desks & Chairs', 'duration_days' => 5, 'is_critical_path' => false],
                        ]
                    ],
                    [
                        'name' => '3. Equipment & Network Setup',
                        'duration_days' => 10,
                        'activities' => [
                            ['key' => 'pc_install', 'name' => 'Unpack & Mount PCs', 'duration_days' => 5, 'is_critical_path' => true],
                            ['key' => 'net_config', 'name' => 'Configure Subnet & Router', 'duration_days' => 5, 'is_critical_path' => true],
                        ]
                    ]
                ],
                'dependencies' => [
                    ['predecessor_key' => 'pc_procurement', 'successor_key' => 'pc_install', 'type' => 'FS', 'lag_days' => 0],
                    ['predecessor_key' => 'elec_work', 'successor_key' => 'pc_install', 'type' => 'FS', 'lag_days' => 0],
                    ['predecessor_key' => 'pc_install', 'successor_key' => 'net_config', 'type' => 'FS', 'lag_days' => 0],
                ]
            ]
        ]);

        // 2. Construction Site Prep Template
        ProjectTemplate::create([
            'uuid' => Str::uuid(),
            'name' => 'Commercial Construction Site Preparation',
            'category' => 'Construction',
            'description' => 'Standard template for site clearance, soil testing, and foundation excavation.',
            'is_global' => true,
            'template_data' => [
                'milestones' => [
                    [
                        'name' => '1. Survey & Clearance',
                        'duration_days' => 14,
                        'activities' => [
                            ['key' => 'topographic_survey', 'name' => 'Topographic & Soil Survey', 'duration_days' => 7, 'is_critical_path' => true],
                            ['key' => 'site_demolition', 'name' => 'Site Clearance & Demolition', 'duration_days' => 7, 'is_critical_path' => true],
                        ]
                    ],
                    [
                        'name' => '2. Foundation Excavation',
                        'duration_days' => 21,
                        'activities' => [
                            ['key' => 'earth_excavation', 'name' => 'Earthwork Excavation', 'duration_days' => 14, 'is_critical_path' => true],
                            ['key' => 'rebar_binding', 'name' => 'Steel Rebar Binding', 'duration_days' => 7, 'is_critical_path' => true],
                        ]
                    ]
                ],
                'dependencies' => [
                    ['predecessor_key' => 'site_demolition', 'successor_key' => 'earth_excavation', 'type' => 'FS', 'lag_days' => 0],
                    ['predecessor_key' => 'earth_excavation', 'successor_key' => 'rebar_binding', 'type' => 'FS', 'lag_days' => 0],
                ]
            ]
        ]);

        // 3. Software Release Lifecycle Template
        ProjectTemplate::create([
            'uuid' => Str::uuid(),
            'name' => 'Software Enterprise Release Lifecycle',
            'category' => 'Software',
            'description' => 'Standard template for requirement scoping, sprint execution, QA testing, and production deployment.',
            'is_global' => true,
            'template_data' => [
                'milestones' => [
                    [
                        'name' => '1. Architecture & Design',
                        'duration_days' => 10,
                        'activities' => [
                            ['key' => 'tech_spec', 'name' => 'Write Technical Architecture Spec', 'duration_days' => 5, 'is_critical_path' => true],
                            ['key' => 'db_schema', 'name' => 'Design DB Schema', 'duration_days' => 5, 'is_critical_path' => true],
                        ]
                    ],
                    [
                        'name' => '2. Feature Development & Testing',
                        'duration_days' => 20,
                        'activities' => [
                            ['key' => 'api_build', 'name' => 'Develop Core Backend APIs', 'duration_days' => 12, 'is_critical_path' => true],
                            ['key' => 'qa_automation', 'name' => 'Execute E2E Automation Tests', 'duration_days' => 8, 'is_critical_path' => true],
                        ]
                    ]
                ],
                'dependencies' => [
                    ['predecessor_key' => 'db_schema', 'successor_key' => 'api_build', 'type' => 'FS', 'lag_days' => 0],
                    ['predecessor_key' => 'api_build', 'successor_key' => 'qa_automation', 'type' => 'FS', 'lag_days' => 0],
                ]
            ]
        ]);
    }
}
