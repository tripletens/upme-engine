import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  Stack,
  Avatar,
  Divider,
  Container,
  Grid
} from '@mui/material';
import FoundationIcon from '@mui/icons-material/Foundation';
import EngineeringIcon from '@mui/icons-material/Engineering';
import SecurityIcon from '@mui/icons-material/Security';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ApartmentIcon from '@mui/icons-material/Apartment';
import VerifiedIcon from '@mui/icons-material/Verified';

interface LytHomesLoginViewProps {
  onLoginSuccess: (user: any) => void;
}

export const LytHomesLoginView: React.FC<LytHomesLoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const preconfiguredEngineStaff = [
    {
      name: 'Engr. Michael Vance',
      email: 'md.vance@lythomes.com',
      role: 'Managing Director & Principal Architect',
      dept: 'LytHomes Executive Board',
      isSystemAdmin: true,
      allowedCategory: 'ALL'
    },
    {
      name: 'Engr. Sarah Jenkins',
      email: 'sarah.jenkins@lythomes.com',
      role: 'Head of Structural Engineering',
      dept: 'Commercial Towers',
      isSystemAdmin: false,
      allowedCategory: 'COMMERCIAL_TOWER'
    },
    {
      name: 'Arch. Kenneth Nwosu',
      email: 'kenneth.nwosu@lythomes.com',
      role: 'Residential Estates Director',
      dept: 'Residential Estates & Villas',
      isSystemAdmin: false,
      allowedCategory: 'RESIDENTIAL_ESTATE'
    },
    {
      name: 'Engr. Tunde Bakare',
      email: 'tunde.bakare@lythomes.com',
      role: 'Civil Infrastructure & Roads Lead',
      dept: 'Civil Infrastructure & Microgrids',
      isSystemAdmin: false,
      allowedCategory: 'CIVIL_INFRASTRUCTURE'
    },
    {
      name: 'Mrs. Amaka Obi',
      email: 'amaka.obi@lythomes.com',
      role: 'Chief Quantity Surveyor & BOQ Auditor',
      dept: 'Logistics Parks & Warehousing',
      isSystemAdmin: false,
      allowedCategory: 'INDUSTRIAL_PARK'
    }
  ];

  const handleSelectPreconfiguredUser = (staff: any) => {
    setEmail(staff.email);
    setPassword('password123');
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const matched = preconfiguredEngineStaff.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (matched) {
        setLoading(false);
        onLoginSuccess(matched);
      } else {
        const fallbackUser = {
          name: email.split('@')[0].toUpperCase(),
          email: email,
          role: 'Site Civil Engineer',
          dept: 'LytHomes Field Division',
          isSystemAdmin: false,
          allowedCategory: 'ALL'
        };
        setLoading(false);
        onLoginSuccess(fallbackUser);
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Failed to authenticate with UPME Engine server. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        p: { xs: 2, sm: 3, md: 4 },
        boxSizing: 'border-box'
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={3} alignItems="center">
          {/* Left Hero Branding Section */}
          <Grid item xs={12} md={5}>
            <Box sx={{ color: '#ffffff', mb: { xs: 2, md: 0 } }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4)',
                  mb: 2.5
                }}
              >
                <FoundationIcon sx={{ color: '#ffffff', fontSize: 34 }} />
              </Box>

              <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -1, mb: 1, fontSize: { xs: '1.8rem', sm: '2.4rem' } }}>
                LytHomes Construction
              </Typography>

              <Typography variant="body1" sx={{ color: '#94a3b8', mb: 3, fontSize: '0.92rem', lineHeight: 1.6 }}>
                Multi-Tenant Civil & Building Infrastructure Management Portal.
              </Typography>

              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <VerifiedIcon sx={{ color: '#10b981', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 700, fontSize: '0.85rem' }}>
                    Live Engine Integration
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <EngineeringIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 700, fontSize: '0.85rem' }}>
                    COREN Registered Quality Audits
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <ApartmentIcon sx={{ color: '#6366f1', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 700, fontSize: '0.85rem' }}>
                    Naira BOQ Budgeting (₦)
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Right Login Card & Staff Demo Quick-Select */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: '24px',
                background: '#ffffff',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
                border: '1px solid #cbd5e1'
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', mb: 0.5, fontSize: '1.25rem' }}>
                Engineering Staff Sign In
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 3, fontSize: '0.82rem' }}>
                Select a pre-configured LytHomes engineer below or enter credentials.
              </Typography>

              {errorMsg && (
                <Alert severity="error" sx={{ mb: 2.5, borderRadius: '12px', fontSize: '0.82rem' }}>
                  {errorMsg}
                </Alert>
              )}

              {/* Pre-configured Demo Staff Accounts Cards */}
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, mb: 1.5, display: 'block', letterSpacing: 0.5 }}>
                PRE-CONFIGURED LYTHOMES STAFF ACCOUNTS:
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3, maxHeight: 220, overflowY: 'auto', pr: 0.5 }}>
                {preconfiguredEngineStaff.map((staff) => (
                  <Paper
                    key={staff.email}
                    onClick={() => handleSelectPreconfiguredUser(staff)}
                    elevation={0}
                    sx={{
                      p: 1.2,
                      px: 1.8,
                      borderRadius: '12px',
                      border: '1px solid',
                      borderColor: email === staff.email ? '#f59e0b' : '#e2e8f0',
                      background: email === staff.email ? '#fffbeb' : '#f8fafc',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      transition: 'all 0.2s ease',
                      '&:hover': { borderColor: '#f59e0b', background: '#fffbeb' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, minWidth: 0 }}>
                      <Avatar sx={{ width: 32, height: 32, background: staff.isSystemAdmin ? '#f59e0b' : '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>
                        {staff.name.slice(0, 2).toUpperCase()}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.82rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {staff.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem', display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {staff.role}
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      label={staff.isSystemAdmin ? 'ADMIN' : 'ENGINEER'}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.6rem',
                        fontWeight: 800,
                        background: staff.isSystemAdmin ? '#f59e0b' : '#e2e8f0',
                        color: staff.isSystemAdmin ? '#ffffff' : '#475569',
                        whiteSpace: 'nowrap'
                      }}
                    />
                  </Paper>
                ))}
              </Box>

              <Divider sx={{ my: 2 }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>
                  OR ENTER CREDENTIALS
                </Typography>
              </Divider>

              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Work Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <EmailOutlinedIcon sx={{ color: '#94a3b8', mr: 1, fontSize: 20 }} />
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <LockOutlinedIcon sx={{ color: '#94a3b8', mr: 1, fontSize: 20 }} />
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    textTransform: 'none',
                    borderRadius: '10px',
                    height: 42,
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
                    '&:hover': { background: '#d97706' }
                  }}
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : 'Authenticate Staff Session'}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
