import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Divider,
  Button,
  Paper,
  Stack,
  Avatar
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ComputerIcon from '@mui/icons-material/Computer';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import HotelIcon from '@mui/icons-material/Hotel';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import PeopleIcon from '@mui/icons-material/People';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import VerifiedIcon from '@mui/icons-material/Verified';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RefreshIcon from '@mui/icons-material/Refresh';

const drawerWidth = 280;

interface CsmtSidebarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  currentUser: any;
  onLogout: () => void;
  onOpenCreateModal: () => void;
  onOpenUsersModal: () => void;
  onSyncDb: () => void;
  syncing: boolean;
  projectCounts: Record<string, number>;
}

export const CsmtSidebar: React.FC<CsmtSidebarProps> = ({
  activeCategory,
  onSelectCategory,
  currentUser,
  onLogout,
  onOpenCreateModal,
  onOpenUsersModal,
  onSyncDb,
  syncing,
  projectCounts
}) => {
  const isAdmin = currentUser?.isSystemAdmin || currentUser?.role?.includes('Admin');

  const menuItems = [
    { label: 'All Projects', value: 'ALL', icon: <DashboardIcon />, count: projectCounts['ALL'] || 0, adminOnly: false },
    { label: 'Academic CS Labs', value: 'ACADEMIC_LAB', icon: <ComputerIcon />, count: projectCounts['ACADEMIC_LAB'] || 0, adminOnly: false },
    { label: 'Digital Library', value: 'LIBRARY', icon: <MenuBookIcon />, count: projectCounts['LIBRARY'] || 0, adminOnly: false },
    { label: 'Sports Turf Complex', value: 'SPORTS', icon: <SportsSoccerIcon />, count: projectCounts['SPORTS'] || 0, adminOnly: false },
    { label: 'Student Hostels', value: 'HOSTEL', icon: <HotelIcon />, count: projectCounts['HOSTEL'] || 0, adminOnly: false },
    { label: 'STEM Robotics Clubs', value: 'CLUBS', icon: <PrecisionManufacturingIcon />, count: projectCounts['CLUBS'] || 0, adminOnly: false }
  ];

  return (
    <Box
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        color: '#0f172a',
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.02)',
        minHeight: '100vh'
      }}
    >
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* District Branding & Logo */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)'
              }}
            >
              <SchoolIcon sx={{ color: '#ffffff', fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', lineHeight: 1.1, letterSpacing: -0.5 }}>
                CSMT Schools
              </Typography>
              <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.78rem', fontWeight: 700 }}>
                Infrastructure Portal
              </Typography>
            </Box>
          </Box>

          <Chip
            icon={<VerifiedIcon sx={{ color: '#047857 !important', fontSize: 14 }} />}
            label="CONNECTED TO LIVE DATABASE"
            size="small"
            sx={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#047857',
              fontWeight: 800,
              fontSize: '0.65rem',
              width: '100%',
              mt: 1.5,
              py: 0.5
            }}
          />
        </Box>

        <Divider sx={{ borderColor: '#e2e8f0', mb: 3 }} />

        {/* User Profile Card */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: '14px',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            color: '#0f172a'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            {isAdmin ? (
              <Avatar sx={{ background: '#4f46e5', width: 38, height: 38 }}>
                <AdminPanelSettingsIcon sx={{ color: '#fbbf24', fontSize: 22 }} />
              </Avatar>
            ) : (
              <Avatar sx={{ background: '#059669', width: 38, height: 38 }}>
                <AccountCircleIcon sx={{ color: '#ffffff', fontSize: 22 }} />
              </Avatar>
            )}
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="subtitle2" noWrap sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>
                {currentUser?.name || 'Staff User'}
              </Typography>
              <Typography variant="caption" noWrap sx={{ color: '#475569', display: 'block', fontWeight: 700, fontSize: '0.72rem' }}>
                {currentUser?.role}
              </Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            size="small"
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon sx={{ fontSize: 14 }} />}
            onClick={onLogout}
            sx={{
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#dc2626',
              borderColor: '#fca5a5',
              borderRadius: '8px',
              '&:hover': { background: '#fef2f2', borderColor: '#ef4444' }
            }}
          >
            Sign Out
          </Button>
        </Paper>

        <Typography variant="caption" sx={{ color: '#475569', fontWeight: 900, letterSpacing: 0.6, mb: 1, px: 1 }}>
          PORTFOLIO NAVIGATION
        </Typography>

        {/* Sidebar Menu Items */}
        <List sx={{ p: 0, mb: 'auto' }}>
          {menuItems.map((item) => {
            const isSelected = activeCategory === item.value;
            return (
              <ListItem key={item.value} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => onSelectCategory(item.value)}
                  sx={{
                    borderRadius: '10px',
                    py: 1.2,
                    px: 2,
                    color: isSelected ? '#ffffff' : '#334155',
                    background: isSelected ? 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%) !important' : 'transparent',
                    boxShadow: isSelected ? '0 4px 14px rgba(79, 70, 229, 0.3)' : 'none',
                    '&:hover': {
                      background: isSelected ? 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#0f172a'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: isSelected ? '#ffffff' : '#4f46e5', minWidth: 36 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: isSelected ? 800 : 700 }}
                  />
                  {item.count > 0 && (
                    <Chip
                      label={item.count}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        background: isSelected ? '#ffffff' : '#e0e7ff',
                        color: isSelected ? '#4f46e5' : '#4338ca'
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ borderColor: '#e2e8f0', my: 2 }} />

        {/* Admin Controls & Actions */}
        <Stack spacing={1.5}>
          {isAdmin && (
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PeopleIcon />}
              onClick={onOpenUsersModal}
              sx={{
                background: '#f3e8ff',
                color: '#6b21a8',
                borderColor: '#c084fc',
                textTransform: 'none',
                fontWeight: 800,
                borderRadius: '10px',
                py: 1.2,
                '&:hover': { background: '#e9d5ff', borderColor: '#a855f7' }
              }}
            >
              Org Staff Users
            </Button>
          )}

          <Button
            fullWidth
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={onOpenCreateModal}
            sx={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#ffffff',
              textTransform: 'none',
              fontWeight: 800,
              borderRadius: '10px',
              py: 1.2,
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
              '&:hover': { background: '#047857' }
            }}
          >
            New Project
          </Button>

          <Button
            fullWidth
            variant="text"
            size="small"
            startIcon={syncing ? <RefreshIcon className="spin" sx={{ fontSize: 14 }} /> : <RefreshIcon sx={{ fontSize: 14 }} />}
            onClick={onSyncDb}
            sx={{ color: '#475569', textTransform: 'none', fontSize: '0.78rem', fontWeight: 700 }}
          >
            Sync Engine Database
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};
