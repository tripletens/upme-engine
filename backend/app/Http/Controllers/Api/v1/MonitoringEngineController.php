<?php

namespace App\Http\Controllers\Api\v1;

use App\Contracts\Services\MonitoringEngineServiceInterface;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MonitoringEngineController extends Controller
{
    public function __construct(
        private MonitoringEngineServiceInterface $monitoringService
    ) {}

    /**
     * GET /projects/{uuid}/health/explanation
     */
    public function explainHealth(string $uuid): JsonResponse
    {
        $explanation = $this->monitoringService->explainHealth($uuid);

        return response()->json([
            'status' => 'success',
            'data' => $explanation,
        ]);
    }

    /**
     * GET /projects/{uuid}/alerts
     */
    public function indexAlerts(string $uuid): JsonResponse
    {
        $alerts = $this->monitoringService->getAlerts($uuid);

        return response()->json([
            'status' => 'success',
            'data' => $alerts,
        ]);
    }

    /**
     * GET /projects/{uuid}/corrective-actions
     */
    public function indexCorrectiveActions(string $uuid): JsonResponse
    {
        $actions = $this->monitoringService->getCorrectiveActions($uuid);

        return response()->json([
            'status' => 'success',
            'data' => $actions,
        ]);
    }

    /**
     * POST /projects/{uuid}/baselines
     */
    public function createBaselineSnapshot(string $uuid): JsonResponse
    {
        $snapshot = $this->monitoringService->createBaselineSnapshot($uuid);

        return response()->json([
            'status' => 'success',
            'message' => "Baseline version {$snapshot->version_label} snapshotted successfully.",
            'data' => $snapshot,
        ], 201);
    }

    /**
     * POST /risks/{id}/materialize
     */
    public function materializeRisk(int $id, Request $request): JsonResponse
    {
        $result = $this->monitoringService->materializeRisk($id, $request->input('notes'));

        return response()->json([
            'status' => 'success',
            'message' => "Risk '{$result['risk']->title}' materialized into Issue #{$result['materialized_issue']->id}.",
            'data' => $result,
        ]);
    }

    /**
     * POST /monitoring/evaluate/{uuid}
     */
    public function evaluateMonitoring(string $uuid): JsonResponse
    {
        $data = $this->monitoringService->evaluateMonitoring($uuid);

        return response()->json([
            'status' => 'success',
            'message' => 'Full project execution monitoring evaluation completed.',
            'data' => $data,
        ]);
    }
}
