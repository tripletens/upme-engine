import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Tabs,
  Tab,
  Stack,
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CodeIcon from '@mui/icons-material/Code';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TerminalIcon from '@mui/icons-material/Terminal';
import ApiIcon from '@mui/icons-material/Api';

export const ApiDocsView: React.FC = () => {
  const [activeLang, setActiveLang] = useState<'curl' | 'js' | 'python' | 'php'>('curl');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const endpoints = [
    {
      id: 1,
      method: 'POST',
      path: '/api/v1/auth/login',
      title: 'Authenticate User & Obtain Session Token',
      category: 'AUTHENTICATION & MULTI-TENANCY',
      description: 'Verifies email, password, and organization tenant code. Returns Bearer API token and role permissions.',
      requestBody: {
        email: 'admin@upme.io',
        password: 'Password123!',
        organization_code: 'EIS-SCHOOL-DISTRICT'
      },
      responseBody: {
        status: 'success',
        token: 'upme_token_9x2k7l...',
        user: { id: 1, name: 'Super Admin', role: 'ADMIN' },
        permissions: ['org:manage', 'project:create', 'progress:update']
      }
    },
    {
      id: 2,
      method: 'GET',
      path: '/api/v1/projects/{uuid}',
      title: 'Get Project State, Baseline, & Milestones',
      category: 'PROJECT BASELINE ENGINE',
      description: 'Ingests project baseline details, calculated health status, milestones, activities, risks, and active issues.',
      requestBody: null,
      responseBody: {
        status: 'success',
        data: {
          uuid: 'proj-cs-lab-001',
          name: 'Computer Science Lab Setup',
          health_status: 'ON_TRACK',
          overall_progress: 100,
          milestones_count: 4
        }
      }
    },
    {
      id: 3,
      method: 'POST',
      path: '/api/v1/activities/{id}/progress',
      title: 'Update Progress & Trigger Kahn\'s DAG Delay Propagation',
      category: 'PROGRESS & DAG GRAPH ENGINE',
      description: 'Updates activity progress score (0-100), dispatches background Kahn\'s DAG delay calculation job, and recalculates parent project progress.',
      requestBody: {
        progress: 100,
        status: 'COMPLETED'
      },
      responseBody: {
        status: 'success',
        message: 'Activity progress updated successfully.',
        calculated_project_progress: 100,
        downstream_impact: [],
        job_dispatched: true
      }
    },
    {
      id: 4,
      method: 'POST',
      path: '/api/v1/monitoring/evaluate/{uuid}',
      title: 'Evaluate Dynamic Monitoring Rules & Calculate Health Score',
      category: 'MONITORING RULES & HEALTH ENGINE',
      description: 'Executes dynamic JSON monitoring rules against live metrics, recalculates overall health score (0-100), and derives state.',
      requestBody: null,
      responseBody: {
        status: 'success',
        message: 'Full project execution monitoring evaluation completed.',
        data: {
          project_id: 1,
          calculated_progress: 100,
          health_score: 100.0,
          health_status: 'ON_TRACK',
          alerts_triggered: 0
        }
      }
    },
    {
      id: 5,
      method: 'GET',
      path: '/api/v1/projects/{uuid}/health/explanation',
      title: 'Get Primary Health Score Driver Explanations',
      category: 'MONITORING RULES & HEALTH ENGINE',
      description: 'Returns human-readable and structured JSON explanations detailing primary health score contributors (e.g. Schedule Lag, Blocked Dependencies).',
      requestBody: null,
      responseBody: {
        status: 'success',
        data: {
          overall_health_score: 100.0,
          health_status: 'ON_TRACK',
          primary_contributors: [
            { type: 'OPTIMAL_PERFORMANCE', severity: 'INFO', message: 'Project execution is running optimal with zero active blockages.' }
          ]
        }
      }
    },
    {
      id: 6,
      method: 'POST',
      path: '/api/v1/risks/{id}/materialize',
      title: 'Materialize Risk into Open Issue with Audit Link',
      category: 'RISK MANAGEMENT ENGINE',
      description: 'Converts identified risk to open issue (#ID), links materialized_issue_id, updates status to MATERIALIZED, and records audit event.',
      requestBody: {
        notes: 'Supplier confirmed customs hold at port.'
      },
      responseBody: {
        status: 'success',
        message: "Risk 'PC Supplier Delay' materialized into Issue #1.",
        data: {
          risk_id: 1,
          materialized_issue_id: 1,
          status: 'MATERIALIZED'
        }
      }
    },
    {
      id: 7,
      method: 'POST',
      path: '/api/v1/organization/users/invite',
      title: 'Invite Team Member to Tenant Organization (RBAC)',
      category: 'MULTI-TENANT USER MANAGEMENT',
      description: 'Invites a new colleague under the active tenant organization code with assigned RBAC permission scope.',
      requestBody: {
        name: 'Jane Doe',
        email: 'janedoe@school.edu',
        role: 'PROJECT_MANAGER'
      },
      responseBody: {
        status: 'success',
        message: "Team member 'Jane Doe' invited successfully.",
        data: { id: 3, name: 'Jane Doe', role: 'PROJECT_MANAGER' }
      }
    }
  ];

  const generateCodeSnippet = (ep: any, lang: 'curl' | 'js' | 'python' | 'php') => {
    const url = `http://127.0.0.1:8000${ep.path.replace('{uuid}', 'proj-cs-lab-001').replace('{id}', '1')}`;
    const bodyStr = ep.requestBody ? JSON.stringify(ep.requestBody, null, 2) : null;

    if (lang === 'curl') {
      if (ep.method === 'GET') {
        return `curl -X GET "${url}" \\\n  -H "X-Organization-Code: EIS-SCHOOL-DISTRICT" \\\n  -H "Accept: application/json"`;
      }
      return `curl -X ${ep.method} "${url}" \\\n  -H "X-Organization-Code: EIS-SCHOOL-DISTRICT" \\\n  -H "Content-Type: application/json" \\\n  -H "Accept: application/json" \\\n  -d '${JSON.stringify(ep.requestBody)}'`;
    }

    if (lang === 'js') {
      return `const response = await fetch("${url}", {\n  method: "${ep.method}",\n  headers: {\n    "X-Organization-Code": "EIS-SCHOOL-DISTRICT",\n    "Content-Type": "application/json",\n    "Accept": "application/json"\n  }${bodyStr ? `,\n  body: JSON.stringify(${bodyStr})` : ''}\n});\nconst data = await response.json();\nconsole.log(data);`;
    }

    if (lang === 'python') {
      return `import requests\n\nurl = "${url}"\nheaders = {\n    "X-Organization-Code": "EIS-SCHOOL-DISTRICT",\n    "Content-Type": "application/json"\n}\n${bodyStr ? `payload = ${bodyStr}\nresponse = requests.${ep.method.toLowerCase()}(url, headers=headers, json=payload)` : `response = requests.${ep.method.toLowerCase()}(url, headers=headers)`}\n\nprint(response.json())`;
    }

    if (lang === 'php') {
      return `<?php\n$client = new \\GuzzleHttp\\Client();\n$response = $client->request('${ep.method}', '${url}', [\n  'headers' => [\n    'X-Organization-Code' => 'EIS-SCHOOL-DISTRICT',\n    'Accept' => 'application/json'\n  ]${bodyStr ? `,\n  'json' => ${JSON.stringify(ep.requestBody, null, 2)}` : ''}\n]);\necho $response->getBody();`;
    }

    return '';
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleDownloadOpenApi = () => {
    window.open('http://127.0.0.1:8000/api/v1/docs/openapi.json', '_blank');
  };

  return (
    <Box>
      {/* Header Banner */}
      <Box className="enterprise-card" sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Chip
              icon={<ApiIcon sx={{ fontSize: 16 }} />}
              label="DEVELOPER INTEGRATION PORTAL"
              sx={{ background: '#e0e7ff', color: '#4338ca', fontWeight: 800, mb: 1.5 }}
            />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
              Engine REST API & OpenAPI v3.0 Documentation
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Integrate UPME execution intelligence into any ERP, CRM, or custom application.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadOpenApi}
            sx={{
              background: '#4f46e5',
              color: '#ffffff',
              borderRadius: '10px',
              px: 3,
              py: 1.2,
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
              '&:hover': { background: '#4338ca' }
            }}
          >
            Export OpenAPI v3.0 Spec (JSON)
          </Button>
        </Box>
      </Box>

      {/* Required Headers Info Banner */}
      <Alert severity="info" sx={{ mb: 4, borderRadius: '12px' }}>
        <strong>Mandatory Integration Headers:</strong> All REST API calls require <code>X-Organization-Code: &lt;TENANT_CODE&gt;</code> for multi-tenant isolation.
      </Alert>

      {/* Code Snippet Language Selector */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
          📖 API Endpoints Reference ({endpoints.length})
        </Typography>

        <Tabs
          value={activeLang}
          onChange={(_, val) => setActiveLang(val)}
          sx={{ '& .MuiTab-root': { fontWeight: 700, textTransform: 'none' } }}
        >
          <Tab label="cURL" value="curl" />
          <Tab label="JavaScript (Fetch)" value="js" />
          <Tab label="Python (Requests)" value="python" />
          <Tab label="PHP (Guzzle)" value="php" />
        </Tabs>
      </Box>

      {/* Endpoints Accordion List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {endpoints.map((ep, idx) => {
          const codeSnippet = generateCodeSnippet(ep, activeLang);

          return (
            <Accordion key={ep.id} defaultExpanded={idx === 0} sx={{ borderRadius: '12px !important', border: '1px solid #e2e8f0', boxShadow: 'none', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', width: '100%' }}>
                  <Chip
                    label={ep.method}
                    size="small"
                    sx={{
                      fontWeight: 800,
                      width: 60,
                      background: ep.method === 'GET' ? '#d1fae5' : '#e0e7ff',
                      color: ep.method === 'GET' ? '#047857' : '#4338ca'
                    }}
                  />
                  <Typography variant="subtitle1" fontCode sx={{ fontWeight: 800, color: '#0f172a' }}>
                    {ep.path}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', ml: 'auto', mr: 2, display: { xs: 'none', md: 'block' } }}>
                    {ep.title}
                  </Typography>
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ borderTop: '1px solid #f1f5f9', p: 3, background: '#fafafa' }}>
                <Typography variant="body2" sx={{ color: '#334155', mb: 2, fontWeight: 500 }}>
                  {ep.description}
                </Typography>

                <Grid container spacing={3}>
                  {/* Left Column: Code Generator Snippet */}
                  <Grid item xs={12} lg={6}>
                    <Box sx={{ position: 'relative' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>
                          REQUEST CODE SNIPPET ({activeLang.toUpperCase()})
                        </Typography>
                        <Button
                          size="small"
                          startIcon={<ContentCopyIcon sx={{ fontSize: 13 }} />}
                          onClick={() => handleCopy(codeSnippet, ep.id)}
                          sx={{ textTransform: 'none', fontSize: '0.72rem', color: '#4f46e5' }}
                        >
                          {copiedIndex === ep.id ? 'Copied!' : 'Copy Code'}
                        </Button>
                      </Box>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          background: '#0f172a',
                          color: '#38bdf8',
                          fontFamily: 'monospace',
                          fontSize: '0.78rem',
                          borderRadius: '8px',
                          overflowX: 'auto',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all'
                        }}
                      >
                        {codeSnippet}
                      </Paper>
                    </Box>
                  </Grid>

                  {/* Right Column: Sample Response Payload */}
                  <Grid item xs={12} lg={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>
                        SAMPLE RESPONSE PAYLOAD (200 OK)
                      </Typography>
                      <Chip label="APPLICATION/JSON" size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700 }} />
                    </Box>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        background: '#1e293b',
                        color: '#4ade80',
                        fontFamily: 'monospace',
                        fontSize: '0.78rem',
                        borderRadius: '8px',
                        overflowX: 'auto',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all'
                      }}
                    >
                      {JSON.stringify(ep.responseBody, null, 2)}
                    </Paper>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Box>
  );
};
