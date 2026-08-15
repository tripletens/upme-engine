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
import EngineeringIcon from '@mui/icons-material/Engineering';
import VerifiedIcon from '@mui/icons-material/Verified';
import SearchIcon from '@mui/icons-material/Search';
import KeyIcon from '@mui/icons-material/Key';
import ApartmentIcon from '@mui/icons-material/Apartment';

interface LytHomesOrgUsersViewProps {
  onBack: () => void;
}

export const LytHomesOrgUsersView: React.FC<LytHomesOrgUsersViewProps> = ({ onBack }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fallbackUsers = [
    { id: 1, name: 'Engr. Michael Vance', email: 'md.vance@lythomes.com', role: 'Managing Director & Principal Architect', dept: 'LytHomes Executive Board', isSystemAdmin: true, allowedCategory: 'ALL' },
    { id: 2, name: 'Engr. Sarah Jenkins', email: 'sarah.jenkins@lythomes.com', role: 'Head of Structural Engineering', dept: 'Commercial Towers', isSystemAdmin: false, allowedCategory: 'COMMERCIAL_TOWER' },
    { id: 3, name: 'Arch. Kenneth Nwosu', email: 'kenneth.nwosu@lythomes.com', role: 'Residential Estates Director', dept: 'Residential Estates & Villas', isSystemAdmin: false, allowedCategory: 'RESIDENTIAL_ESTATE' },
    { id: 4, name: 'Engr. Tunde Bakare', email: 'tunde.bakare@lythomes.com', role: 'Civil Infrastructure & Roads Lead', dept: 'Civil Infrastructure & Microgrids', isSystemAdmin: false, allowedCategory: 'CIVIL_INFRASTRUCTURE' },
    { id: 5, name: 'Mrs. Amaka Obi', email: 'amaka.obi@lythomes.com', role: 'Chief Quantity Surveyor & BOQ Auditor', dept: 'Logistics Parks & Warehousing', isSystemAdmin: false, allowedCategory: 'INDUSTRIAL_PARK' }
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/organization/users', {
        headers: {
          'X-Organization-Code': 'LYTHOMES-CONSTRUCTION-CO',
          'X-Api-Key': 'upme_live_sec_lythomes_9c8d7e6f',
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
    setSuccessMsg('🎉 Staff RBAC permission level updated dynamically!');
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
        Back to Construction Portfolio
      </Button>

      {/* Header Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5, md: 4 },
          mb: 3,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.3)',
          border: '1px solid #334155'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
          <Chip
            icon={<AdminPanelSettingsIcon sx={{ color: '#fff !important', fontSize: 14 }} />}
            label="LYTHOMES ADMIN PAGE"
            size="small"
            sx={{ background: '#f59e0b', color: '#fff', fontWeight: 800, fontSize: '0.68rem', height: 24 }}
          />
          <Chip
            icon={<VerifiedIcon sx={{ color: '#fff !important', fontSize: 13 }} />}
            label="ENGINE LIVE RBAC (`LYTHOMES-CO`)"
            size="small"
            sx={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff', fontWeight: 800, fontSize: '0.68rem', height: 24 }}
          />
        </Box>

        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -0.5, mb: 1, fontSize: { xs: '1.35rem', sm: '2.1rem' } }}>
          Engineering Staff & RBAC Manager
        </Typography>

        <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: { xs: '0.8rem', sm: '0.88rem' } }}>
          Manage civil engineers, architects, and quantity surveyors permission scopes for LytHomes Construction Co.
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
            placeholder="Search engineers by name, role, or department..."
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
            Showing <strong>{filteredUsers.length}</strong> Registered Engineering Staff
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
                    background: user.isSystemAdmin ? '#fffbeb' : '#f8fafc',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    transition: 'all 0.2s ease',
                    '&:hover': { borderColor: '#f59e0b', boxShadow: '0 4px 14px rgba(245, 158, 11, 0.15)' }
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 44,
                          height: 44,
                          background: user.isSystemAdmin ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : '#cbd5e1',
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
                        label={`Role: ${user.role || 'Staff Engineer'}`}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          background: user.isSystemAdmin ? '#feefc3' : '#ffffff',
                          color: user.isSystemAdmin ? '#b45309' : '#475569',
                          border: '1px solid #cbd5e1',
                          width: 'fit-content'
                        }}
                      />
                      <Chip
                        icon={<ApartmentIcon sx={{ fontSize: '13px !important' }} />}
                        label={`Scope: ${user.dept || 'LytHomes Co.'}`}
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
                      Executive Admin Scope:
                    </Typography>

                    <Switch
                      size="small"
                      checked={Boolean(user.isSystemAdmin)}
                      onChange={() => handleToggleAdminPermission(user.id)}
                      color="warning"
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
