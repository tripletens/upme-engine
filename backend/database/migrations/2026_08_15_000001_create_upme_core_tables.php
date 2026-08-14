<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organizations', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name');
            $table->string('code')->unique();
            $table->json('settings')->nullable();
            $table->timestamps();
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->onDelete('cascade');
            $table->uuid('uuid')->unique();
            $table->string('code');
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('status', ['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'])->default('PLANNING');
            $table->enum('health_status', ['ON_TRACK', 'WARNING', 'AT_RISK', 'CRITICAL'])->default('ON_TRACK');
            $table->date('planned_start_date');
            $table->date('planned_end_date');
            $table->date('actual_start_date')->nullable();
            $table->date('actual_end_date')->nullable();
            $table->decimal('overall_progress', 5, 2)->default(0.00);
            $table->timestamps();

            $table->index(['organization_id', 'status']);
        });

        Schema::create('milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->string('name');
            $table->unsignedInteger('order_index')->default(0);
            $table->date('planned_start_date');
            $table->date('planned_end_date');
            $table->date('actual_start_date')->nullable();
            $table->date('actual_end_date')->nullable();
            $table->decimal('progress', 5, 2)->default(0.00);
            $table->enum('status', ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED'])->default('PENDING');
            $table->timestamps();
        });

        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('milestone_id')->constrained('milestones')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('status', ['NOT_STARTED', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED', 'CANCELLED'])->default('NOT_STARTED');
            $table->date('planned_start_date');
            $table->date('planned_end_date');
            $table->date('actual_start_date')->nullable();
            $table->date('actual_end_date')->nullable();
            $table->unsignedInteger('planned_duration_days');
            $table->unsignedInteger('actual_duration_days')->nullable();
            $table->decimal('progress', 5, 2)->default(0.00);
            $table->boolean('is_critical_path')->default(false);
            $table->unsignedBigInteger('assigned_to_user_id')->nullable();
            $table->json('checklist')->nullable();
            $table->timestamps();
        });

        Schema::create('activity_dependencies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('predecessor_activity_id')->constrained('activities')->onDelete('cascade');
            $table->foreignId('successor_activity_id')->constrained('activities')->onDelete('cascade');
            $table->enum('dependency_type', ['FS', 'SS', 'FF', 'SF'])->default('FS');
            $table->integer('lag_days')->default(0);
            $table->timestamps();

            $table->unique(['predecessor_activity_id', 'successor_activity_id']);
        });

        Schema::create('deliverables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained('activities')->onDelete('cascade');
            $table->string('title');
            $table->boolean('requires_evidence')->default(true);
            $table->enum('status', ['PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED'])->default('PENDING');
            $table->timestamps();
        });

        Schema::create('evidence', function (Blueprint $table) {
            $table->id();
            $table->foreignId('deliverable_id')->constrained('deliverables')->onDelete('cascade');
            $table->unsignedBigInteger('uploaded_by_user_id');
            $table->string('file_path', 1024);
            $table->string('file_type', 50);
            $table->unsignedInteger('file_size');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('risks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->string('title');
            $table->enum('probability', ['LOW', 'MEDIUM', 'HIGH']);
            $table->enum('impact', ['LOW', 'MEDIUM', 'HIGH']);
            $table->unsignedInteger('severity_score');
            $table->text('mitigation_plan')->nullable();
            $table->enum('status', ['IDENTIFIED', 'MITIGATED', 'MATERIALIZED', 'CLOSED'])->default('IDENTIFIED');
            $table->timestamps();
        });

        Schema::create('issues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('risk_id')->nullable()->constrained('risks')->onDelete('set null');
            $table->string('title');
            $table->enum('severity', ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
            $table->text('description');
            $table->text('resolution')->nullable();
            $table->enum('status', ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])->default('OPEN');
            $table->timestamps();
        });

        Schema::create('project_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('event_type', 100);
            $table->json('payload');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_events');
        Schema::dropIfExists('issues');
        Schema::dropIfExists('risks');
        Schema::dropIfExists('evidence');
        Schema::dropIfExists('deliverables');
        Schema::dropIfExists('activity_dependencies');
        Schema::dropIfExists('activities');
        Schema::dropIfExists('milestones');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('organizations');
    }
};
