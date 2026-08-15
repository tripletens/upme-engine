<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    /**
     * Seed full-access Super Admin organization and user accounts for testing.
     */
    public function run(): void
    {
        // 1. Create Verified Enterprise Super Admin Organization
        $adminOrg = Organization::updateOrCreate(
            ['code' => 'ADMIN-ENTERPRISE-001'],
            [
                'uuid' => (string) Str::uuid(),
                'name' => 'UPME Global Enterprise Admin',
                'settings' => [
                    'kyc_status' => 'VERIFIED',
                    'kyc_verified_at' => now()->toIso8601String(),
                    'subscription_tier' => 'ENTERPRISE',
                    'corporate_tax_id' => 'TAX-99887766-NG',
                    'registration_no' => 'RC-99887766',
                    'features' => [
                        'all_domain_templates',
                        'unlimited_projects',
                        'unlimited_seats',
                        'redis_rbac_option_b',
                        'gantt_dag_propagation',
                        'paystack_live_checkout',
                        'executive_exports'
                    ]
                ]
            ]
        );

        // 2. Create Super Admin User with Full Access
        $adminUser = User::updateOrCreate(
            ['email' => 'admin@upme.io'],
            [
                'organization_id' => $adminOrg->id,
                'name' => 'Super Admin User',
                'password' => Hash::make('Password123!'),
                'role' => 'ADMIN',
                'is_verified' => true,
                'api_token' => 'upme_admin_full_access_token_2026',
            ]
        );

        // 3. Create Verified School District Admin Account
        $schoolOrg = Organization::firstOrCreate(
            ['code' => 'EIS-SCHOOL-DISTRICT'],
            [
                'uuid' => (string) Str::uuid(),
                'name' => 'Example International School',
                'settings' => [
                    'kyc_status' => 'VERIFIED',
                    'subscription_tier' => 'PROFESSIONAL',
                ]
            ]
        );

        User::updateOrCreate(
            ['email' => 'schooladmin@school.edu'],
            [
                'organization_id' => $schoolOrg->id,
                'name' => 'School District Admin',
                'password' => Hash::make('Password123!'),
                'role' => 'ORGANIZATION_ADMIN',
                'is_verified' => true,
                'api_token' => 'upme_school_admin_token_2026',
            ]
        );

        // Cache full-access permissions in Redis/File cache
        $permissions = [
            'org:manage', 'user:invite', 'kyc:submit', 'kyc:review',
            'project:create', 'project:edit', 'project:delete', 'project:view',
            'activity:assign', 'progress:update', 'evidence:upload', 'evidence:approve',
            'budget:view', 'budget:update', 'report:view', 'report:export'
        ];

        \Cache::put("tenant:{$adminOrg->id}:user:{$adminUser->id}:permissions", $permissions, 86400);
    }
}
