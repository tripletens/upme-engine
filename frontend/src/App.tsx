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
    <Box sx={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', pb: 8 }}>
      {/* Header Bar */}
      <AppBar position="static" sx={{ background: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
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
            <Typography variant="h6" className="brand-title" sx={{ color: '#fff', fontWeight: 700, letterSpacing: 0.5 }}>
              UPME <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 400 }}>Engine v1.0</span>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<HomeIcon />}
              onClick={() => setCurrentView('landing')}
              sx={{ color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.2)', textTransform: 'none' }}
            >
              Back to Landing & Pricing
            </Button>

            <Chip
              label="Tenant: Example International School"
              sx={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Project Title Banner */}
        <Box className="glass-card" sx={{ p: 3, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                {project.name}
              </Typography>
              <Chip label={project.code} size="small" sx={{ background: 'rgba(255,255,255,0.1)', color: '#cbd5e1' }} />
              <Chip
                label={`HEALTH: ${project.healthStatus} (${project.overallHealthScore}/100)`}
                className={project.healthStatus === 'AT_RISK' ? 'badge-at-risk' : 'badge-on-track'}
                sx={{ fontWeight: 700 }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              {project.description}
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Recalculate Health & Variance
          </Button>
        </Box>

        {/* Executive Alerts */}
        <Alert
          severity="warning"
          sx={{ mb: 4, background: 'rgba(245, 158, 11, 0.12)', color: '#fde68a', border: '1px solid rgba(245, 158, 11, 0.3)' }}
        >
          <strong>Monitoring Warning:</strong> Computer Procurement is 9 days behind baseline schedule, blocking downstream Equipment Installation and Network Setup activities.
        </Alert>

        {/* Top Metric Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="glass-card">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>Overall Health Score</Typography>
                  <DashboardIcon sx={{ color: '#fb923c' }} />
                </Box>
                <Typography variant="h4" sx={{ color: '#fb923c', fontWeight: 800 }}>
                  {project.overallHealthScore} / 100
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>Status: AT_RISK</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="glass-card">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>Actual Progress</Typography>
                  <AssignmentTurnedInIcon sx={{ color: '#818cf8' }} />
                </Box>
                <Typography variant="h4" sx={{ color: '#818cf8', fontWeight: 800 }}>
                  {project.overallProgress}%
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>Planned Baseline: 51.0%</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="glass-card">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>Schedule Variance</Typography>
                  <AccountTreeIcon sx={{ color: '#ef4444' }} />
                </Box>
                <Typography variant="h4" sx={{ color: '#f87171', fontWeight: 800 }}>
                  -9 Days
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>1 Critical Path Activity Blocked</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="glass-card">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>Active Issues</Typography>
                  <WarningIcon sx={{ color: '#ef4444' }} />
                </Box>
                <Typography variant="h4" sx={{ color: '#f87171', fontWeight: 800 }}>
                  {schoolLabIssues.length} Critical
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>Port Customs Clearing Hold</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content Layout */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            {/* Timeline & Gantt */}
            <GanttTimeline milestones={milestones} />
          </Grid>

          <Grid item xs={12} lg={4}>
            {/* Risks & Issues Card */}
            <Box className="glass-card" sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 700, mb: 2 }}>
                ⚠️ Active Risks & Issues
              </Typography>
              {schoolLabIssues.map((issue) => (
                <Box key={issue.id} sx={{ p: 2, borderRadius: 2, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#f87171', fontWeight: 700 }}>
                    {issue.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.8rem', mt: 0.5 }}>
                    {issue.description}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

              <Typography variant="subtitle2" sx={{ color: '#cbd5e1', fontWeight: 600, mb: 1 }}>
                Identified Risks ({schoolLabRisks.length}):
              </Typography>
              {schoolLabRisks.map((risk) => (
                <Box key={risk.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>{risk.title}</Typography>
                  <Chip label={risk.status} size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
                </Box>
              ))}
            </Box>

            {/* Audit Log Events Stream */}
            <Box className="glass-card" sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 700, mb: 2 }}>
                📜 Audit Trail Stream
              </Typography>
              {schoolLabEvents.map((ev) => (
                <Box key={ev.id} sx={{ mb: 2, pb: 1, borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                  <Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 700 }}>
                    {ev.eventType}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.78rem' }}>
                    {ev.payload.message || JSON.stringify(ev.payload)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
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
