<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained('organizations')->onDelete('cascade');
            $table->uuid('uuid')->unique();
            $table->string('code')->nullable();
            $table->string('name');
            $table->string('category'); // e.g., Education, Construction, Software
            $table->text('description')->nullable();
            $table->json('template_data'); // Milestones, default durations, activities, dependencies
            $table->boolean('is_global')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_templates');
    }
};
