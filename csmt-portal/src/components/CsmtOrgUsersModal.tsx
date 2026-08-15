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
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import ShieldIcon from '@mui/icons-material/Shield';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

interface CsmtOrgUsersModalProps {
  open: boolean;
  onClose: () => void;
}

export const CsmtOrgUsersModal: React.FC<CsmtOrgUsersModalProps> = ({ open, onClose }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [orgInfo, setOrgInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
        const mappedUsers = (data.data || []).map((u: any) => {
          const perms = u.permissions || ['progress:update', 'project:edit', 'project:view'];
          return {
            ...u,
            canUpdateProgress: perms.includes('progress:update'),
            canEditProjects: perms.includes('project:edit')
          };
        });
        setUsers(mappedUsers);
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

  const handleTogglePermission = async (user: any, permType: 'progress' | 'edit') => {
    setUpdatingUserId(user.id);
    setSuccessMsg('');
    setErrorMsg('');

    const newCanUpdateProgress = permType === 'progress' ? !user.canUpdateProgress : user.canUpdateProgress;
    const newCanEditProjects = permType === 'edit' ? !user.canEditProjects : user.canEditProjects;

    const newPermissions: string[] = ['project:view'];
    if (newCanUpdateProgress) newPermissions.push('progress:update');
    if (newCanEditProjects) newPermissions.push('project:edit', 'project:create');

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/organization/users/${user.id}/permissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Organization-Code': 'CSMT-SCHOOLS-DISTRICT',
          'X-Api-Key': 'upme_live_sec_csmt_schools_8f9a0b1c',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ permissions: newPermissions })
      });

      const data = await res.json();
      setUpdatingUserId(null);

      // Update local UI state
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === user.id) {
            return {
              ...u,
              canUpdateProgress: newCanUpdateProgress,
              canEditProjects: newCanEditProjects,
              permissions: newPermissions
            };
          }
          return u;
        })
      );

      // Update current logged-in user in localStorage if editing self
      try {
        const savedUser = JSON.parse(localStorage.getItem('csmt_current_user') || '{}');
        if (savedUser && (savedUser.id === user.id || savedUser.email === user.email)) {
          savedUser.canUpdateProgress = newCanUpdateProgress;
          savedUser.canEditProjects = newCanEditProjects;
          savedUser.permissions = newPermissions;
          localStorage.setItem('csmt_current_user', JSON.stringify(savedUser));
        }
      } catch (e) {}

      setSuccessMsg(`🎉 Permissions updated for ${user.name} and sent to UPME Engine database!`);
    } catch (err) {
      setUpdatingUserId(null);
      setErrorMsg('Failed to update permission in database engine.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: '16px', p: 1, minWidth: { xs: '92%', sm: 720 } } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PeopleIcon sx={{ color: '#4f46e5', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              Organization Staff & Permission Manager
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
        {successMsg && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMsg('')}>{successMsg}</Alert>}

        <Paper elevation={0} sx={{ p: 2.5, mb: 3, background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: '#fff', borderRadius: '12px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#a5f3fc', fontWeight: 700 }}>
                ADMIN SECURITY GOVERNANCE
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Staff Milestone & Progress Edit Controls ({users.length} Active Staff)
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
              Loading Organization Users & Permissions...
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {users.map((u) => (
              <Paper
                key={u.id}
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 220 }}>
                  <AccountCircleIcon sx={{ color: u.role === 'ADMIN' ? '#4f46e5' : '#059669', fontSize: 36 }} />
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                        {u.name}
                      </Typography>
                      <Chip
                        label={u.role}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.62rem',
                          background: u.role === 'ADMIN' ? '#e0e7ff' : '#ecfdf5',
                          color: u.role === 'ADMIN' ? '#4338ca' : '#047857'
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                      {u.email}
                    </Typography>
                  </Box>
                </Box>

                {/* Permission Toggles */}
                <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={u.canUpdateProgress !== false}
                        onChange={() => handleTogglePermission(u, 'progress')}
                        disabled={updatingUserId === u.id}
                        color="success"
                        size="small"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {u.canUpdateProgress !== false ? <LockOpenIcon sx={{ fontSize: 14, color: '#059669' }} /> : <LockIcon sx={{ fontSize: 14, color: '#dc2626' }} />}
                        <Typography variant="caption" sx={{ fontWeight: 700, color: u.canUpdateProgress !== false ? '#047857' : '#dc2626' }}>
                          Progress Updates
                        </Typography>
                      </Box>
                    }
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={u.canEditProjects !== false}
                        onChange={() => handleTogglePermission(u, 'edit')}
                        disabled={updatingUserId === u.id}
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {u.canEditProjects !== false ? <LockOpenIcon sx={{ fontSize: 14, color: '#4f46e5' }} /> : <LockIcon sx={{ fontSize: 14, color: '#dc2626' }} />}
                        <Typography variant="caption" sx={{ fontWeight: 700, color: u.canEditProjects !== false ? '#4338ca' : '#dc2626' }}>
                          Create/Edit Projects
                        </Typography>
                      </Box>
                    }
                  />
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: '#64748b', fontWeight: 700 }}>Close Permission Manager</Button>
      </DialogActions>
    </Dialog>
  );
};
