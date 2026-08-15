<?php

namespace App\Domain\Risks;

use App\Models\Issue;
use App\Models\ProjectEvent;
use App\Models\Risk;

class RiskIssueTransitionService
{
    /**
     * Convert an identified Risk into a Materialized Issue with full audit traceability.
     */
    public function materializeRisk(Risk $risk, ?string $additionalNotes = null): Issue
    {
        // 1. Create corresponding Issue
        $issue = Issue::create([
            'project_id' => $risk->project_id,
            'title' => "[Materialized Risk] {$risk->title}",
            'description' => $risk->mitigation_plan ? "{$risk->mitigation_plan}. Notes: {$additionalNotes}" : $additionalNotes,
            'severity' => $risk->impact === 'HIGH' ? 'CRITICAL' : 'HIGH',
            'status' => 'OPEN',
        ]);

        // 2. Update Risk status & link
        $risk->status = 'MATERIALIZED';
        $risk->materialized_issue_id = $issue->id;
        $risk->save();

        // 3. Emit Project Audit Trail Event
        ProjectEvent::create([
            'project_id' => $risk->project_id,
            'event_type' => 'RISK_MATERIALIZED',
            'payload' => [
                'risk_id' => $risk->id,
                'risk_title' => $risk->title,
                'issue_id' => $issue->id,
                'message' => "Risk '{$risk->title}' materialized into Issue #{$issue->id}.",
            ],
        ]);

        return $issue;
    }
}
