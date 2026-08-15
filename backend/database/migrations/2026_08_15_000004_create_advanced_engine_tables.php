<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Extend activities table with weight & custom_fields
        Schema::table('activities', function (Blueprint $table) {
            if (!Schema::hasColumn('activities', 'weight')) {
                $table->decimal('weight', 5, 2)->default(1.00)->after('progress');
            }
            if (!Schema::hasColumn('activities', 'custom_fields')) {
                $table->json('custom_fields')->nullable()->after('weight');
            }
        });

        // 2. Extend projects table with custom_fields & progress_strategy
        Schema::table('projects', function (Blueprint $table) {
            if (!Schema::hasColumn('projects', 'progress_strategy')) {
                $table->string('progress_strategy')->default('WEIGHTED_ACTIVITY_PROGRESS')->after('overall_progress');
            }
            if (!Schema::hasColumn('projects', 'custom_fields')) {
                $table->json('custom_fields')->nullable()->after('progress_strategy');
            }
        });

        // 3. Extend risks table with materialized_issue_id
        Schema::table('risks', function (Blueprint $table) {
            if (!Schema::hasColumn('risks', 'materialized_issue_id')) {
                $table->foreignId('materialized_issue_id')->nullable()->constrained('issues')->nullOnDelete()->after('status');
            }
        });

        // 4. Project Baselines (Versioning)
        Schema::create('project_baselines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->integer('version_number')->default(1);
            $table->string('version_label')->default('v1');
            $table->json('snapshot_data');
            $table->boolean('is_current')->default(true);
            $table->timestamps();
        });

        // 5. Monitoring Rules Engine
        Schema::create('monitoring_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('project_id')->nullable()->constrained('projects')->cascadeOnDelete();
            $table->string('name');
            $table->json('conditions');
            $table->json('actions');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 6. Engine Alerts Subsystem
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('activity_id')->nullable()->constrained('activities')->nullOnDelete();
            $table->enum('severity', ['INFO', 'WARNING', 'HIGH', 'CRITICAL'])->default('WARNING');
            $table->string('alert_type');
            $table->text('message');
            $table->boolean('is_resolved')->default(false);
            $table->timestamps();
        });

        // 7. Corrective Actions Subsystem
        Schema::create('corrective_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('alert_id')->nullable()->constrained('alerts')->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('assigned_to_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('due_date')->nullable();
            $table->enum('status', ['RECOMMENDED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'])->default('RECOMMENDED');
            $table->timestamps();
        });

        // 8. Project Historical State Snapshots
        Schema::create('project_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->decimal('health_score', 5, 2)->default(100.00);
            $table->decimal('progress', 5, 2)->default(0.00);
            $table->integer('schedule_variance_days')->default(0);
            $table->integer('open_issues_count')->default(0);
            $table->integer('active_risks_count')->default(0);
            $table->date('snapshot_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_snapshots');
        Schema::dropIfExists('corrective_actions');
        Schema::dropIfExists('alerts');
        Schema::dropIfExists('monitoring_rules');
        Schema::dropIfExists('project_baselines');
    }
};
