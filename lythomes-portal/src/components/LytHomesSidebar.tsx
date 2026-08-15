import React from 'react';
import {
  Box,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Button,
  Avatar,
  Paper,
  IconButton,
  Stack
} from '@mui/material';
import FoundationIcon from '@mui/icons-material/Foundation';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ApartmentIcon from '@mui/icons-material/Apartment';
import EngineeringIcon from '@mui/icons-material/Engineering';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import BrushIcon from '@mui/icons-material/Brush';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import { CategoryItem } from './LytHomesCategoryManagerView';

interface LytHomesSidebarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  currentUser: any;
  onLogout: () => void;
  onOpenCreateModal: () => void;
  onOpenUsersModal: () => void;
  onOpenCategoriesModal?: () => void;
  onSyncDb: () => void;
  syncing: boolean;
  projectCounts: Record<string, number>;
  categoriesList?: CategoryItem[];
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const LytHomesSidebar: React.FC<LytHomesSidebarProps> = ({
  activeCategory,
  onSelectCategory,
  currentUser,
  onLogout,
  onOpenCreateModal,
  onOpenUsersModal,
  onOpenCategoriesModal,
  onSyncDb,
  syncing,
  projectCounts,
  categoriesList = [],
  mobileOpen,
  onMobileClose
}) => {
  const isAdmin = currentUser?.isSystemAdmin || currentUser?.role?.includes('Admin') || currentUser?.role?.includes('Managing Director');

  const renderNavIcon = (type: string) => {
    switch (type) {
      case 'tower': return <ApartmentIcon fontSize="small" />;
      case 'road': return <EngineeringIcon fontSize="small" />;
      case 'warehouse': return <WarehouseIcon fontSize="small" />;
      case 'brush': return <BrushIcon fontSize="small" />;
      case 'solar': return <SolarPowerIcon fontSize="small" />;
      default: return <HomeWorkIcon fontSize="small" />;
    }
  };

  const drawerContent = (
    <Box sx={{ width: 280, background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Brand Header */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: '12px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FoundationIcon sx={{ color: '#ffffff', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#ffffff', lineHeight: 1.1, fontSize: '0.98rem' }}>
              LytHomes Co.
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.68rem', letterSpacing: 0.5 }}>
              CIVIL ENGINE PORTAL
            </Typography>
          </Box>
        </Box>

        <IconButton onClick={onMobileClose} sx={{ display: { md: 'none' }, color: '#94a3b8' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* User Info Card */}
      <Box sx={{ p: 2 }}>
        <Paper elevation={0} sx={{ p: 1.5, background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Avatar sx={{ width: 34, height: 34, background: '#f59e0b', fontSize: '0.85rem', fontWeight: 800 }}>
              {currentUser?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.name || 'Staff User'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.68rem', display: 'block' }}>
                {currentUser?.dept || 'Engineering'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Chip
              label={currentUser?.role || 'Engineer'}
              size="small"
              sx={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', fontWeight: 800, fontSize: '0.62rem', height: 20 }}
            />
            <Button
              size="small"
              onClick={onLogout}
              startIcon={<LogoutIcon sx={{ fontSize: 13 }} />}
              sx={{ color: '#ef4444', fontSize: '0.7rem', p: 0, minWidth: 'auto', textTransform: 'none', fontWeight: 700 }}
            >
              Sign out
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ px: 2, display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => {
            onOpenCreateModal();
            onMobileClose();
          }}
          sx={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#ffffff',
            fontWeight: 800,
            textTransform: 'none',
            borderRadius: '10px',
            py: 1,
            fontSize: '0.82rem',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
            '&:hover': { background: '#d97706' }
          }}
        >
          Create Project
        </Button>

        {isAdmin && (
          <Stack spacing={1}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PeopleAltIcon />}
              onClick={() => {
                onOpenUsersModal();
                onMobileClose();
              }}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: '#e2e8f0',
                fontWeight: 800,
                textTransform: 'none',
                borderRadius: '10px',
                py: 0.8,
                whiteSpace: 'nowrap',
                fontSize: '0.78rem',
                '&:hover': { borderColor: '#f59e0b', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.05)' }
              }}
            >
              Engineering Staff & RBAC
            </Button>

            {onOpenCategoriesModal && (
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FolderSpecialIcon />}
                onClick={() => {
                  onOpenCategoriesModal();
                  onMobileClose();
                }}
                sx={{
                  borderColor: 'rgba(245, 158, 11, 0.3)',
                  color: '#f59e0b',
                  fontWeight: 800,
                  textTransform: 'none',
                  borderRadius: '10px',
                  py: 0.8,
                  whiteSpace: 'nowrap',
                  fontSize: '0.78rem',
                  '&:hover': { borderColor: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }
                }}
              >
                Manage Portfolios (CRUD)
              </Button>
            )}
          </Stack>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />

      {/* Categories Navigation List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1.5 }}>
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, px: 1.5, mb: 1, display: 'block', letterSpacing: 0.5, fontSize: '0.68rem' }}>
          CONSTRUCTION PORTFOLIOS
        </Typography>

        <List disablePadding>
          {/* ALL Portfolio Option */}
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={activeCategory === 'ALL'}
              onClick={() => {
                onSelectCategory('ALL');
                onMobileClose();
              }}
              sx={{
                borderRadius: '10px',
                py: 1,
                px: 1.5,
                color: activeCategory === 'ALL' ? '#ffffff' : '#94a3b8',
                background: activeCategory === 'ALL' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                borderLeft: activeCategory === 'ALL' ? '3px solid #f59e0b' : '3px solid transparent',
                '&:hover': { background: 'rgba(255, 255, 255, 0.05)', color: '#ffffff' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 34, color: activeCategory === 'ALL' ? '#f59e0b' : '#64748b' }}>
                <FoundationIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="All Portfolios"
                primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: activeCategory === 'ALL' ? 800 : 600, noWrap: true }}
              />
              <Chip
                label={projectCounts['ALL'] || 0}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  background: activeCategory === 'ALL' ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)',
                  color: activeCategory === 'ALL' ? '#ffffff' : '#94a3b8'
                }}
              />
            </ListItemButton>
          </ListItem>

          {/* Dynamic Categories List */}
          {categoriesList.map((cat) => {
            const isSelected = activeCategory === cat.id;
            const count = projectCounts[cat.id] || 0;

            return (
              <ListItem key={cat.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onMobileClose();
                  }}
                  sx={{
                    borderRadius: '10px',
                    py: 1,
                    px: 1.5,
                    color: isSelected ? '#ffffff' : '#94a3b8',
                    background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                    borderLeft: isSelected ? '3px solid #f59e0b' : '3px solid transparent',
                    '&:hover': { background: 'rgba(255, 255, 255, 0.05)', color: '#ffffff' }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 34, color: isSelected ? '#f59e0b' : '#64748b' }}>
                    {renderNavIcon(cat.iconType)}
                  </ListItemIcon>
                  <ListItemText
                    primary={cat.label}
                    primaryTypographyProps={{
                      fontSize: '0.82rem',
                      fontWeight: isSelected ? 800 : 600,
                      noWrap: true
                    }}
                  />
                  <Chip
                    label={count}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      background: isSelected ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)',
                      color: isSelected ? '#ffffff' : '#94a3b8'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Sync Engine Footer Button */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button
          fullWidth
          size="small"
          variant="outlined"
          onClick={onSyncDb}
          disabled={syncing}
          startIcon={<RefreshIcon className={syncing ? 'animate-spin' : ''} />}
          sx={{
            color: '#a5f3fc',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            textTransform: 'none',
            fontSize: '0.75rem',
            fontWeight: 700,
            borderRadius: '8px',
            py: 0.8,
            whiteSpace: 'nowrap',
            '&:hover': { borderColor: '#a5f3fc', background: 'rgba(255, 255, 255, 0.05)' }
          }}
        >
          {syncing ? 'Syncing Engine...' : 'Sync Engine Database'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop Permanent Drawer */}
      <Box component="nav" sx={{ width: { md: 280 }, flexShrink: { md: 0 }, display: { xs: 'none', md: 'block' } }}>
        <Drawer variant="permanent" open sx={{ '& .MuiDrawer-paper': { width: 280, boxSizing: 'border-box', borderRight: 'none' } }}>
          {drawerContent}
        </Drawer>
      </Box>

      {/* Mobile Temporary Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 280, boxSizing: 'border-box' } }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};
