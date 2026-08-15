<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * UPME Execution Intelligence Engine Client Service
 * Encapsulates all REST API communications between CSMT Schools Portal and UPME Engine.
 */
class UpmeEngineService
{
    private string $baseUrl;
    private string $organizationCode;
    private string $apiKey;

    public function __construct()
    {
        $this->baseUrl = env('UPME_ENGINE_BASE_URL', 'http://127.0.0.1:8000/api/v1');
        $this->organizationCode = env('UPME_ORGANIZATION_CODE', 'CSMT-SCHOOLS-DISTRICT');
        $this->apiKey = env('UPME_API_KEY', 'upme_live_sec_csmt_schools_8f9a0b1c');
    }

    /**
     * Build base HTTP request with required multi-tenant & API key headers.
     */
    private function client()
    {
        return Http::withHeaders([
            'X-Organization-Code' => $this->organizationCode,
            'X-Api-Key' => $this->apiKey,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ])->baseUrl($this->baseUrl);
    }

    /**
     * 1. Instantiate a new CSMT School Project from Engine Template.
     */
    public function createSchoolProjectFromTemplate(string $templateCode, string $projectName, string $description): array
    {
        $response = $this->client()->post('/projects/from-template', [
            'template_code' => $templateCode,
            'name' => $projectName,
            'description' => $description,
            'planned_start_date' => now()->toDateString(),
            'planned_end_date' => now()->addDays(60)->toDateString(),
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        Log::error('UPME Engine Project Creation Failed: ' . $response->body());
        return ['status' => 'error', 'message' => $response->json('message') ?? 'Failed to instantiate project baseline in UPME Engine.'];
    }

    /**
     * 2. Fetch Live Project State, Baseline, & Calculated Health Score.
     */
    public function getProjectState(string $projectUuid): array
    {
        $response = $this->client()->get("/projects/{$projectUuid}");

        if ($response->successful()) {
            return $response->json();
        }

        return ['status' => 'error', 'message' => 'Failed to fetch project state from UPME Engine.'];
    }

    /**
     * 3. Update Activity Progress & Trigger Kahn's DAG Delay Propagation in Engine.
     */
    public function updateTaskProgress(int $activityId, float $progress, ?string $status = null): array
    {
        $payload = ['progress' => $progress];
        if ($status) {
            $payload['status'] = $status;
        }

        $response = $this->client()->post("/activities/{$activityId}/progress", $payload);

        if ($response->successful()) {
            return $response->json();
        }

        return ['status' => 'error', 'message' => 'Failed to update task progress in UPME Engine.'];
    }

    /**
     * 4. Upload & Attach Inspection Deliverable Evidence in Vault.
     */
    public function uploadEvidence(int $deliverableId, string $fileUrl, string $notes): array
    {
        $response = $this->client()->post("/deliverables/{$deliverableId}/evidence", [
            'file_url' => $fileUrl,
            'notes' => $notes,
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        return ['status' => 'error', 'message' => 'Failed to upload deliverable evidence to UPME Engine.'];
    }

    /**
     * 5. Get Human & Structured Health Score Driver Explanations.
     */
    public function getHealthExplanation(string $projectUuid): array
    {
        $response = $this->client()->get("/projects/{$projectUuid}/health/explanation");

        if ($response->successful()) {
            return $response->json();
        }

        return ['status' => 'error', 'message' => 'Failed to fetch health explanation from UPME Engine.'];
    }

    /**
     * 6. Trigger Full Monitoring Engine Evaluation & Dynamic Rules Check.
     */
    public function evaluateMonitoring(string $projectUuid): array
    {
        $response = $this->client()->post("/monitoring/evaluate/{$projectUuid}");

        if ($response->successful()) {
            return $response->json();
        }

        return ['status' => 'error', 'message' => 'Failed to evaluate monitoring rules in UPME Engine.'];
    }
}
