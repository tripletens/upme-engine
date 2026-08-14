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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { PricingSection } from '../components/PricingSection';

interface LandingPageProps {
  onLaunchDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDashboard }) => {
  const [selectedDomain, setSelectedDomain] = useState<'education' | 'construction' | 'software'>('education');

  return (
    <Box sx={{ minHeight: '100vh', background: '#ffffff', color: '#0f172a' }}>
      {/* Navigation Header */}
      <AppBar position="sticky" elevation={0} sx={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #e2e8f0' }}>
        <Toolbar sx={{ justifyContent: 'space-between', maxW: 'lg', mx: 'auto', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
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
            <Typography variant="h5" className="brand-title" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: -0.5 }}>
              UPME <span style={{ fontSize: '0.85rem', color: '#4f46e5', fontWeight: 600 }}>Enterprise</span>
            </Typography>
          </Box>

          <Stack direction="row" spacing={3} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Typography component="a" href="#features" sx={{ color: '#475569', textDecoration: 'none', fontWeight: 500, '&:hover': { color: '#4f46e5' } }}>Features</Typography>
            <Typography component="a" href="#templates" sx={{ color: '#475569', textDecoration: 'none', fontWeight: 500, '&:hover': { color: '#4f46e5' } }}>Templates</Typography>
            <Typography component="a" href="#pricing" sx={{ color: '#475569', textDecoration: 'none', fontWeight: 500, '&:hover': { color: '#4f46e5' } }}>Pricing</Typography>
            
            <Button
              variant="contained"
              onClick={onLaunchDashboard}
              endIcon={<ArrowForwardIcon />}
              sx={{
                background: '#4f46e5',
                color: '#ffffff',
                borderRadius: '10px',
                px: 3,
                py: 1,
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
                '&:hover': { background: '#4338ca' }
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
          label="UNIVERSAL PROJECT MONITORING ENGINE (UPME)"
          sx={{ background: '#e0e7ff', color: '#4338ca', fontWeight: 700, mb: 3, px: 1, py: 2 }}
        />

        <Typography variant="h2" sx={{ fontWeight: 800, color: '#0f172a', mb: 3, lineHeight: 1.15, fontSize: { xs: '2.5rem', md: '4rem' }, letterSpacing: '-0.02em' }}>
          Real-Time Health Scoring & <br />
          <span style={{ color: '#4f46e5' }}>
            Predictive Delay Propagation
          </span>
        </Typography>

        <Typography variant="h6" sx={{ color: '#475569', maxWidth: 800, mx: 'auto', mb: 5, fontWeight: 400, lineHeight: 1.6 }}>
          The domain-agnostic B2B platform that turns project uncertainty into algorithmic clarity. Track schedule variance, verify deliverable evidence, enforce multi-tenant isolation, and stop project overruns before they happen.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            onClick={onLaunchDashboard}
            endIcon={<ArrowForwardIcon />}
            sx={{
              background: '#4f46e5',
              color: '#ffffff',
              borderRadius: '12px',
              px: 4,
              py: 1.8,
              fontSize: '1.05rem',
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0 6px 20px rgba(79, 70, 229, 0.35)',
              '&:hover': { background: '#4338ca' }
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
              color: '#0f172a',
              borderColor: '#cbd5e1',
              borderRadius: '12px',
              px: 4,
              py: 1.8,
              fontSize: '1.05rem',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { borderColor: '#4f46e5', background: '#f1f5f9' }
            }}
          >
            View Paystack Subscriptions
          </Button>
        </Stack>
      </Container>

      {/* Domain Template Switcher Section */}
      <Box id="templates" sx={{ py: 10, background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
              One Engine. Any Industry.
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#475569' }}>
              Select a domain template to preview how UPME structures project baselines dynamically:
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4, flexWrap: 'wrap', gap: 1 }}>
              <Button
                variant={selectedDomain === 'education' ? 'contained' : 'outlined'}
                startIcon={<SchoolIcon />}
                onClick={() => setSelectedDomain('education')}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  background: selectedDomain === 'education' ? '#4f46e5' : '#ffffff',
                  color: selectedDomain === 'education' ? '#ffffff' : '#475569',
                  borderColor: '#cbd5e1'
                }}
              >
                Education (School Lab Rollout)
              </Button>
              <Button
                variant={selectedDomain === 'construction' ? 'contained' : 'outlined'}
                startIcon={<ConstructionIcon />}
                onClick={() => setSelectedDomain('construction')}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  background: selectedDomain === 'construction' ? '#4f46e5' : '#ffffff',
                  color: selectedDomain === 'construction' ? '#ffffff' : '#475569',
                  borderColor: '#cbd5e1'
                }}
              >
                Construction Site Prep
              </Button>
              <Button
                variant={selectedDomain === 'software' ? 'contained' : 'outlined'}
                startIcon={<CodeIcon />}
                onClick={() => setSelectedDomain('software')}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  background: selectedDomain === 'software' ? '#4f46e5' : '#ffffff',
                  color: selectedDomain === 'software' ? '#ffffff' : '#475569',
                  borderColor: '#cbd5e1'
                }}
              >
                Software Enterprise Release
              </Button>
            </Stack>
          </Box>

          {/* Template Live Preview Card */}
          <Card className="enterprise-card" sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ color: '#4f46e5', fontWeight: 800, mb: 1 }}>
              {selectedDomain === 'education' && '🏫 School Computer Science Laboratory Setup'}
              {selectedDomain === 'construction' && '🏗️ Commercial Construction Site Preparation'}
              {selectedDomain === 'software' && '💻 Enterprise Software Development Release Lifecycle'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569', mb: 3 }}>
              {selectedDomain === 'education' && 'Milestones: 1. Planning & Budget → 2. Hardware Procurement → 3. Room Electrical Prep → 4. PC Installation & Subnet Config.'}
              {selectedDomain === 'construction' && 'Milestones: 1. Soil & Topographic Survey → 2. Site Demolition → 3. Earthwork Excavation → 4. Rebar Foundation Binding.'}
              {selectedDomain === 'software' && 'Milestones: 1. Architecture Spec & DB Schema → 2. Core Backend REST APIs → 3. E2E Automation Testing → 4. Production Deployment.'}
            </Typography>

            <Grid container spacing={2}>
              {[
                '1. Predecessor Activity Linked',
                '2. Graph Delay Propagation Enabled',
                '3. Evidence Approval Required',
                '4. Automated Risk → Issue Transition'
              ].map((item, idx) => (
                <Grid item xs={12} sm={6} md={3} key={idx}>
                  <Box sx={{ p: 2, borderRadius: '12px', background: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircleIcon sx={{ color: '#059669', fontSize: 18 }} />
                    <Typography variant="subtitle2" sx={{ color: '#0f172a', fontWeight: 600, fontSize: '0.85rem' }}>
                      {item}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Container>
      </Box>

      {/* Core Features Section */}
      <Container id="features" maxWidth="lg" sx={{ py: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
            Engineered for Governance & Precision
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#475569' }}>
            Built on Clean Architecture, multi-tenant RBAC, and mathematical health evaluation.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card className="enterprise-card" sx={{ p: 2, height: '100%' }}>
              <CardContent>
                <Box sx={{ width: 50, height: 50, borderRadius: '12px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <SpeedIcon sx={{ color: '#4f46e5', fontSize: 28 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#0f172a' }}>
                  Deterministic Health Score (0 - 100)
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.7 }}>
                  No more subjective project status updates. UPME evaluates Schedule Variance (30%), Progress (25%), Issue Severity (20%), Risk (15%), and Deliverable Approvals (10%) to calculate exact health scores automatically.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className="enterprise-card" sx={{ p: 2, height: '100%' }}>
              <CardContent>
                <Box sx={{ width: 50, height: 50, borderRadius: '12px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <AccountTreeIcon sx={{ color: '#0284c7', fontSize: 28 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#0f172a' }}>
                  Graph Delay Propagation (Kahn's DAG)
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.7 }}>
                  When a predecessor activity slips, UPME calculates downstream expected completion shifts, flags successor tasks as BLOCKED, and alerts executive leadership before deadlines pass.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className="enterprise-card" sx={{ p: 2, height: '100%' }}>
              <CardContent>
                <Box sx={{ width: 50, height: 50, borderRadius: '12px', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <VerifiedUserIcon sx={{ color: '#059669', fontSize: 28 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#0f172a' }}>
                  Audit-Grade Evidence Approvals
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.7 }}>
                  Require contractors and team leads to upload verification assets (PDF inspection certificates, photos, waybills) before deliverables can be signed off by authorized supervisors.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className="enterprise-card" sx={{ p: 2, height: '100%' }}>
              <CardContent>
                <Box sx={{ width: 50, height: 50, borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <AssessmentIcon sx={{ color: '#d97706', fontSize: 28 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#0f172a' }}>
                  Corporate KYC & Redis RBAC Isolation
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.7 }}>
                  Multi-tenant discriminator isolation, sub-millisecond Redis permission caching ($O(1)$ lookup speed), and corporate KYC verification state machines (`UNVERIFIED` → `VERIFIED`).
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Paystack Pricing Section */}
      <Box id="pricing" sx={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <PricingSection />
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, background: '#ffffff', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
            © 2026 Universal Project Monitoring Engine (UPME). Published on GitHub: <a href="https://github.com/tripletens/upme-engine" target="_blank" rel="noreferrer" style={{ color: '#4f46e5', fontWeight: 600 }}>tripletens/upme-engine</a>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
