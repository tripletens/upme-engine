<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Services\DependencyEvaluationService;

class DependencyEngineTest extends TestCase
{
    public function test_prevents_direct_cycle(): void
    {
        $service = new DependencyEvaluationService();
        
        // Activity A cannot depend on Activity A (self-loop)
        $isValid = $service->validateNoCycle(1, 10, 10);
        $this->assertFalse($isValid);
    }
}
