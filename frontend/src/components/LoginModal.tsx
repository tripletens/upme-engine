import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Stack
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any, organization: any) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fillSuperAdmin = () => {
    setEmail('admin@upme.io');
    setPassword('Password123!');
    setErrorMsg('');
  };

  const fillSchoolAdmin = () => {
    setEmail('schooladmin@school.edu');
    setPassword('Password123!');
    setErrorMsg('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg('');

    try {
      let res;
      try {
        res = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      } catch (err) {
        res = await fetch('http://127.0.0.1:8000/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      }

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.status === 'success') {
        onLoginSuccess(data.user, data.organization);
        onClose();
      } else {
        setErrorMsg(data.message || 'Invalid credentials.');
      }
    } catch (err) {
      setLoading(false);
      // Fallback for client demo mode
      if (email === 'admin@upme.io' && password === 'Password123!') {
        onLoginSuccess(
          { id: 1, name: 'Super Admin User', email: 'admin@upme.io', role: 'ADMIN' },
          { id: 1, name: 'UPME Global Enterprise Admin', code: 'ADMIN-ENTERPRISE-001', kyc_status: 'VERIFIED', subscription_tier: 'ENTERPRISE' }
        );
        onClose();
      } else if (email === 'schooladmin@school.edu' && password === 'Password123!') {
        onLoginSuccess(
          { id: 2, name: 'School District Admin', email: 'schooladmin@school.edu', role: 'ORGANIZATION_ADMIN' },
          { id: 2, name: 'Example International School', code: 'EIS-SCHOOL-DISTRICT', kyc_status: 'VERIFIED', subscription_tier: 'PROFESSIONAL' }
        );
        onClose();
      } else {
        setErrorMsg('Invalid email or password credentials.');
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: '#ffffff',
          color: '#0f172a',
          minWidth: { xs: '90%', sm: 460 },
          borderRadius: '16px',
          p: 2
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LockOutlinedIcon sx={{ color: '#4f46e5' }} />
        </Box>
        UPME Enterprise Sign In
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
          Sign in to access your multi-tenant organization, project timelines, and RBAC governance.
        </Typography>

        {/* Demo Account Fill Helpers */}
        <Box sx={{ p: 2, mb: 3, background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <Typography variant="caption" sx={{ color: '#475569', fontWeight: 700, display: 'block', mb: 1.5 }}>
            ⚡ QUICK TEST CREDENTIALS:
          </Typography>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
            <Chip
              icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
              label="Super Admin (Full Access)"
              onClick={fillSuperAdmin}
              sx={{ background: '#e0e7ff', color: '#4338ca', fontWeight: 700, cursor: 'pointer', '&:hover': { background: '#c7d2fe' } }}
            />
            <Chip
              label="School District Admin"
              onClick={fillSchoolAdmin}
              sx={{ background: '#f1f5f9', color: '#334155', fontWeight: 700, cursor: 'pointer', '&:hover': { background: '#e2e8f0' } }}
            />
          </Stack>
        </Box>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
            {errorMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@upme.io"
            required
            sx={{
              input: { color: '#0f172a' },
              label: { color: '#64748b' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#cbd5e1' },
                '&:hover fieldset': { borderColor: '#4f46e5' },
              }
            }}
          />

          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password123!"
            required
            sx={{
              input: { color: '#0f172a' },
              label: { color: '#64748b' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#cbd5e1' },
                '&:hover fieldset': { borderColor: '#4f46e5' },
              }
            }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{
              background: '#4f46e5',
              color: '#ffffff',
              borderRadius: '12px',
              py: 1.5,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
              '&:hover': { background: '#4338ca' }
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: '#64748b', fontWeight: 600 }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
