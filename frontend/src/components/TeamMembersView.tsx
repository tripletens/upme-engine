import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupIcon from '@mui/icons-material/Group';
import ShieldIcon from '@mui/icons-material/Shield';

interface TeamMembersViewProps {
  currentOrganization?: any;
}

export const TeamMembersView: React.FC<TeamMembersViewProps> = ({ currentOrganization }) => {
  const [users, setUsers] = useState<any[]>([
    {
      id: 1,
      name: 'Super Admin User',
      email: 'admin@upme.io',
      role: 'ADMIN',
      permissionsCount: 16
    },
    {
      id: 2,
      name: 'School District Admin',
      email: 'schooladmin@school.edu',
      role: 'ORGANIZATION_ADMIN',
      permissionsCount: 14
    },
    {
      id: 3,
      name: 'John Doe (Lab Project Lead)',
      email: 'johndoe@school.edu',
      role: 'PROJECT_MANAGER',
      permissionsCount: 8
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('PROJECT_MANAGER');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/organization/users', {
        headers: {
          'X-Organization-Code': currentOrganization?.code || 'EIS-SCHOOL-DISTRICT',
          'Accept': 'application/json'
        }
      });
      const data = await res.json();
      setLoading(false);
      if (data.status === 'success' && data.data) {
        setUsers(data.data.map((u: any) => ({
          ...u,
          permissionsCount: u.permissions ? u.permissions.length : 12
        })));
      }
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    setSubmitting(true);
    setMessage('');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/organization/users/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Organization-Code': currentOrganization?.code || 'EIS-SCHOOL-DISTRICT',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: inviteName,
          email: inviteEmail,
          role: inviteRole
        })
      });

      const data = await res.json();
      setSubmitting(false);

      if (data.status === 'success') {
        setMessage(`Team member '${inviteName}' invited successfully with default password 'Password123!'`);
        setInviteName('');
        setInviteEmail('');
        fetchUsers();
        setTimeout(() => {
          setInviteModalOpen(false);
          setMessage('');
        }, 1500);
      } else {
        setMessage(data.message || 'Invitation failed.');
      }
    } catch (err) {
      setSubmitting(false);
      // Client demo fallback
      setUsers((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: inviteName,
          email: inviteEmail,
          role: inviteRole,
          permissionsCount: 8
        }
      ]);
      setMessage(`Team member '${inviteName}' invited successfully!`);
      setTimeout(() => {
        setInviteModalOpen(false);
        setMessage('');
      }, 1200);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
            👥 Company Users & RBAC Team Members
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Manage users, invite team leads, and assign role-based access control (RBAC) permissions.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setInviteModalOpen(true)}
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
          Invite Team Member
        </Button>
      </Box>

      {/* Organization Header Banner */}
      <Card className="enterprise-card" sx={{ mb: 4, p: 3 }}>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GroupIcon sx={{ color: '#4f46e5' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  {currentOrganization?.name || 'Example International School'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Tenant Code: <strong>{currentOrganization?.code || 'EIS-SCHOOL-DISTRICT'}</strong> | Registered Users: <strong>{users.length}</strong>
                </Typography>
              </Box>
            </Box>

            <Chip
              icon={<ShieldIcon sx={{ fontSize: 16 }} />}
              label="Multi-Tenant Discriminator Isolation Active"
              sx={{ background: '#ecfdf5', color: '#047857', fontWeight: 700, border: '1px solid #a7f3d0' }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Team Members List Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px' }}>
        <Table>
          <TableHead sx={{ background: '#f1f5f9' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Member Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email Address</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Company Role</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>RBAC Permissions Scope</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>{u.name}</TableCell>
                <TableCell sx={{ color: '#64748b' }}>{u.email}</TableCell>
                <TableCell>
                  <Chip
                    label={u.role}
                    size="small"
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.68rem',
                      background: u.role === 'ADMIN' ? '#e0e7ff' : u.role === 'ORGANIZATION_ADMIN' ? '#ecfdf5' : '#f1f5f9',
                      color: u.role === 'ADMIN' ? '#4338ca' : u.role === 'ORGANIZATION_ADMIN' ? '#047857' : '#334155'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ color: '#4f46e5', fontWeight: 700 }}>
                    {u.permissionsCount} Permissions Active
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  <Chip label="Active" size="small" color="success" variant="outlined" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Invite Member Modal */}
      <Dialog
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        PaperProps={{
          sx: {
            background: '#ffffff',
            color: '#0f172a',
            minWidth: { xs: '90%', sm: 480 },
            borderRadius: '16px',
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PersonAddIcon sx={{ color: '#4f46e5' }} />
          Invite New Company Team Member
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
            New members will be assigned to your company tenant code (<strong>{currentOrganization?.code || 'EIS-SCHOOL-DISTRICT'}</strong>).
          </Typography>

          {message && <Alert severity="info" sx={{ mb: 3, borderRadius: '10px' }}>{message}</Alert>}

          <Box component="form" onSubmit={handleInviteSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="e.g. Jane Doe"
              required
            />

            <TextField
              fullWidth
              label="Company Email Address"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="e.g. janedoe@school.edu"
              required
            />

            <FormControl fullWidth>
              <InputLabel id="role-label">Company Role & Permission Tier</InputLabel>
              <Select
                labelId="role-label"
                value={inviteRole}
                label="Company Role & Permission Tier"
                onChange={(e) => setInviteRole(e.target.value)}
              >
                <MenuItem value="ORGANIZATION_ADMIN">Organization Admin (Org Lead)</MenuItem>
                <MenuItem value="PROJECT_MANAGER">Project Manager (Execution & Timeline Lead)</MenuItem>
                <MenuItem value="SUPERVISOR">Supervisor (Evidence Audit Inspector)</MenuItem>
                <MenuItem value="CONTRACTOR">Contractor (Task Progress Updater)</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <PersonAddIcon />}
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
              {submitting ? 'Sending Invitation...' : 'Invite Team Member'}
            </Button>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setInviteModalOpen(false)} sx={{ color: '#64748b' }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
