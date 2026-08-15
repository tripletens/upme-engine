<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class DocsController extends Controller
{
    /**
     * GET /api/v1/docs/openapi.json
     * Export OpenAPI v3.0 Schema Specification for UPME Engine Integrators.
     */
    public function openApiSpec(): JsonResponse
    {
        return response()->json([
            'openapi' => '3.0.3',
            'info' => [
                'title' => 'Universal Project Monitoring Engine (UPME) REST API',
                'description' => 'Generic, industry-agnostic execution intelligence engine for project state derivation, progress calculation strategies, DAG delay propagation, risk materialization, health explanations, and automated monitoring rules.',
                'version' => '1.0.0',
                'contact' => [
                    'name' => 'UPME Engineering Team',
                    'email' => 'api@upme.io',
                    'url' => 'https://upme.io'
                ]
            ],
            'servers' => [
                [
                    'url' => 'http://127.0.0.1:8000/api/v1',
                    'description' => 'Local Development Engine Server'
                ]
            ],
            'paths' => [
                '/auth/login' => [
                    'post' => [
                        'summary' => 'Authenticate User & Issue Access Token',
                        'requestBody' => [
                            'content' => [
                                'application/json' => [
                                    'schema' => [
                                        'type' => 'object',
                                        'properties' => [
                                            'email' => ['type' => 'string', 'example' => 'admin@upme.io'],
                                            'password' => ['type' => 'string', 'example' => 'Password123!'],
                                            'organization_code' => ['type' => 'string', 'example' => 'EIS-SCHOOL-DISTRICT']
                                        ],
                                        'required' => ['email', 'password']
                                    ]
                                ]
                            ]
                        ],
                        'responses' => [
                            '200' => ['description' => 'Authenticated successfully.']
                        ]
                    ]
                ],
                '/projects/{uuid}' => [
                    'get' => [
                        'summary' => 'Retrieve Project Details, Baseline, & Milestones',
                        'parameters' => [
                            ['name' => 'uuid', 'in' => 'path', 'required' => true, 'schema' => ['type' => 'string']]
                        ],
                        'responses' => [
                            '200' => ['description' => 'Project state details retrieved.']
                        ]
                    ]
                ],
                '/activities/{id}/progress' => [
                    'post' => [
                        'summary' => 'Update Activity Progress & Trigger Kahn\'s DAG Delay Propagation',
                        'parameters' => [
                            ['name' => 'id', 'in' => 'path', 'required' => true, 'schema' => ['type' => 'integer']]
                        ],
                        'requestBody' => [
                            'content' => [
                                'application/json' => [
                                    'schema' => [
                                        'type' => 'object',
                                        'properties' => [
                                            'progress' => ['type' => 'number', 'example' => 100],
                                            'status' => ['type' => 'string', 'example' => 'COMPLETED']
                                        ]
                                    ]
                                ]
                            ]
                        ],
                        'responses' => [
                            '200' => ['description' => 'Progress updated & DAG recalculated.']
                        ]
                    ]
                ],
                '/monitoring/evaluate/{uuid}' => [
                    'post' => [
                        'summary' => 'Evaluate Dynamic Rules & Compute Composite Health Score',
                        'parameters' => [
                            ['name' => 'uuid', 'in' => 'path', 'required' => true, 'schema' => ['type' => 'string']]
                        ],
                        'responses' => [
                            '200' => ['description' => 'Full engine monitoring evaluation completed.']
                        ]
                    ]
                ],
                '/risks/{id}/materialize' => [
                    'post' => [
                        'summary' => 'Convert Identified Risk to Materialized Issue',
                        'parameters' => [
                            ['name' => 'id', 'in' => 'path', 'required' => true, 'schema' => ['type' => 'integer']]
                        ],
                        'responses' => [
                            '200' => ['description' => 'Risk converted into issue with audit link.']
                        ]
                    ]
                ]
            ]
        ]);
    }
}
