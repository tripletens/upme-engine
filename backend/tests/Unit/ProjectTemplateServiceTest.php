<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Services\ProjectTemplateService;

class ProjectTemplateServiceTest extends TestCase
{
    public function test_template_instantiation_service_exists(): void
    {
        $service = new ProjectTemplateService();
        $this->assertNotNull($service);
    }
}
