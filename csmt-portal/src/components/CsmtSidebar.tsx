import React from 'react';
import {
  Box,
  Drawer,
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
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: '#0f172a',
          color: '#ffffff',
          borderRight: '1px solid #1e293b'
        }
      }}
    >
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* District Branding & Logo */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)'
              }}
            >
              <SchoolIcon sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1, letterSpacing: -0.5 }}>
                CSMT Schools
              </Typography>

              <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 600 }}>
                Infrastructure Portal
              </Typography>
            </Box>
          </Box>

          <Chip
            icon={<VerifiedIcon sx={{ color: '#fff !important', fontSize: 13 }} />}
            label="CONNECTED TO MYSQL"
            size="small"
            sx={{ background: 'rgba(5, 150, 105, 0.2)', color: '#34d399', fontWeight: 800, fontSize: '0.62rem', width: '100%', mt: 1 }}
          />
        </Box>

        <Divider sx={{ borderColor: '#1e293b', mb: 3 }} />

        {/* User Profile Card */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: '14px',
            background: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid #334155',
            color: '#fff'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            {isAdmin ? (
              <Avatar sx={{ bg: '#4f46e5', width: 36, height: 36 }}>
                <AdminPanelSettingsIcon sx={{ color: '#fbbf24', fontSize: 20 }} />
              </Avatar>
            ) : (
              <Avatar sx={{ bg: '#059669', width: 36, height: 36 }}>
                <AccountCircleIcon sx={{ color: '#38bdf8', fontSize: 20 }} />
              </Avatar>
            )}
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="subtitle2" noWrap sx={{ fontWeight: 800, fontSize: '0.85rem' }}>
                {currentUser?.name || 'Staff User'}
              </Typography>
              <Typography variant="caption" noWrap sx={{ color: '#94a3b8', display: 'block', fontSize: '0.68rem' }}>
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
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#fca5a5',
              borderColor: 'rgba(252, 165, 165, 0.3)',
              borderRadius: '8px',
              '&:hover': { background: 'rgba(239, 68, 68, 0.1)' }
            }}
          >
            Sign Out
          </Button>
        </Paper>

        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, letterSpacing: 0.5, mb: 1, px: 1 }}>
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
                    color: isSelected ? '#ffffff' : '#94a3b8',
                    background: isSelected ? 'linear-gradient(90deg, #4f46e5 0%, #4338ca 100%) !important' : 'transparent',
                    boxShadow: isSelected ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none',
                    '&:hover': {
                      background: isSelected ? 'linear-gradient(90deg, #4f46e5 0%, #4338ca 100%)' : '#1e293b',
                      color: '#ffffff'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: isSelected ? '#ffffff' : '#64748b', minWidth: 36 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: isSelected ? 800 : 600 }}
                  />
                  {item.count > 0 && (
                    <Chip
                      label={item.count}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        background: isSelected ? '#ffffff' : '#334155',
                        color: isSelected ? '#4f46e5' : '#cbd5e1'
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ borderColor: '#1e293b', my: 2 }} />

        {/* Admin Controls & Actions */}
        <Stack spacing={1.5}>
          {isAdmin && (
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PeopleIcon />}
              onClick={onOpenUsersModal}
              sx={{
                background: 'rgba(124, 58, 237, 0.15)',
                color: '#c084fc',
                borderColor: '#7c3aed',
                textTransform: 'none',
                fontWeight: 800,
                borderRadius: '10px',
                py: 1.2,
                '&:hover': { background: 'rgba(124, 58, 237, 0.25)' }
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
            sx={{ color: '#64748b', textTransform: 'none', fontSize: '0.75rem', fontWeight: 600 }}
          >
            Sync MySQL Database
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};
