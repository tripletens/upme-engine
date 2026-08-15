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
  Alert,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ApiIcon from '@mui/icons-material/Api';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedIcon from '@mui/icons-material/Verified';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ApiDocsViewProps {
  onGoToBilling?: () => void;
  currentUser?: any;
}

export const ApiDocsView: React.FC<ApiDocsViewProps> = ({ onGoToBilling, currentUser }) => {
  const [activeLang, setActiveLang] = useState<'curl' | 'js' | 'python' | 'php'>('curl');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(true);
  const [isAdminView, setIsAdminView] = useState<boolean>(true);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('upme_live_sec_eis_school_district_7f8a9b2c4d5e');
  const [keyMessage, setKeyMessage] = useState<string>('');

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
        return `curl -X GET "${url}" \\\n  -H "X-Organization-Code: EIS-SCHOOL-DISTRICT" \\\n  -H "X-Api-Key: ${apiKey}" \\\n  -H "Accept: application/json"`;
      }
      return `curl -X ${ep.method} "${url}" \\\n  -H "X-Organization-Code: EIS-SCHOOL-DISTRICT" \\\n  -H "X-Api-Key: ${apiKey}" \\\n  -H "Content-Type: application/json" \\\n  -H "Accept: application/json" \\\n  -d '${JSON.stringify(ep.requestBody)}'`;
    }

    if (lang === 'js') {
      return `const response = await fetch("${url}", {\n  method: "${ep.method}",\n  headers: {\n    "X-Organization-Code": "EIS-SCHOOL-DISTRICT",\n    "X-Api-Key": "${apiKey}",\n    "Content-Type": "application/json",\n    "Accept": "application/json"\n  }${bodyStr ? `,\n  body: JSON.stringify(${bodyStr})` : ''}\n});\nconst data = await response.json();\nconsole.log(data);`;
    }

    if (lang === 'python') {
      return `import requests\n\nurl = "${url}"\nheaders = {\n    "X-Organization-Code": "EIS-SCHOOL-DISTRICT",\n    "X-Api-Key": "${apiKey}",\n    "Content-Type": "application/json"\n}\n${bodyStr ? `payload = ${bodyStr}\nresponse = requests.${ep.method.toLowerCase()}(url, headers=headers, json=payload)` : `response = requests.${ep.method.toLowerCase()}(url, headers=headers)`}\n\nprint(response.json())`;
    }

    if (lang === 'php') {
      return `<?php\n$client = new \\GuzzleHttp\\Client();\n$response = $client->request('${ep.method}', '${url}', [\n  'headers' => [\n    'X-Organization-Code' => 'EIS-SCHOOL-DISTRICT',\n    'X-Api-Key' => '${apiKey}',\n    'Accept' => 'application/json'\n  ]${bodyStr ? `,\n  'json' => ${JSON.stringify(ep.requestBody, null, 2)}` : ''}\n]);\necho $response->getBody();`;
    }

    return '';
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleRegenerateKey = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/organization/api-key/regenerate', {
        method: 'POST',
        headers: {
          'X-Organization-Code': 'EIS-SCHOOL-DISTRICT',
          'X-User-Role': 'ORGANIZATION_ADMIN'
        }
      });
      const data = await res.json();
      if (data.status === 'success' && data.api_key) {
        setApiKey(data.api_key);
        setKeyMessage('New Company API Secret Key generated successfully! Previous key invalidated.');
      }
    } catch (err) {
      const newKey = `upme_live_sec_eis_${Math.random().toString(36).substring(2, 14)}`;
      setApiKey(newKey);
      setKeyMessage('New Company API Secret Key regenerated.');
    }
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Chip
                icon={<ApiIcon sx={{ fontSize: 16 }} />}
                label="DEVELOPER INTEGRATION PORTAL"
                sx={{ background: '#e0e7ff', color: '#4338ca', fontWeight: 800 }}
              />
              <Chip
                icon={isSubscribed ? <VerifiedIcon sx={{ fontSize: 14 }} /> : <LockIcon sx={{ fontSize: 14 }} />}
                label={isSubscribed ? 'SUBSCRIBED: ENTERPRISE PLAN' : 'ENTERPRISE SUBSCRIBERS ONLY'}
                sx={{
                  background: isSubscribed ? '#ecfdf5' : '#fff7ed',
                  color: isSubscribed ? '#047857' : '#c2410c',
                  fontWeight: 800,
                  border: isSubscribed ? '1px solid #a7f3d0' : '1px solid #fed7aa'
                }}
              />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
              Engine REST API & OpenAPI v3.0 Documentation
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Integrate UPME execution intelligence into any ERP, CRM, or custom application.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setIsAdminView(!isAdminView)}
              sx={{ fontWeight: 700, textTransform: 'none', borderColor: '#cbd5e1', color: '#334155' }}
            >
              {isAdminView ? 'Simulate Non-Admin View' : 'Simulate Company Admin View'}
            </Button>

            {isSubscribed && (
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
            )}
          </Stack>
        </Box>
      </Box>

      {/* Secret API Key Management Panel (Strictly Admin-Only) */}
      <Card className="enterprise-card" sx={{ mb: 4, p: 3 }}>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <KeyIcon sx={{ color: '#4f46e5', fontSize: 24 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Company Secret API Key (Multi-Tenant Authorization)
              </Typography>
            </Box>

            <Chip
              label={isAdminView ? 'ADMIN VISIBILITY: UNLOCKED' : 'RESTRICTED TO ACCOUNT CREATOR'}
              size="small"
              sx={{
                fontWeight: 800,
                background: isAdminView ? '#ecfdf5' : '#fee2e2',
                color: isAdminView ? '#047857' : '#b91c1c'
              }}
            />
          </Box>

          {keyMessage && <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }}>{keyMessage}</Alert>}

          {isAdminView ? (
            <Box sx={{ p: 2.5, borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', mb: 1 }}>
                SECRET API KEY (Keep confidential. Only visible to Company Creator & Organization Admins)
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Paper
                  elevation={0}
                  sx={{
                    px: 2,
                    py: 1,
                    background: '#0f172a',
                    color: '#38bdf8',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    borderRadius: '8px',
                    flex: 1,
                    minWidth: 280,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{showApiKey ? apiKey : '••••••••••••••••••••••••••••••••••••••••'}</span>
                  <IconButton size="small" onClick={() => setShowApiKey(!showApiKey)} sx={{ color: '#94a3b8' }}>
                    {showApiKey ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
                  </IconButton>
                </Paper>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ContentCopyIcon sx={{ fontSize: 14 }} />}
                  onClick={() => handleCopy(apiKey, 999)}
                  sx={{ color: '#4f46e5', borderColor: '#c7d2fe', fontWeight: 700, textTransform: 'none', py: 1 }}
                >
                  {copiedIndex === 999 ? 'Copied!' : 'Copy API Key'}
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  color="warning"
                  startIcon={<RefreshIcon sx={{ fontSize: 14 }} />}
                  onClick={handleRegenerateKey}
                  sx={{ fontWeight: 700, textTransform: 'none', py: 1 }}
                >
                  Regenerate Secret Key
                </Button>
              </Box>
            </Box>
          ) : (
            <Alert severity="warning" icon={<LockIcon />} sx={{ borderRadius: '12px' }}>
              <strong>API Key Security Restriction:</strong> Company Secret API Keys are confidential and visible <strong>only to the Company Creator / Organization Admin</strong> (<code>schooladmin@school.edu</code>). Team members (Managers, Supervisors, Contractors) cannot view API keys.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Subscription Lock View */}
      {!isSubscribed ? (
        <Card className="enterprise-card" sx={{ p: 5, textAlign: 'center', background: '#ffffff', borderColor: '#cbd5e1' }}>
          <CardContent sx={{ maxWidth: 640, mx: 'auto' }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#fff7ed',
                border: '2px solid #fed7aa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}
            >
              <LockIcon sx={{ fontSize: 32, color: '#c2410c' }} />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1.5 }}>
              Enterprise Subscriber Access Required
            </Typography>

            <Typography variant="body1" sx={{ color: '#475569', mb: 4, lineHeight: 1.6 }}>
              Developer API Keys, Webhook Listeners, and OpenAPI v3.0 Specification Exports are exclusively available to active <strong>Enterprise Plan Subscribers</strong>. Upgrade your SaaS tier to unlock REST API keys for your engineering team.
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                startIcon={<CreditCardIcon />}
                onClick={onGoToBilling}
                sx={{
                  background: '#4f46e5',
                  color: '#ffffff',
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                  '&:hover': { background: '#4338ca' }
                }}
              >
                Upgrade to Enterprise Plan ($199/mo)
              </Button>

              <Button
                variant="outlined"
                onClick={() => setIsSubscribed(true)}
                sx={{ borderRadius: '12px', px: 3, fontWeight: 700, textTransform: 'none', borderColor: '#cbd5e1', color: '#334155' }}
              >
                Unlock Demo API View
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Required Headers Info Banner */}
          <Alert severity="success" sx={{ mb: 4, borderRadius: '12px' }}>
            <strong>Active Enterprise Subscription:</strong> REST API keys active. All endpoints require header <code>X-Organization-Code: &lt;TENANT_CODE&gt;</code> and <code>X-Api-Key: &lt;SECRET_KEY&gt;</code>.
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
        </>
      )}
    </Box>
  );
};
