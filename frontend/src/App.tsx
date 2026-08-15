import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Chip,
  Grid,
  Card,
  CardContent,
  Alert,
  Divider,
  Button
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import WarningIcon from '@mui/icons-material/Warning';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import {
  schoolLabProjectDemo,
  schoolLabMilestones,
  schoolLabRisks,
  schoolLabIssues,
  schoolLabEvents
} from './data/schoolLabDemoData';
import { GanttTimeline } from './components/GanttTimeline';
import { LandingPage } from './pages/LandingPage';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [project] = useState(schoolLabProjectDemo);
  const [milestones] = useState(schoolLabMilestones);

  if (currentView === 'landing') {
    return <LandingPage onLaunchDashboard={() => setCurrentView('dashboard')} />;
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', pb: 8 }}>
      {/* Header Bar */}
      <AppBar position="static" elevation={0} sx={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <Toolbar sx={{ justifyContent: 'space-between', maxW: 'xl', mx: 'auto', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#fff',
                fontSize: '1.2rem'
              }}
            >
              U
            </Box>
            <Typography variant="h6" className="brand-title" sx={{ color: '#0f172a', fontWeight: 800, letterSpacing: -0.5 }}>
              UPME <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Engine v1.0</span>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<HomeIcon />}
              onClick={() => setCurrentView('landing')}
              sx={{ color: '#475569', borderColor: '#cbd5e1', textTransform: 'none', fontWeight: 600 }}
            >
              Back to Landing & Pricing
            </Button>

            <Chip
              label="Tenant: Example International School"
              sx={{ background: '#e0e7ff', color: '#4338ca', fontWeight: 700, border: '1px solid #c7d2fe' }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Project Title Banner */}
        <Box className="enterprise-card" sx={{ p: 4, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                {project.name}
              </Typography>
              <Chip label={project.code} size="small" sx={{ background: '#f1f5f9', color: '#334155', fontWeight: 700 }} />
              <Chip
                label={`HEALTH: ${project.healthStatus} (${project.overallHealthScore}/100)`}
                className="badge-on-track"
                sx={{ fontWeight: 700 }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              {project.description}
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            sx={{
              background: '#4f46e5',
              color: '#ffffff',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
              '&:hover': { background: '#4338ca' }
            }}
          >
            Recalculate Health & Variance
          </Button>
        </Box>

        {/* Executive Alerts */}
        <Alert
          severity="success"
          sx={{ mb: 4, background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', borderRadius: '12px' }}
        >
          <strong>Optimal Performance:</strong> Project is running on schedule. All predecessor milestones and deliverable evidences have been verified and approved.
        </Alert>

        {/* Top Metric Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="enterprise-card">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Overall Health Score</Typography>
                  <DashboardIcon sx={{ color: '#059669' }} />
                </Box>
                <Typography variant="h4" sx={{ color: '#059669', fontWeight: 800 }}>
                  {project.overallHealthScore} / 100
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>Status: ON_TRACK</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="enterprise-card">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Actual Progress</Typography>
                  <AssignmentTurnedInIcon sx={{ color: '#4f46e5' }} />
                </Box>
                <Typography variant="h4" sx={{ color: '#4f46e5', fontWeight: 800 }}>
                  {project.overallProgress}%
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>Planned Baseline: 65.0%</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="enterprise-card">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Schedule Variance</Typography>
                  <AccountTreeIcon sx={{ color: '#059669' }} />
                </Box>
                <Typography variant="h4" sx={{ color: '#059669', fontWeight: 800 }}>
                  0 Days
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>All Critical Path Tasks Active</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="enterprise-card">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Active Issues</Typography>
                  <CheckCircleIcon sx={{ color: '#059669' }} />
                </Box>
                <Typography variant="h4" sx={{ color: '#059669', fontWeight: 800 }}>
                  0 Open
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>All Issues Resolved</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content Layout */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <GanttTimeline milestones={milestones} />
          </Grid>

          <Grid item xs={12} lg={4}>
            {/* Risks & Issues Card */}
            <Box className="enterprise-card" sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 800, mb: 2 }}>
                ✅ Project Risk & Compliance Status
              </Typography>
              {schoolLabIssues.length === 0 ? (
                <Box sx={{ p: 2, borderRadius: '10px', background: '#ecfdf5', border: '1px solid #a7f3d0', textAlign: 'center' }}>
                  <Typography variant="subtitle2" sx={{ color: '#047857', fontWeight: 700 }}>
                    No Active Critical Issues
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.8rem', mt: 0.5 }}>
                    All procurement and delivery holds have been resolved.
                  </Typography>
                </Box>
              ) : (
                schoolLabIssues.map((issue) => (
                  <Box key={issue.id} sx={{ p: 2, borderRadius: '10px', background: '#fef2f2', border: '1px solid #fecaca', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#b91c1c', fontWeight: 700 }}>
                      {issue.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.8rem', mt: 0.5 }}>
                      {issue.description}
                    </Typography>
                  </Box>
                ))
              )}

              <Divider sx={{ my: 2, borderColor: '#e2e8f0' }} />

              <Typography variant="subtitle2" sx={{ color: '#475569', fontWeight: 700, mb: 1 }}>
                Monitored Risks ({schoolLabRisks.length}):
              </Typography>
              {schoolLabRisks.map((risk) => (
                <Box key={risk.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>{risk.title}</Typography>
                  <Chip label={risk.status} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, background: '#ecfdf5', color: '#047857' }} />
                </Box>
              ))}
            </Box>

            {/* Audit Log Events Stream */}
            <Box className="enterprise-card" sx={{ p: 3, overflow: 'hidden' }}>
              <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 800, mb: 2 }}>
                📜 Audit Trail Stream
              </Typography>
              {schoolLabEvents.map((ev) => (
                <Box key={ev.id} sx={{ mb: 2, pb: 1, borderBottom: '1px dashed #e2e8f0', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                  <Typography variant="caption" sx={{ color: '#4f46e5', fontWeight: 700, display: 'block' }}>
                    {ev.eventType}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.78rem', wordBreak: 'break-word', overflowWrap: 'anywhere', my: 0.5 }}>
                    {ev.payload.message || JSON.stringify(ev.payload)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem', display: 'block' }}>
                    {ev.createdAt}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default App;
