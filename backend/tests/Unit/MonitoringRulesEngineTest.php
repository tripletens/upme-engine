<?php

namespace Tests\Unit;

use App\Domain\Rules\MonitoringRulesEngine;
use App\Models\Project;
use PHPUnit\Framework\TestCase;

class MonitoringRulesEngineTest extends TestCase
{
    public function test_matches_conditions_with_greater_than_operator(): void
    {
        $engine = new MonitoringRulesEngine();
        $project = new Project(['overall_progress' => 85.0]);

        $conditions = [
            [
                'field' => 'overall_progress',
                'operator' => '>',
                'value' => 50.0,
            ]
        ];

        $this->assertTrue($engine->matchesConditions($project, $conditions));
    }

    public function test_matches_conditions_with_in_operator(): void
    {
        $engine = new MonitoringRulesEngine();
        $project = new Project(['health_status' => 'ON_TRACK']);

        $conditions = [
            [
                'field' => 'health_status',
                'operator' => 'in',
                'value' => ['ON_TRACK', 'WARNING'],
            ]
        ];

        $this->assertTrue($engine->matchesConditions($project, $conditions));
    }
}
