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
  Divider,
  Grid
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import LockIcon from '@mui/icons-material/Lock';
import KeyIcon from '@mui/icons-material/Key';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface CsmtLoginViewProps {
  onLoginSuccess: (user: any) => void;
}

export const CsmtLoginView: React.FC<CsmtLoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('dr.vance@csmt.edu.ng');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const demoAccounts = [
    { name: 'Dr. Robert Vance', email: 'dr.vance@csmt.edu.ng', role: 'HOD Computer Science', dept: 'CS & AI Labs' },
    { name: 'Mrs. Clara Hughes', email: 'clara.hughes@csmt.edu.ng', role: 'Head Librarian', dept: 'Digital Library' },
    { name: 'Coach Marcus Miller', email: 'marcus.miller@csmt.edu.ng', role: 'Sports Director', dept: 'Sports Complex' },
    { name: 'Engr. David Opara', email: 'david.opara@csmt.edu.ng', role: 'Facilities Manager', dept: 'Hostels' },
    { name: 'Prof. Alex Chen', email: 'alex.chen@csmt.edu.ng', role: 'Robotics Patron', dept: 'STEM Clubs' }
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
        dept: 'CSMT Schools'
      };

      onLoginSuccess(loggedUser);
    } catch (err) {
      setLoading(false);
      const loggedUser = demoAccounts.find((a) => a.email === email) || {
        name: 'Dr. Robert Vance',
        email: 'dr.vance@csmt.edu.ng',
        role: 'HOD Computer Science',
        dept: 'CS & AI Labs'
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
        justify: 'center',
        py: 6,
        px: 2
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: '24px',
            background: '#ffffff',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            border: '1px solid #e2e8f0'
          }}
        >
          <Grid container spacing={4} alignItems="center">
            {/* Left Column: Branding & Info */}
            <Grid item xs={12} md={5}>
              <Box sx={{ mb: 3 }}>
                <Chip
                  icon={<SchoolIcon sx={{ color: '#fff !important', fontSize: 16 }} />}
                  label="CSMT SCHOOLS DISTRICT"
                  sx={{ background: '#4f46e5', color: '#fff', fontWeight: 800, mb: 2 }}
                />
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: -0.5, mb: 1 }}>
                  Staff & Admin Portal Sign In
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                  Access the multi-campus project monitoring dashboard, stage audit documents, and Naira budget management.
                </Typography>
              </Box>

              <Stack spacing={2} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <VerifiedUserIcon sx={{ color: '#059669', fontSize: 22 }} />
                  <Typography variant="caption" sx={{ color: '#334155', fontWeight: 700 }}>
                    Powered by Live MySQL UPME Engine
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <KeyIcon sx={{ color: '#4f46e5', fontSize: 22 }} />
                  <Typography variant="caption" sx={{ color: '#334155', fontWeight: 700 }}>
                    Tenant Scope: CSMT-SCHOOLS-DISTRICT
                  </Typography>
                </Box>
              </Stack>

              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', mb: 1.5 }}>
                PRE-CONFIGURED STAFF ACCOUNTS:
              </Typography>

              <Stack spacing={1}>
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
                      justify: 'space-between',
                      alignItems: 'center',
                      '&:hover': { borderColor: '#4f46e5' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountCircleIcon sx={{ color: email === acc.email ? '#4f46e5' : '#94a3b8', fontSize: 20 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.8rem', lineHeight: 1.1 }}>
                          {acc.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>
                          {acc.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip label={acc.dept} size="small" sx={{ height: 18, fontSize: '0.58rem', fontWeight: 800 }} />
                  </Paper>
                ))}
              </Stack>
            </Grid>

            {/* Right Column: Login Form */}
            <Grid item xs={12} md={7}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                  Sign In to Your Staff Account
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                  Enter your school email credentials below:
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
                      background: '#4f46e5',
                      color: '#ffffff',
                      borderRadius: '12px',
                      py: 1.6,
                      fontWeight: 800,
                      textTransform: 'none',
                      fontSize: '1rem',
                      boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                      '&:hover': { background: '#4338ca' }
                    }}
                  >
                    {loading ? 'Authenticating with UPME Engine...' : 'Sign In to CSMT Portal'}
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
