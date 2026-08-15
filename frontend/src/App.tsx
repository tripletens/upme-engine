import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  Alert,
  Divider,
  Button,
  Stack
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import {
  schoolLabProjectDemo,
  schoolLabMilestones,
  schoolLabRisks,
  schoolLabIssues,
  schoolLabEvents
} from './data/schoolLabDemoData';
import { GanttTimeline } from './components/GanttTimeline';
import { LandingPage } from './pages/LandingPage';
import { SidebarNav } from './components/SidebarNav';
import { HealthBreakdownModal } from './components/HealthBreakdownModal';
import { KycPortalModal } from './components/KycPortalModal';
import { CreateTemplateModal } from './components/CreateTemplateModal';
import { PricingSection } from './components/PricingSection';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [project, setProject] = useState<any>(schoolLabProjectDemo);
  const [milestones] = useState(schoolLabMilestones);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentOrganization, setCurrentOrganization] = useState<any>(null);
  const [healthModalOpen, setHealthModalOpen] = useState(false);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [kycStatus, setKycStatus] = useState('VERIFIED');

  const handleLoginSuccess = (user: any, organization: any) => {
    setCurrentUser(user);
    setCurrentOrganization(organization);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentOrganization(null);
    setCurrentView('landing');
  };

  const handleExportCsv = () => {
    window.open('http://127.0.0.1:8000/api/v1/projects/proj-cs-lab-001/report/export', '_blank');
  };

  const handleExportPdf = () => {
    window.open('http://127.0.0.1:8000/api/v1/projects/proj-cs-lab-001/report/pdf', '_blank');
  };

  if (currentView === 'landing') {
    return (
      <LandingPage
        onLaunchDashboard={() => setCurrentView('dashboard')}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Fixed Sidebar Navigation */}
      <SidebarNav
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        currentUser={currentUser}
        currentOrganization={currentOrganization}
        kycStatus={kycStatus}
        onOpenKyc={() => setKycModalOpen(true)}
        onOpenNewProject={() => setTemplateModalOpen(true)}
        onGoToLanding={() => setCurrentView('landing')}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <Box sx={{ flex: 1, p: 4, overflowX: 'hidden' }}>
        <Container maxWidth="xl" disableGutters>
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
                  onClick={() => setHealthModalOpen(true)}
                  sx={{ fontWeight: 700, cursor: 'pointer' }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                {project.description}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={handleExportCsv}
                sx={{ color: '#334155', borderColor: '#cbd5e1', textTransform: 'none', fontWeight: 600 }}
              >
                Export CSV
              </Button>

              <Button
                variant="outlined"
                size="small"
                startIcon={<PictureAsPdfIcon />}
                onClick={handleExportPdf}
                sx={{ color: '#0284c7', borderColor: '#bae6fd', textTransform: 'none', fontWeight: 600 }}
              >
                Executive PDF
              </Button>

              <Button
                variant="contained"
                size="small"
                startIcon={<RefreshIcon />}
                sx={{
                  background: '#4f46e5',
                  color: '#ffffff',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
                  '&:hover': { background: '#4338ca' }
                }}
              >
                Recalculate
              </Button>
            </Stack>
          </Box>

          {/* Tab View Routing */}
          {activeTab === 'billing' ? (
            <PricingSection />
          ) : (
            <>
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
                  <Card
                    className="enterprise-card"
                    onClick={() => setHealthModalOpen(true)}
                    sx={{ cursor: 'pointer', position: 'relative', '&:hover': { borderColor: '#4f46e5' } }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Overall Health Score</Typography>
                        <DashboardIcon sx={{ color: '#059669' }} />
                      </Box>
                      <Typography variant="h4" sx={{ color: '#059669', fontWeight: 800 }}>
                        {project.overallHealthScore} / 100
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>Status: ON_TRACK</Typography>
                        <Typography variant="caption" sx={{ color: '#4f46e5', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.3 }}>
                          <InfoOutlinedIcon sx={{ fontSize: 13 }} /> Formula Breakdown
                        </Typography>
                      </Box>
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
            </>
          )}
        </Container>
      </Box>

      {/* Health Formula Breakdown Modal */}
      <HealthBreakdownModal
        open={healthModalOpen || activeTab === 'health_rules'}
        onClose={() => {
          setHealthModalOpen(false);
          if (activeTab === 'health_rules') setActiveTab('dashboard');
        }}
        overallScore={project.overallHealthScore}
        healthStatus={project.healthStatus}
      />

      {/* Corporate KYC Verification Modal */}
      <KycPortalModal
        open={kycModalOpen}
        onClose={() => setKycModalOpen(false)}
        currentKycStatus={kycStatus}
        onKycUpdated={(st) => setKycStatus(st)}
      />

      {/* Project Baseline Template Creator Modal */}
      <CreateTemplateModal
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        onProjectCreated={(newProj) => setProject(newProj)}
      />
    </Box>
  );
};

export default App;
