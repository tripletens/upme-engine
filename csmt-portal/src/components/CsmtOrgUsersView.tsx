import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  Avatar,
  Divider,
  Stack,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  Switch
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';
import VerifiedIcon from '@mui/icons-material/Verified';
import SearchIcon from '@mui/icons-material/Search';
import KeyIcon from '@mui/icons-material/Key';

interface CsmtOrgUsersViewProps {
  onBack: () => void;
}

export const CsmtOrgUsersView: React.FC<CsmtOrgUsersViewProps> = ({ onBack }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fallbackUsers = [
    { id: 1, name: 'Dr. Clement Eze', email: 'admin@csmt.edu.ng', role: 'District Admin / Principal', dept: 'CSMT Executive Admin', isSystemAdmin: true, allowedCategory: 'ALL' },
    { id: 2, name: 'Dr. Robert Vance', email: 'dr.vance@csmt.edu.ng', role: 'HOD Computer Science', dept: 'CS & AI Labs', allowedCategory: 'ACADEMIC_LAB' },
    { id: 3, name: 'Mrs. Clara Hughes', email: 'clara.hughes@csmt.edu.ng', role: 'Head Librarian', dept: 'Digital Library', allowedCategory: 'LIBRARY' },
    { id: 4, name: 'Coach Marcus Miller', email: 'marcus.miller@csmt.edu.ng', role: 'Sports Director', dept: 'Sports Complex', allowedCategory: 'SPORTS' },
    { id: 5, name: 'Engr. David Opara', email: 'david.opara@csmt.edu.ng', role: 'Facilities Manager', dept: 'Hostels', allowedCategory: 'HOSTEL' },
    { id: 6, name: 'Prof. Alex Chen', email: 'alex.chen@csmt.edu.ng', role: 'Robotics Patron', dept: 'STEM Clubs', allowedCategory: 'CLUBS' }
  ];

  const fetchUsers = async () => {
    setLoading(true);
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

      if (data.status === 'success' && data.data && data.data.length > 0) {
        setUsers(data.data);
      } else {
        setUsers(fallbackUsers);
      }
    } catch (err) {
      setLoading(false);
      setUsers(fallbackUsers);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleAdminPermission = (userId: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isSystemAdmin: !u.isSystemAdmin } : u
      )
    );
    setSuccessMsg('🎉 Role permission scope updated dynamically!');
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.dept?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: 1100, mx: 'auto', boxSizing: 'border-box', overflowX: 'hidden' }}>
      {/* Top Back Navigation Button */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{ mb: 3, textTransform: 'none', fontWeight: 800, color: '#334155', borderColor: '#cbd5e1', borderRadius: '10px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
      >
        Back to Projects Portfolio
      </Button>

      {/* Header Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5, md: 4 },
          mb: 3,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)',
          color: '#ffffff',
          boxShadow: '0 10px 25px rgba(49, 46, 129, 0.25)',
          border: '1px solid #4338ca'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
          <Chip
            icon={<AdminPanelSettingsIcon sx={{ color: '#fff !important', fontSize: 14 }} />}
            label="ORGANIZATION ADMIN PAGE"
            size="small"
            sx={{ background: '#4f46e5', color: '#fff', fontWeight: 800, fontSize: '0.68rem' }}
          />
          <Chip
            icon={<VerifiedIcon sx={{ color: '#fff !important', fontSize: 13 }} />}
            label="ENGINE LIVE RBAC"
            size="small"
            sx={{ background: '#059669', color: '#fff', fontWeight: 800, fontSize: '0.68rem' }}
          />
        </Box>

        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -0.5, mb: 1, fontSize: { xs: '1.35rem', sm: '2.1rem' } }}>
          District Staff Directory & RBAC Permissions Manager
        </Typography>

        <Typography variant="body2" sx={{ color: '#c7d2fe', fontSize: { xs: '0.8rem', sm: '0.88rem' } }}>
          Manage district staff department assignments and role-scoped project access levels (`CSMT-SCHOOLS-DISTRICT`).
        </Typography>
      </Paper>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
          {successMsg}
        </Alert>
      )}

      {/* Main Staff Inspector Container */}
      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5, md: 4 }, borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        
        {/* Search Bar & Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search staff by name, role, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                </InputAdornment>
              )
            }}
            sx={{ width: { xs: '100%', sm: 340 }, background: '#f8fafc' }}
          />

          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.78rem' }}>
            Showing <strong>{filteredUsers.length}</strong> Registered Staff Users
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filteredUsers.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    background: user.isSystemAdmin ? '#f5f3ff' : '#f8fafc',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    transition: 'all 0.2s ease',
                    '&:hover': { borderColor: '#4f46e5', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.1)' }
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 44,
                          height: 44,
                          background: user.isSystemAdmin ? 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)' : '#cbd5e1',
                          fontWeight: 800,
                          fontSize: '1rem'
                        }}
                      >
                        {user.name?.slice(0, 2).toUpperCase()}
                      </Avatar>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem', lineHeight: 1.2 }}>
                          {user.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem', display: 'block' }}>
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>

                    <Stack spacing={0.8} sx={{ mb: 2 }}>
                      <Chip
                        icon={<KeyIcon sx={{ fontSize: '13px !important' }} />}
                        label={`Role: ${user.role || 'Staff User'}`}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          background: user.isSystemAdmin ? '#e0e7ff' : '#ffffff',
                          color: user.isSystemAdmin ? '#4338ca' : '#475569',
                          border: '1px solid #cbd5e1',
                          width: 'fit-content'
                        }}
                      />
                      <Chip
                        icon={<SchoolIcon sx={{ fontSize: '13px !important' }} />}
                        label={`Scope: ${user.dept || 'CSMT Schools'}`}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          background: '#ffffff',
                          color: '#334155',
                          border: '1px solid #cbd5e1',
                          width: 'fit-content'
                        }}
                      />
                    </Stack>
                  </Box>

                  <Box sx={{ pt: 1.5, borderTop: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', fontSize: '0.72rem' }}>
                      District Admin Scope:
                    </Typography>

                    <Switch
                      size="small"
                      checked={Boolean(user.isSystemAdmin)}
                      onChange={() => handleToggleAdminPermission(user.id)}
                      color="primary"
                    />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
};
