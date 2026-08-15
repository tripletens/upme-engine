<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\Project;
use App\Models\Milestone;
use App\Models\Activity;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CsmtSchoolSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::firstOrCreate(
            ['code' => 'CSMT-SCHOOLS-DISTRICT'],
            [
                'uuid' => (string) Str::uuid(),
                'name' => 'CSMT Schools District',
                'settings' => ['kyc_status' => 'VERIFIED', 'plan' => 'ENTERPRISE'],
            ]
        );

        // Seed Organization Users & Staff Members
        $usersData = [
            [
                'name' => 'Dr. Clement Eze (District Admin)',
                'email' => 'admin@csmt.edu.ng',
                'role' => 'ADMIN',
            ],
            [
                'name' => 'Dr. Robert Vance',
                'email' => 'dr.vance@csmt.edu.ng',
                'role' => 'PROJECT_MANAGER',
            ],
            [
                'name' => 'Mrs. Clara Hughes',
                'email' => 'clara.hughes@csmt.edu.ng',
                'role' => 'SUPERVISOR',
            ],
            [
                'name' => 'Coach Marcus Miller',
                'email' => 'marcus.miller@csmt.edu.ng',
                'role' => 'SUPERVISOR',
            ],
            [
                'name' => 'Engr. David Opara',
                'email' => 'david.opara@csmt.edu.ng',
                'role' => 'CONTRACTOR',
            ],
            [
                'name' => 'Prof. Alex Chen',
                'email' => 'alex.chen@csmt.edu.ng',
                'role' => 'SUPERVISOR',
            ],
        ];

        foreach ($usersData as $uData) {
            User::updateOrCreate(
                ['email' => $uData['email']],
                [
                    'organization_id' => $organization->id,
                    'name' => $uData['name'],
                    'password' => Hash::make('Password123!'),
                    'role' => $uData['role'],
                    'api_token' => 'upme_token_' . Str::random(20),
                ]
            );
        }

        $projectsData = [
            [
                'code' => 'CSMT-SCI-001',
                'name' => 'Computer Science & AI Lab Modernization',
                'description' => 'Installation of 40 High-Performance Workstations & AI Acceleration Server in Room 304',
                'budget' => '₦35,000,000',
                'supervisor' => 'Dr. Robert Vance (HOD Computer Science)',
                'milestones' => [
                    [
                        'name' => '1. Lab Budget & Specifications Approval',
                        'activities' => [
                            ['name' => 'Approve Lab Budget & Specifications', 'progress' => 100, 'status' => 'COMPLETED'],
                        ]
                    ],
                    [
                        'name' => '2. Workstation PCs & Server Procurement',
                        'activities' => [
                            ['name' => 'Purchase Workstation PCs (40 Units)', 'progress' => 100, 'status' => 'COMPLETED'],
                        ]
                    ],
                    [
                        'name' => '3. Electrical Wiring & Network Outlets',
                        'activities' => [
                            ['name' => '3. Room Preparation', 'progress' => 80, 'status' => 'IN_PROGRESS'],
                        ]
                    ],
                    [
                        'name' => '4. Equipment Mounting & Software Deployment',
                        'activities' => [
                            ['name' => 'Unpack & Mount Workstations', 'progress' => 100, 'status' => 'COMPLETED'],
                        ]
                    ]
                ]
            ],
            [
                'code' => 'CSMT-LIB-002',
                'name' => 'Digital Library & E-Reader Hub Renovation',
                'description' => 'Central Library Floor 2 E-Book Cataloging & High-Speed WiFi AP Array',
                'budget' => '₦20,000,000',
                'supervisor' => 'Mrs. Clara Hughes (Head Librarian)',
                'milestones' => [
                    [
                        'name' => '1. E-Book Infrastructure',
                        'activities' => [
                            ['name' => '1. Cataloging Software & E-Book Server Setup', 'progress' => 100, 'status' => 'COMPLETED'],
                            ['name' => '2. Tablet e-Reader Kiosks Installation', 'progress' => 90, 'status' => 'IN_PROGRESS'],
                            ['name' => '3. Library High-Speed WiFi AP Array', 'progress' => 65, 'status' => 'IN_PROGRESS'],
                        ]
                    ]
                ]
            ],
            [
                'code' => 'CSMT-SPORTS-003',
                'name' => 'CSMT Stadium Artificial Turf & Floodlights Renovation',
                'description' => 'Outdoor Sports Complex FIFA-Standard Synthetic Turf Laying & Floodlight Towers',
                'budget' => '₦55,000,000',
                'supervisor' => 'Coach Marcus Miller (Sports Director)',
                'milestones' => [
                    [
                        'name' => '1. Pitch Infrastructure',
                        'activities' => [
                            ['name' => '1. Ground Excavation & Sub-base Drainage', 'progress' => 100, 'status' => 'COMPLETED'],
                            ['name' => '2. FIFA-Standard Synthetic Turf Laying', 'progress' => 50, 'status' => 'IN_PROGRESS'],
                            ['name' => '3. LED Floodlight Towers Electrical Grid', 'progress' => 30, 'status' => 'IN_PROGRESS'],
                        ]
                    ]
                ]
            ],
            [
                'code' => 'CSMT-HOSTEL-004',
                'name' => 'Hostel Hall A & B Smart Access & Solar Hot Water',
                'description' => 'Hostels Block A & B RFID Keypad Access Control & Roof Thermal Solar Array',
                'budget' => '₦40,000,000',
                'supervisor' => 'Engr. David Opara (Facilities Manager)',
                'milestones' => [
                    [
                        'name' => '1. Residential Facilities Upgrade',
                        'activities' => [
                            ['name' => '1. RFID Smart Card Keypad Installation', 'progress' => 100, 'status' => 'COMPLETED'],
                            ['name' => '2. Roof Solar Thermal Water Heater Array', 'progress' => 100, 'status' => 'COMPLETED'],
                            ['name' => '3. Hostel Mesh WiFi Network Expansion', 'progress' => 85, 'status' => 'IN_PROGRESS'],
                        ]
                    ]
                ]
            ],
            [
                'code' => 'CSMT-CLUBS-005',
                'name' => 'Robotics & STEM Student Club Workshop',
                'description' => 'Innovation Hub Room 102 3D Printers, Microcontrollers & Testing Arena',
                'budget' => '₦15,000,000',
                'supervisor' => 'Prof. Alex Chen (Robotics Club Patron)',
                'milestones' => [
                    [
                        'name' => '1. STEM Workshop Setup',
                        'activities' => [
                            ['name' => '1. 3D Printers & Soldering Benches Procurement', 'progress' => 100, 'status' => 'COMPLETED'],
                            ['name' => '2. Student Microcontroller & Sensor Kits', 'progress' => 75, 'status' => 'IN_PROGRESS'],
                            ['name' => '3. Competition Testing Arena Construction', 'progress' => 35, 'status' => 'IN_PROGRESS'],
                        ]
                    ]
                ]
            ]
        ];

        foreach ($projectsData as $pData) {
            $project = Project::updateOrCreate(
                [
                    'organization_id' => $organization->id,
                    'code' => $pData['code']
                ],
                [
                    'uuid' => (string) Str::uuid(),
                    'name' => $pData['name'],
                    'description' => $pData['description'],
                    'status' => 'ACTIVE',
                    'health_status' => 'ON_TRACK',
                    'planned_start_date' => now()->toDateString(),
                    'planned_end_date' => now()->addDays(90)->toDateString(),
                    'overall_progress' => 80.0
                ]
            );

            foreach ($pData['milestones'] as $mIndex => $mData) {
                $milestone = Milestone::create([
                    'project_id' => $project->id,
                    'name' => $mData['name'],
                    'order_index' => $mIndex + 1,
                    'planned_start_date' => now()->toDateString(),
                    'planned_end_date' => now()->addDays(30)->toDateString(),
                    'progress' => 80.0,
                    'status' => 'IN_PROGRESS'
                ]);

                foreach ($mData['activities'] as $aData) {
                    Activity::create([
                        'project_id' => $project->id,
                        'milestone_id' => $milestone->id,
                        'name' => $aData['name'],
                        'status' => $aData['status'],
                        'planned_start_date' => now()->toDateString(),
                        'planned_end_date' => now()->addDays(15)->toDateString(),
                        'planned_duration_days' => 15,
                        'progress' => $aData['progress'],
                        'is_critical_path' => true
                    ]);
                }
            }
        }
    }
}
