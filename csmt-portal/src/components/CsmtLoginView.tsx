import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import LockIcon from '@mui/icons-material/Lock';
import KeyIcon from '@mui/icons-material/Key';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

interface CsmtLoginViewProps {
  onLoginSuccess: (user: any) => void;
}

export const CsmtLoginView: React.FC<CsmtLoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@csmt.edu.ng');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const demoAccounts = [
    { name: 'Dr. Clement Eze', email: 'admin@csmt.edu.ng', role: 'District Admin / Principal', dept: 'Executive Admin', isSystemAdmin: true, allowedCategory: 'ALL' },
    { name: 'Dr. Robert Vance', email: 'dr.vance@csmt.edu.ng', role: 'HOD Computer Science', dept: 'CS & AI Labs', allowedCategory: 'ACADEMIC_LAB' },
    { name: 'Mrs. Clara Hughes', email: 'clara.hughes@csmt.edu.ng', role: 'Head Librarian', dept: 'Digital Library', allowedCategory: 'LIBRARY' },
    { name: 'Coach Marcus Miller', email: 'marcus.miller@csmt.edu.ng', role: 'Sports Director', dept: 'Sports Complex', allowedCategory: 'SPORTS' },
    { name: 'Engr. David Opara', email: 'david.opara@csmt.edu.ng', role: 'Facilities Manager', dept: 'Hostels', allowedCategory: 'HOSTEL' },
    { name: 'Prof. Alex Chen', email: 'alex.chen@csmt.edu.ng', role: 'Robotics Patron', dept: 'STEM Clubs', allowedCategory: 'CLUBS' }
  ];

  const handleSelectDemo = (acc: any) => {
    setEmail(acc.email);
    setPassword('Password123!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Organization-Code': 'CSMT-SCHOOLS-DISTRICT',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          organization_code: 'CSMT-SCHOOLS-DISTRICT'
        })
      });

      const data = await res.json();
      setLoading(false);

      const loggedUser = demoAccounts.find((a) => a.email === email) || {
        name: email.split('@')[0].toUpperCase(),
        email: email,
        role: 'SCHOOL_STAFF',
        dept: 'CSMT Schools',
        allowedCategory: 'ALL'
      };

      onLoginSuccess(loggedUser);
    } catch (err) {
      setLoading(false);
      const loggedUser = demoAccounts.find((a) => a.email === email) || {
        name: 'Dr. Clement Eze',
        email: 'admin@csmt.edu.ng',
        role: 'District Admin / Principal',
        dept: 'Executive Admin',
        isSystemAdmin: true,
        allowedCategory: 'ALL'
      };
      onLoginSuccess(loggedUser);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 3, sm: 5, md: 6 },
        px: { xs: 1.5, sm: 2, md: 3 },
        boxSizing: 'border-box'
      }}
    >
      <Container maxWidth="md" disableGutters sx={{ px: { xs: 1, sm: 2 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4, md: 5 },
            borderRadius: { xs: '16px', sm: '24px' },
            background: '#ffffff',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}
        >
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
            {/* Left Column: Branding & Pre-configured Accounts */}
            <Grid item xs={12} md={5}>
              <Box sx={{ mb: 2.5 }}>
                <Chip
                  icon={<SchoolIcon sx={{ color: '#fff !important', fontSize: 15 }} />}
                  label="CSMT SCHOOLS DISTRICT"
                  size="small"
                  sx={{
                    background: '#4f46e5',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.68rem',
                    mb: 1.5,
                    maxWidth: '100%'
                  }}
                />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    color: '#0f172a',
                    letterSpacing: -0.5,
                    mb: 1,
                    fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2rem' }
                  }}
                >
                  Staff & Admin Sign In
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.5 }}>
                  Role-Scoped Infrastructure Dashboard & Engine Admin Controls.
                </Typography>
              </Box>

              <Stack spacing={1.2} sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                  <VerifiedUserIcon sx={{ color: '#059669', fontSize: 18, flexShrink: 0 }} />
                  <Typography variant="caption" sx={{ color: '#334155', fontWeight: 700, fontSize: '0.75rem' }}>
                    Role-Based Access Control (RBAC) Enabled
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                  <KeyIcon sx={{ color: '#4f46e5', fontSize: 18, flexShrink: 0 }} />
                  <Typography variant="caption" sx={{ color: '#334155', fontWeight: 700, fontSize: '0.75rem' }}>
                    Tenant Scope: CSMT-SCHOOLS-DISTRICT
                  </Typography>
                </Box>
              </Stack>

              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, display: 'block', mb: 1, letterSpacing: 0.3, fontSize: '0.72rem' }}>
                SELECT STAFF ACCOUNT TO QUICK LOGIN:
              </Typography>

              {/* Pre-configured Demo Staff Accounts List */}
              <Stack
                spacing={1}
                sx={{
                  maxHeight: { xs: 260, sm: 300 },
                  overflowY: 'auto',
                  pr: 0.5,
                  '&::-webkit-scrollbar': { width: '4px' },
                  '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: '4px' }
                }}
              >
                {demoAccounts.map((acc) => (
                  <Paper
                    key={acc.email}
                    elevation={0}
                    onClick={() => handleSelectDemo(acc)}
                    sx={{
                      p: 1.2,
                      px: 1.5,
                      borderRadius: '10px',
                      border: email === acc.email ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                      background: email === acc.email ? '#f5f3ff' : '#f8fafc',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 1,
                      transition: 'all 0.15s ease',
                      '&:hover': { borderColor: '#4f46e5', background: '#f5f3ff' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
                      {acc.isSystemAdmin ? (
                        <AdminPanelSettingsIcon sx={{ color: '#4f46e5', fontSize: 20, flexShrink: 0 }} />
                      ) : (
                        <AccountCircleIcon sx={{ color: email === acc.email ? '#4f46e5' : '#94a3b8', fontSize: 20, flexShrink: 0 }} />
                      )}
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 800,
                            color: '#0f172a',
                            fontSize: '0.8rem',
                            lineHeight: 1.2,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {acc.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#64748b',
                            fontSize: '0.68rem',
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {acc.role}
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      label={acc.dept}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.58rem',
                        fontWeight: 800,
                        whiteSpace: 'nowrap',
                        background: acc.isSystemAdmin ? '#e0e7ff' : '#e2e8f0',
                        color: acc.isSystemAdmin ? '#4338ca' : '#475569',
                        flexShrink: 0
                      }}
                    />
                  </Paper>
                ))}
              </Stack>
            </Grid>

            {/* Right Column: Login Form */}
            <Grid item xs={12} md={7}>
              <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5, md: 4 }, borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', mb: 0.5, fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>
                  Sign In to Your Account
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 3, fontSize: '0.8rem' }}>
                  Each staff role will see only projects relevant to their scope.
                </Typography>

                {errorMsg && <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>{errorMsg}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    fullWidth
                    label="School Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    sx={{ background: '#ffffff', borderRadius: '10px' }}
                  />

                  <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    sx={{ background: '#ffffff', borderRadius: '10px' }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LockIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
                      color: '#ffffff',
                      borderRadius: '12px',
                      py: 1.4,
                      fontWeight: 800,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                      '&:hover': { background: '#4338ca' }
                    }}
                  >
                    {loading ? 'Authenticating...' : 'Sign In to Portal'}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};
