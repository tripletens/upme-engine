import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  IconButton,
  CircularProgress,
  Divider,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import ShieldIcon from '@mui/icons-material/Shield';
import KeyIcon from '@mui/icons-material/Key';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VerifiedIcon from '@mui/icons-material/Verified';

interface CsmtOrgUsersModalProps {
  open: boolean;
  onClose: () => void;
}

export const CsmtOrgUsersModal: React.FC<CsmtOrgUsersModalProps> = ({ open, onClose }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [orgInfo, setOrgInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOrgUsers = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/organization/users', {
        headers: {
          'X-Organization-Code': 'CSMT-SCHOOLS-DISTRICT',
          'X-Api-Key': 'upme_live_sec_csmt_schools_8f9a0b1c',
          'Accept': 'application/json'
        }
      });
      const data = await res.json();
      setLoading(false);

      if (data.status === 'success') {
        setUsers(data.data || []);
        setOrgInfo(data.organization || null);
      } else {
        setErrorMsg('Failed to fetch organization users from UPME Engine.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Error connecting to UPME Engine REST API.');
    }
  };

  useEffect(() => {
    if (open) {
      fetchOrgUsers();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: '16px', p: 1, minWidth: { xs: '92%', sm: 650 } } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PeopleIcon sx={{ color: '#4f46e5', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              Organization Staff & System Users
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Tenant: {orgInfo?.name || 'CSMT Schools District'} ({orgInfo?.code || 'CSMT-SCHOOLS-DISTRICT'})
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent>
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

        <Paper elevation={0} sx={{ p: 2.5, mb: 3, background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: '#fff', borderRadius: '12px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#a5f3fc', fontWeight: 700 }}>
                ADMIN SECURITY CONTROLS
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Registered Organization Team ({users.length} Active Staff)
              </Typography>
            </Box>
            <Chip
              icon={<VerifiedIcon sx={{ color: '#fff !important', fontSize: 14 }} />}
              label="SYNCHRONIZED WITH ENGINE"
              size="small"
              sx={{ background: '#059669', color: '#fff', fontWeight: 800 }}
            />
          </Box>
        </Paper>

        {loading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress size={32} />
            <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
              Loading Organization Users from Database...
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {users.map((u) => (
              <Paper
                key={u.id}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1.5
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AccountCircleIcon sx={{ color: u.role === 'ADMIN' ? '#4f46e5' : '#059669', fontSize: 32 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                      {u.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {u.email}
                    </Typography>
                  </Box>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={u.role}
                    size="small"
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.65rem',
                      background: u.role === 'ADMIN' ? '#e0e7ff' : '#ecfdf5',
                      color: u.role === 'ADMIN' ? '#4338ca' : '#047857'
                    }}
                  />
                  <Chip
                    label={`${(u.permissions || []).length} Permissions`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.65rem', fontWeight: 700 }}
                  />
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: '#64748b' }}>Close Users Inspector</Button>
      </DialogActions>
    </Dialog>
  );
};
