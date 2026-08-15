import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Button
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CalculateIcon from '@mui/icons-material/Calculate';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import GroupIcon from '@mui/icons-material/Group';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import TerminalIcon from '@mui/icons-material/Terminal';

interface SidebarNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: any;
  currentOrganization: any;
  kycStatus: string;
  onOpenKyc: () => void;
  onOpenNewProject: () => void;
  onGoToLanding: () => void;
  onLogout: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  currentOrganization,
  kycStatus,
  onOpenKyc,
  onOpenNewProject,
  onGoToLanding,
  onLogout
}) => {
  const menuItems = [
    { id: 'client_portal', label: 'Client Executive Portal', icon: <RemoveRedEyeIcon /> },
    { id: 'dashboard', label: 'Dashboard & Timeline', icon: <DashboardIcon /> },
    { id: 'team', label: 'Team & User Accounts', icon: <GroupIcon /> },
    { id: 'baseline', label: 'Baseline & Progress Engine', icon: <AccountTreeIcon /> },
    { id: 'health_rules', label: 'Health & Rules Engine', icon: <CalculateIcon /> },
    { id: 'alerts_actions', label: 'Alerts & Corrective Actions', icon: <NotificationsActiveIcon /> },
    { id: 'api_docs', label: 'API & Developer Docs', icon: <TerminalIcon /> },
    { id: 'kyc', label: 'Corporate KYC Portal', icon: <VerifiedUserIcon /> },
    { id: 'billing', label: 'Paystack SaaS Subscriptions', icon: <CreditCardIcon /> },
  ];

  return (
    <Box
      sx={{
        width: 280,
        minWidth: 280,
        height: '100vh',
        position: 'sticky',
        top: 0,
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: 1100
      }}
    >
      {/* Top Header & Brand */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#fff',
              fontSize: '1.3rem'
            }}
          >
            U
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1, letterSpacing: -0.5 }}>
              UPME
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
              Execution Intelligence
            </Typography>
          </Box>
        </Box>

        {/* Quick Action Button */}
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={onOpenNewProject}
          sx={{
            background: '#4f46e5',
            color: '#ffffff',
            borderRadius: '10px',
            py: 1.2,
            fontWeight: 700,
            textTransform: 'none',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
            '&:hover': { background: '#4338ca' }
          }}
        >
          New Project Baseline
        </Button>
      </Box>

      {/* Navigation Links */}
      <Box sx={{ px: 2, flex: 1, overflowY: 'auto' }}>
        <Typography variant="caption" sx={{ px: 1.5, color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          VIEWS & NAVIGATION
        </Typography>
        <List sx={{ mt: 1 }}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => {
                    if (item.id === 'kyc') onOpenKyc();
                    else onSelectTab(item.id);
                  }}
                  sx={{
                    borderRadius: '10px',
                    background: isActive ? '#e0e7ff' : 'transparent',
                    color: isActive ? '#4338ca' : '#475569',
                    '&:hover': { background: isActive ? '#e0e7ff' : '#f1f5f9' }
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#4f46e5' : '#64748b', minWidth: 38 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.88rem',
                      fontWeight: isActive ? 700 : 500
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer Profile & Logout */}
      <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', truncate: true }}>
              {currentUser ? currentUser.name : 'Client Executive'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
              {currentUser ? currentUser.email : 'schooladmin@school.edu'}
            </Typography>
          </Box>
          <Chip
            label={kycStatus}
            size="small"
            onClick={onOpenKyc}
            sx={{
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 800,
              background: '#ecfdf5',
              color: '#047857',
              border: '1px solid #a7f3d0',
              cursor: 'pointer'
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            startIcon={<HomeIcon sx={{ fontSize: 14 }} />}
            onClick={onGoToLanding}
            sx={{ color: '#475569', borderColor: '#cbd5e1', textTransform: 'none', fontSize: '0.75rem', fontWeight: 600 }}
          >
            Landing
          </Button>

          {currentUser && (
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={onLogout}
              sx={{ minWidth: 40, px: 1 }}
            >
              <LogoutIcon sx={{ fontSize: 16 }} />
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
