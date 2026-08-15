<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CsmtSchoolSeeder extends Seeder
{
    /**
     * Seed diverse CSMT Schools projects across campus (Library, Sports, Clubs, Hostel, CS Lab).
     */
    public static function getSeededSchoolProjects(): array
    {
        return [
            [
                'id' => 101,
                'school_name' => 'CSMT Science & Technology Campus',
                'project_name' => 'Computer Science & AI Lab Modernization',
                'category' => 'ACADEMIC_LAB',
                'location' => 'Block A - Room 304',
                'budget_allocated' => '$75,000',
                'upme_project_uuid' => 'proj-cs-lab-001',
                'overall_progress' => 100,
                'health_status' => 'ON_TRACK',
                'health_score' => 100.0,
                'lead_supervisor' => 'Dr. Robert Vance (HOD Computer Science)',
                'milestones' => [
                    ['name' => '1. Lab Budget & Specifications Approval', 'progress' => 100, 'status' => 'COMPLETED'],
                    ['name' => '2. Workstation PCs & Server Procurement', 'progress' => 100, 'status' => 'COMPLETED'],
                    ['name' => '3. Electrical Wiring & Network Outlets', 'progress' => 100, 'status' => 'COMPLETED'],
                    ['name' => '4. Equipment Mounting & Software Deployment', 'progress' => 100, 'status' => 'COMPLETED']
                ]
            ],
            [
                'id' => 102,
                'school_name' => 'CSMT Central Campus',
                'project_name' => 'Digital Library & E-Reader Hub Renovation',
                'category' => 'LIBRARY',
                'location' => 'Central Library - Floor 2',
                'budget_allocated' => '$45,000',
                'upme_project_uuid' => 'proj-library-002',
                'overall_progress' => 85,
                'health_status' => 'ON_TRACK',
                'health_score' => 92.5,
                'lead_supervisor' => 'Mrs. Clara Hughes (Head Librarian)',
                'milestones' => [
                    ['name' => '1. Cataloging Software & E-Book Server Setup', 'progress' => 100, 'status' => 'COMPLETED'],
                    ['name' => '2. Tablet e-Reader Kiosks Installation', 'progress' => 90, 'status' => 'IN_PROGRESS'],
                    ['name' => '3. Library High-Speed WiFi AP Array', 'progress' => 65, 'status' => 'IN_PROGRESS']
                ]
            ],
            [
                'id' => 103,
                'school_name' => 'CSMT Athletics & Sports Academy',
                'project_name' => 'CSMT Stadium Artificial Turf & Floodlights Renovation',
                'category' => 'SPORTS',
                'location' => 'Outdoor Sports Complex',
                'budget_allocated' => '$120,000',
                'upme_project_uuid' => 'proj-sports-003',
                'overall_progress' => 60,
                'health_status' => 'WARNING',
                'health_score' => 78.0,
                'lead_supervisor' => 'Coach Marcus Miller (Sports Director)',
                'milestones' => [
                    ['name' => '1. Ground Excavation & Sub-base Drainage', 'progress' => 100, 'status' => 'COMPLETED'],
                    ['name' => '2. FIFA-Standard Synthetic Turf Laying', 'progress' => 50, 'status' => 'IN_PROGRESS'],
                    ['name' => '3. LED Floodlight Towers Electrical Grid', 'progress' => 30, 'status' => 'IN_PROGRESS']
                ]
            ],
            [
                'id' => 104,
                'school_name' => 'CSMT Residential Campus',
                'project_name' => 'Hostel Hall A & B Smart Access & Solar Hot Water',
                'category' => 'HOSTEL',
                'location' => 'Hostels Block A & B',
                'budget_allocated' => '$85,000',
                'upme_project_uuid' => 'proj-hostel-004',
                'overall_progress' => 95,
                'health_status' => 'ON_TRACK',
                'health_score' => 96.0,
                'lead_supervisor' => 'Engr. David Opara (Facilities Manager)',
                'milestones' => [
                    ['name' => '1. RFID Smart Card Keypad Installation', 'progress' => 100, 'status' => 'COMPLETED'],
                    ['name' => '2. Roof Solar Thermal Water Heater Array', 'progress' => 100, 'status' => 'COMPLETED'],
                    ['name' => '3. Hostel Mesh WiFi Network Expansion', 'progress' => 85, 'status' => 'IN_PROGRESS']
                ]
            ],
            [
                'id' => 105,
                'school_name' => 'CSMT Innovation Hub',
                'project_name' => 'Robotics & STEM Student Club Workshop',
                'category' => 'CLUBS',
                'location' => 'Innovation Hub - Room 102',
                'budget_allocated' => '$35,000',
                'upme_project_uuid' => 'proj-robotics-005',
                'overall_progress' => 70,
                'health_status' => 'ON_TRACK',
                'health_score' => 88.0,
                'lead_supervisor' => 'Prof. Alex Chen (Robotics Club Patron)',
                'milestones' => [
                    ['name' => '1. 3D Printers & Soldering Benches Procurement', 'progress' => 100, 'status' => 'COMPLETED'],
                    ['name' => '2. Student Microcontroller & Sensor Kits', 'progress' => 75, 'status' => 'IN_PROGRESS'],
                    ['name' => '3. Competition Testing Arena Construction', 'progress' => 35, 'status' => 'IN_PROGRESS']
                ]
            ]
        ];
    }
}
