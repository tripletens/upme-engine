import React, { useState } from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, Chip, AppBar, Toolbar, Stack } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SchoolIcon from '@mui/icons-material/School';
import ConstructionIcon from '@mui/icons-material/Construction';
import CodeIcon from '@mui/icons-material/Code';

import { PricingSection } from '../components/PricingSection';

interface LandingPageProps {
  onLaunchDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDashboard }) => {
  const [selectedDomain, setSelectedDomain] = useState<'education' | 'construction' | 'software'>('education');

  return (
    <Box sx={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc' }}>
      {/* Navigation Header */}
      <AppBar position="sticky" sx={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#fff',
                fontSize: '1.3rem'
              }}
            >
              U
            </Box>
            <Typography variant="h5" className="brand-title" sx={{ fontWeight: 800, color: '#fff', letterSpacing: 0.5 }}>
              UPME <span style={{ fontSize: '0.85rem', color: '#06b6d4', fontWeight: 600 }}>Platform</span>
            </Typography>
          </Box>

          <Stack direction="row" spacing={3} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Typography component="a" href="#features" sx={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: 500, '&:hover': { color: '#6366f1' } }}>Features</Typography>
            <Typography component="a" href="#templates" sx={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: 500, '&:hover': { color: '#6366f1' } }}>Templates</Typography>
            <Typography component="a" href="#pricing" sx={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: 500, '&:hover': { color: '#6366f1' } }}>Pricing</Typography>
            
            <Button
              variant="contained"
              onClick={onLaunchDashboard}
              endIcon={<ArrowForwardIcon />}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                borderRadius: '10px',
                px: 3,
                py: 1,
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
              }}
            >
              Launch Engine Dashboard
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 12, pb: 10, textAlign: 'center' }}>
        <Chip
          label="🚀 UNIVERSAL PROJECT MONITORING ENGINE (UPME)"
          sx={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontWeight: 700, mb: 3, px: 1, py: 2 }}
        />

        <Typography variant="h2" sx={{ fontWeight: 800, mb: 3, lineHeight: 1.15, fontSize: { xs: '2.5rem', md: '4rem' } }}>
          Real-Time Health Scoring & <br />
          <span style={{ background: 'linear-gradient(135deg, #818cf8 0%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Predictive Delay Propagation
          </span>
        </Typography>

        <Typography variant="h6" sx={{ color: '#94a3b8', maxWidth: 800, mx: 'auto', mb: 5, fontWeight: 400, lineHeight: 1.6 }}>
          The domain-agnostic B2B platform that turns project uncertainty into algorithmic clarity. Track schedule variance, verify deliverable evidence, enforce multi-tenant isolation, and stop project overruns before they happen.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            onClick={onLaunchDashboard}
            endIcon={<ArrowForwardIcon />}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              borderRadius: '12px',
              px: 4,
              py: 1.8,
              fontSize: '1.1rem',
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)'
            }}
          >
            Launch Interactive School Lab Demo
          </Button>

          <Button
            variant="outlined"
            size="large"
            component="a"
            href="#pricing"
            sx={{
              color: '#f8fafc',
              borderColor: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              px: 4,
              py: 1.8,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { borderColor: '#6366f1', background: 'rgba(99, 102, 241, 0.1)' }
            }}
          >
            View Paystack Subscriptions
          </Button>
        </Stack>
      </Container>

      {/* Domain Template Switcher Section */}
      <Box id="templates" sx={{ py: 8, background: 'rgba(30, 41, 59, 0.4)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
              One Engine. Any Industry.
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#94a3b8' }}>
              Select a domain template to preview how UPME structures project baselines dynamically:
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
              <Button
                variant={selectedDomain === 'education' ? 'contained' : 'outlined'}
                startIcon={<SchoolIcon />}
                onClick={() => setSelectedDomain('education')}
                sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
              >
                Education (School Lab Rollout)
              </Button>
              <Button
                variant={selectedDomain === 'construction' ? 'contained' : 'outlined'}
                startIcon={<ConstructionIcon />}
                onClick={() => setSelectedDomain('construction')}
                sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
              >
                Construction Site Prep
              </Button>
              <Button
                variant={selectedDomain === 'software' ? 'contained' : 'outlined'}
                startIcon={<CodeIcon />}
                onClick={() => setSelectedDomain('software')}
                sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
              >
                Software Enterprise Release
              </Button>
            </Stack>
          </Box>

          {/* Template Live Preview Card */}
          <Box className="glass-card" sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ color: '#818cf8', fontWeight: 700, mb: 1 }}>
              {selectedDomain === 'education' && '🏫 School Computer Science Laboratory Setup'}
              {selectedDomain === 'construction' && '🏗️ Commercial Construction Site Preparation'}
              {selectedDomain === 'software' && '💻 Enterprise Software Development Release Lifecycle'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 3 }}>
              {selectedDomain === 'education' && 'Milestones: 1. Planning & Budget → 2. Hardware Procurement → 3. Room Electrical Prep → 4. PC Installation & Subnet Config.'}
              {selectedDomain === 'construction' && 'Milestones: 1. Soil & Topographic Survey → 2. Site Demolition → 3. Earthwork Excavation → 4. Rebar Foundation Binding.'}
              {selectedDomain === 'software' && 'Milestones: 1. Architecture Spec & DB Schema → 2. Core Backend REST APIs → 3. E2E Automation Testing → 4. Production Deployment.'}
            </Typography>

            <Grid container spacing={2}>
              {['1. Predecessor Activity Linked', '2. Graph Delay Propagation Enabled', '3. Evidence Approval Required', '4. Automated Risk → Issue Transition'].map((item, idx) => (
                <Grid item xs={12} sm={6} md={3} key={idx}>
                  <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <Typography variant="subtitle2" sx={{ color: '#34d399', fontWeight: 700 }}>
                      {item}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Core Features Section */}
      <Container id="features" maxWidth="lg" sx={{ py: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            Engineered for Governance & Precision
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#94a3b8' }}>
            Built on Clean Architecture, multi-tenant RBAC, and mathematical health evaluation.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card className="glass-card" sx={{ p: 2, height: '100%' }}>
              <CardContent>
                <SpeedIcon sx={{ color: '#6366f1', fontSize: 40, mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#f8fafc' }}>
                  Deterministic Health Score $H \in [0, 100]$
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.7 }}>
                  No more subjective project status updates. UPME evaluates Schedule Variance ($30\%$), Progress ($25\%$), Issue Severity ($20\%$), Risk ($15\%$), and Deliverable Approvals ($10\%$) to calculate exact health scores automatically.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className="glass-card" sx={{ p: 2, height: '100%' }}>
              <CardContent>
                <AccountTreeIcon sx={{ color: '#06b6d4', fontSize: 40, mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#f8fafc' }}>
                  Graph Delay Propagation (Kahn's DAG)
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.7 }}>
                  When a predecessor activity slips, UPME calculates downstream expected completion shifts, flags successor tasks as BLOCKED, and alerts executive leadership before deadlines pass.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className="glass-card" sx={{ p: 2, height: '100%' }}>
              <CardContent>
                <VerifiedUserIcon sx={{ color: '#10b981', fontSize: 40, mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#f8fafc' }}>
                  Audit-Grade Evidence Approvals
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.7 }}>
                  Require contractors and team leads to upload verification assets (PDF inspection certificates, photos, waybills) before deliverables can be signed off by authorized supervisors.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className="glass-card" sx={{ p: 2, height: '100%' }}>
              <CardContent>
                <AssessmentIcon sx={{ color: '#f59e0b', fontSize: 40, mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#f8fafc' }}>
                  Corporate KYC & Redis RBAC Isolation
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.7 }}>
                  Multi-tenant discriminator isolation, sub-millisecond Redis permission caching ($O(1)$ lookup speed), and corporate KYC verification state machines (`UNVERIFIED` → `VERIFIED`).
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Paystack Pricing Section */}
      <Box id="pricing" sx={{ background: 'rgba(30, 41, 59, 0.3)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <PricingSection />
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
            © 2026 Universal Project Monitoring Engine (UPME). Published on GitHub: <a href="https://github.com/tripletens/upme-engine" target="_blank" rel="noreferrer" style={{ color: '#818cf8' }}>tripletens/upme-engine</a>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
