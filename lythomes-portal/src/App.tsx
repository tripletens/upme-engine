import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  LinearProgress,
  Stack,
  Divider,
  Paper,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import FoundationIcon from '@mui/icons-material/Foundation';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ApartmentIcon from '@mui/icons-material/Apartment';
import EngineeringIcon from '@mui/icons-material/Engineering';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import BrushIcon from '@mui/icons-material/Brush';
import VerifiedIcon from '@mui/icons-material/Verified';
import KeyIcon from '@mui/icons-material/Key';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuIcon from '@mui/icons-material/Menu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';

import { LytHomesSidebar } from './components/LytHomesSidebar';
import { LytHomesLoginView } from './components/LytHomesLoginView';
import { LytHomesProjectDetailView } from './components/LytHomesProjectDetailView';
import { CreateLytHomesProjectView } from './components/CreateLytHomesProjectView';
import { LytHomesOrgUsersView } from './components/LytHomesOrgUsersView';

export const App: React.FC = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Full Page Navigation Routing States
  const [selectedDetailProject, setSelectedDetailProject] = useState<any>(null);
  const [isCreatingProjectView, setIsCreatingProjectView] = useState(false);
  const [isUsersViewOpen, setIsUsersViewOpen] = useState(false);

  const [alertMsg, setAlertMsg] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [lytProjects, setLytProjects] = useState<any[]>([]);

  // Logged-in Staff User State (Safe JSON Parse)
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const savedUser = localStorage.getItem('lythomes_current_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (err) {
      localStorage.removeItem('lythomes_current_user');
      return null;
    }
  });

  const [activeCategory, setActiveCategory] = useState<string>(() => {
    return currentUser?.allowedCategory || 'ALL';
  });

  const isAdmin = currentUser?.isSystemAdmin || currentUser?.role?.includes('Admin') || currentUser?.role?.includes('Managing Director');
  const userAllowedCategory = currentUser?.allowedCategory || 'ALL';

  const initialLytHomesProjects = [
    {
      id: 1,
      uuid: 'lythomes-proj-001',
      location: 'Lekki Phase 1, Lagos',
      projectName: 'LytHomes Harmony Haven Estate - Phase 2',
      category: 'RESIDENTIAL_ESTATE',
      budget: '₦450,000,000',
      progress: 68,
      healthScore: 98.5,
      healthStatus: 'ON_TRACK',
      contractor: 'Julius Berger Nig. Plc',
      supervisor: 'Arch. Kenneth Nwosu',
      iconType: 'villa',
      milestones: [
        { id: 1, name: 'Phase 1: Site Acquisition, Soil Tests & Sub-base Foundation', progress: 100 },
        { id: 2, name: 'Phase 2: Reinforced Concrete Deck & Superstructure Columns', progress: 85 },
        { id: 3, name: 'Phase 3: Aluminum Roof Trussing & Smart Solar Utility Grid', progress: 50 },
        { id: 4, name: 'Phase 4: High-End Italian Marble & Interior Fit-Outs', progress: 35 },
        { id: 5, name: 'Phase 5: COREN Structural Certification & Key Handover', progress: 0 }
      ]
    },
    {
      id: 2,
      uuid: 'lythomes-proj-002',
      location: 'Victoria Island Annex, Lagos',
      projectName: 'LytHomes SkyTower Commercial Tech Hub',
      category: 'COMMERCIAL_TOWER',
      budget: '₦850,000,000',
      progress: 42,
      healthScore: 94.0,
      healthStatus: 'ON_TRACK',
      contractor: 'Apex Civil Engineering Ltd',
      supervisor: 'Engr. Sarah Jenkins',
      iconType: 'tower',
      milestones: [
        { id: 6, name: 'Phase 1: Deep Piling Excavation & Basements Retaining Wall', progress: 100 },
        { id: 7, name: 'Phase 2: 12-Story Structural Steel Framing & Floor Slabs', progress: 60 },
        { id: 8, name: 'Phase 3: Double-Glazed Curtain Wall Glass Facade', progress: 30 },
        { id: 9, name: 'Phase 4: High-Speed Elevators & Central HVAC Installation', progress: 10 },
        { id: 10, name: 'Phase 5: Commercial Occupancy COREN Audit', progress: 0 }
      ]
    },
    {
      id: 3,
      uuid: 'lythomes-proj-003',
      location: 'Epe Expressway Corridor, Lagos',
      projectName: 'LytHomes Industrial Logistics & Solar Microgrid',
      category: 'CIVIL_INFRASTRUCTURE',
      budget: '₦320,000,000',
      progress: 88,
      healthScore: 99.0,
      healthStatus: 'ON_TRACK',
      contractor: 'Cappa & D\'Alberto Plc',
      supervisor: 'Engr. Tunde Bakare',
      iconType: 'road',
      milestones: [
        { id: 11, name: 'Phase 1: Heavy Dual-Carriageway Asphalt Paving & Drainage', progress: 100 },
        { id: 12, name: 'Phase 2: 500kW Industrial Roof Solar PV Array & Inverters', progress: 95 },
        { id: 13, name: 'Phase 3: High-Voltage Transformer Substation Grid Sync', progress: 70 },
        { id: 14, name: 'Phase 4: Final Infrastructure Commissioning', progress: 85 }
      ]
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('lythomes_current_user');
    setCurrentUser(null);
    setSelectedDetailProject(null);
    setIsCreatingProjectView(false);
    setIsUsersViewOpen(false);
  };

  const handleLoginSuccess = (user: any) => {
    localStorage.setItem('lythomes_current_user', JSON.stringify(user));
    setCurrentUser(user);
    setActiveCategory(user.allowedCategory || 'ALL');
  };

  // Fetch Projects from UPME Engine API & Merge Local Custom Projects
  const fetchEngineProjects = async () => {
    setLoading(true);
    const customSaved = JSON.parse(localStorage.getItem('lythomes_custom_projects') || '[]');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/projects', {
        headers: {
          'X-Organization-Code': 'LYTHOMES-CONSTRUCTION-CO',
          'X-Api-Key': 'upme_live_sec_lythomes_9c8d7e6f',
          'Accept': 'application/json'
        }
      });
      const data = await res.json();
      setLoading(false);

      if (data.status === 'success' && data.data && data.data.length > 0) {
        const mapped = data.data.map((p: any) => ({
          id: p.id,
          uuid: p.uuid,
          location: p.description?.includes('in ') ? p.description.split('in ')[1].split('.')[0] : 'Lagos, Nigeria',
          projectName: p.name,
          category: p.category || 'RESIDENTIAL_ESTATE',
          budget: p.budget_naira || '₦350,000,000',
          progress: p.overall_progress || 50,
          healthScore: 98.5,
          healthStatus: p.health_status || 'ON_TRACK',
          contractor: p.contractor || 'Julius Berger Plc',
          supervisor: p.supervisor || 'Engr. Michael Vance',
          iconType: p.category === 'COMMERCIAL_TOWER' ? 'tower' : p.category === 'CIVIL_INFRASTRUCTURE' ? 'road' : 'villa',
          milestones: p.milestones || []
        }));

        const combined = [...customSaved, ...mapped];
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
        setLytProjects(unique);
      } else {
        const combined = [...customSaved, ...initialLytHomesProjects];
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
        setLytProjects(unique);
      }
    } catch (err) {
      setLoading(false);
      const combined = [...customSaved, ...initialLytHomesProjects];
      const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
      setLytProjects(unique);
    }
  };

  const handleProjectCreated = (newProj: any) => {
    // Save to local storage for persistence across reloads/syncs
    const saved = JSON.parse(localStorage.getItem('lythomes_custom_projects') || '[]');
    const updatedCustoms = [newProj, ...saved];
    localStorage.setItem('lythomes_custom_projects', JSON.stringify(updatedCustoms));

    setLytProjects((prev) => [newProj, ...prev]);
    setActiveCategory('ALL'); // Reset category filter to ALL so the newly created project immediately appears!
    setAlertMsg(`🎉 Construction Project "${newProj.projectName}" created successfully!`);
  };

  useEffect(() => {
    if (currentUser) {
      fetchEngineProjects();
    }
  }, [currentUser]);

  const renderCategoryIcon = (type: string) => {
    switch (type) {
      case 'tower': return <ApartmentIcon sx={{ color: '#6366f1' }} />;
      case 'road': return <EngineeringIcon sx={{ color: '#06b6d4' }} />;
      case 'villa': return <HomeWorkIcon sx={{ color: '#10b981' }} />;
      default: return <FoundationIcon sx={{ color: '#f59e0b' }} />;
    }
  };

  // Role Scoped Filtering:
  const accessibleProjects = lytProjects.filter((p) => {
    if (isAdmin || userAllowedCategory === 'ALL') return true;
    return p.category === userAllowedCategory;
  });

  const projectCounts: Record<string, number> = {
    ALL: accessibleProjects.length,
    RESIDENTIAL_ESTATE: accessibleProjects.filter((p) => p.category === 'RESIDENTIAL_ESTATE').length,
    COMMERCIAL_TOWER: accessibleProjects.filter((p) => p.category === 'COMMERCIAL_TOWER').length,
    CIVIL_INFRASTRUCTURE: accessibleProjects.filter((p) => p.category === 'CIVIL_INFRASTRUCTURE').length,
    INDUSTRIAL_PARK: accessibleProjects.filter((p) => p.category === 'INDUSTRIAL_PARK').length,
    INTERIOR_RENOVATION: accessibleProjects.filter((p) => p.category === 'INTERIOR_RENOVATION').length
  };

  const filteredProjects = accessibleProjects.filter((p) => {
    if (isAdmin || userAllowedCategory === 'ALL') {
      if (activeCategory === 'ALL') return true;
      return p.category === activeCategory;
    }
    return true;
  });

  if (!currentUser) {
    return <LytHomesLoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100vh', background: '#f8fafc' }}>
      {/* Mobile Top AppBar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          display: { xs: 'flex', md: 'none' },
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 2, minHeight: 56 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => setMobileDrawerOpen(true)} sx={{ color: '#ffffff', p: 1 }}>
              <MenuIcon />
            </IconButton>
            <FoundationIcon sx={{ color: '#f59e0b', fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#ffffff', fontSize: '0.98rem', letterSpacing: -0.3 }}>
              LytHomes Co.
            </Typography>
          </Box>

          <Chip
            label={currentUser.role}
            size="small"
            sx={{ background: '#f59e0b', color: '#fff', fontWeight: 800, fontSize: '0.62rem', height: 22 }}
          />
        </Toolbar>
      </AppBar>

      {/* Navigation Sidebar */}
      <LytHomesSidebar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSelectedDetailProject(null);
          setIsCreatingProjectView(false);
          setIsUsersViewOpen(false);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenCreateModal={() => {
          setSelectedDetailProject(null);
          setIsUsersViewOpen(false);
          setIsCreatingProjectView(true);
        }}
        onOpenUsersModal={() => {
          setSelectedDetailProject(null);
          setIsCreatingProjectView(false);
          setIsUsersViewOpen(true);
        }}
        onSyncDb={fetchEngineProjects}
        syncing={loading}
        projectCounts={projectCounts}
        mobileOpen={mobileDrawerOpen}
        onMobileClose={() => setMobileDrawerOpen(false)}
      />

      {/* Main App Content View Router */}
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, overflowX: 'hidden' }}>
        {isCreatingProjectView ? (
          <CreateLytHomesProjectView
            onBack={() => setIsCreatingProjectView(false)}
            onProjectCreated={handleProjectCreated}
          />
        ) : isUsersViewOpen ? (
          <LytHomesOrgUsersView
            onBack={() => setIsUsersViewOpen(false)}
          />
        ) : selectedDetailProject ? (
          <LytHomesProjectDetailView
            project={selectedDetailProject}
            onBack={() => setSelectedDetailProject(null)}
            onUpdateProject={(updatedProj) => {
              setSelectedDetailProject(updatedProj);
              setLytProjects((prev) => prev.map((p) => (p.id === updatedProj.id ? updatedProj : p)));
            }}
          />
        ) : (
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Header Dashboard Banner */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5, md: 4 },
                mb: 3,
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)',
                color: '#ffffff',
                border: '1px solid #334155',
                boxShadow: '0 12px 30px rgba(15, 23, 42, 0.3)'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: '70%' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<FoundationIcon sx={{ color: '#fff !important', fontSize: 14 }} />}
                      label="LYTHOMES CIVIL PORTAL"
                      size="small"
                      sx={{ background: '#f59e0b', color: '#fff', fontWeight: 800, fontSize: '0.62rem', height: 24 }}
                    />
                    <Chip
                      icon={<VerifiedIcon sx={{ color: '#fff !important', fontSize: 13 }} />}
                      label="LIVE ENGINE"
                      size="small"
                      sx={{ background: '#10b981', color: '#fff', fontWeight: 800, fontSize: '0.62rem', height: 24 }}
                    />
                  </Box>

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 900,
                      letterSpacing: -0.5,
                      mb: 1,
                      fontSize: { xs: '1.35rem', sm: '1.8rem', md: '2.2rem' },
                      lineHeight: 1.2
                    }}
                  >
                    {isAdmin
                      ? activeCategory === 'ALL'
                        ? 'All Construction & Civil Projects'
                        : activeCategory === 'RESIDENTIAL_ESTATE'
                        ? 'Residential Estates & Luxury Villas'
                        : activeCategory === 'COMMERCIAL_TOWER'
                        ? 'Commercial Towers & Tech Hubs'
                        : activeCategory === 'CIVIL_INFRASTRUCTURE'
                        ? 'Civil Roads & Microgrids'
                        : activeCategory === 'INDUSTRIAL_PARK'
                        ? 'Logistics Parks & Warehousing'
                        : 'Interior Architectural Fit-outs'
                      : `${currentUser.dept} Projects Portfolio`}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: { xs: '0.8rem', sm: '0.88rem' } }}>
                    LytHomes Civil Infrastructure Projects Budgeted in Nigerian Naira (₦).
                  </Typography>
                </Box>

                {/* Single Line Action Buttons Layout on Mobile */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 1.5,
                    width: { xs: '100%', sm: 'auto' },
                    mt: { xs: 1.5, sm: 0 }
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => setIsCreatingProjectView(true)}
                    sx={{
                      width: { xs: '100%', sm: 'auto' },
                      height: 42,
                      whiteSpace: 'nowrap',
                      fontSize: '0.85rem',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: '#fff',
                      textTransform: 'none',
                      fontWeight: 800,
                      px: 3.5,
                      borderRadius: '10px',
                      boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
                      '&:hover': { background: '#d97706' }
                    }}
                  >
                    Create Project
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <RefreshIcon />}
                    onClick={fetchEngineProjects}
                    sx={{
                      width: { xs: '100%', sm: 'auto' },
                      height: 42,
                      whiteSpace: 'nowrap',
                      fontSize: '0.85rem',
                      color: '#a5f3fc',
                      borderColor: 'rgba(255,255,255,0.3)',
                      textTransform: 'none',
                      fontWeight: 700,
                      px: 3,
                      borderRadius: '10px',
                      '&:hover': { borderColor: '#a5f3fc', background: 'rgba(255,255,255,0.05)' }
                    }}
                  >
                    Sync DB
                  </Button>
                </Box>
              </Box>
            </Paper>

            {alertMsg && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setAlertMsg('')}>
                {alertMsg}
              </Alert>
            )}

            {/* Scope Alert */}
            {!isAdmin && (
              <Alert severity="info" icon={<KeyIcon />} sx={{ mb: 3, borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem' }}>
                Logged in as <strong>{currentUser.name} ({currentUser.role})</strong>. Projects are scoped specifically to <strong>{currentUser.dept}</strong> ({accessibleProjects.length} Active Projects).
              </Alert>
            )}

            {/* Construction Projects Cards Grid */}
            {filteredProjects.length === 0 ? (
              <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: '20px', background: '#ffffff', border: '1px dashed #cbd5e1' }}>
                <FoundationIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                  No Active Construction Projects in Category: {activeCategory}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 3, fontSize: '0.85rem' }}>
                  Click below to instantiate a new construction project baseline in the UPME Engine.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => setIsCreatingProjectView(true)}
                  sx={{ background: '#f59e0b', color: '#fff', borderRadius: '10px', px: 3.5, py: 1.2, fontWeight: 800, textTransform: 'none' }}
                >
                  Instantiate First Construction Baseline
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={2.5}>
                {filteredProjects.map((proj) => (
                  <Grid item xs={12} sm={12} md={6} key={proj.id}>
                    <Card
                      onClick={() => setSelectedDetailProject(proj)}
                      sx={{
                        borderRadius: '18px',
                        border: '1px solid #e2e8f0',
                        boxShadow: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': { borderColor: '#f59e0b', boxShadow: '0 12px 25px rgba(245, 158, 11, 0.15)' }
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {renderCategoryIcon(proj.iconType)}
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.78rem' }}>
                                {proj.location}
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem', lineHeight: 1.2 }}>
                                {proj.projectName}
                              </Typography>
                            </Box>
                          </Box>

                          <Chip
                            label={`HEALTH: ${proj.healthScore}/100`}
                            size="small"
                            sx={{ fontWeight: 800, fontSize: '0.65rem', height: 22, background: '#ecfdf5', color: '#047857' }}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, p: 2, background: '#f8fafc', borderRadius: '10px' }}>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', fontSize: '0.68rem' }}>
                              BOQ BUDGET (NAIRA ₦)
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', fontSize: { xs: '1.15rem', sm: '1.35rem' } }}>
                              {proj.budget}
                            </Typography>
                          </Box>

                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', fontSize: '0.68rem' }}>
                              PHYSICAL PROGRESS
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#f59e0b', fontSize: { xs: '1.15rem', sm: '1.35rem' } }}>
                              {proj.progress}%
                            </Typography>
                          </Box>
                        </Box>

                        <LinearProgress
                          variant="determinate"
                          value={proj.progress}
                          sx={{ height: 8, borderRadius: 4, mb: 2, background: '#e2e8f0', '& .MuiLinearProgress-bar': { background: '#f59e0b' } }}
                        />

                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>
                          Contractor: <strong>{proj.contractor}</strong> • Lead: {proj.supervisor}
                        </Typography>

                        <Divider sx={{ my: 1.5 }} />

                        {/* Card Action Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mt: 1 }}>
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>
                            {proj.milestones?.length || 0} Quality Stages & Proof Docs
                          </Typography>

                          <Button
                            size="small"
                            variant="contained"
                            endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDetailProject(proj);
                            }}
                            sx={{
                              fontSize: '0.78rem',
                              textTransform: 'none',
                              fontWeight: 800,
                              whiteSpace: 'nowrap',
                              height: 36,
                              px: 2.5,
                              borderRadius: '10px',
                              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                              color: '#ffffff',
                              width: { xs: '100%', sm: 'auto' },
                              '&:hover': { background: '#1e293b' }
                            }}
                          >
                            View Project Details
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default App;
