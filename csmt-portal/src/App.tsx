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
import SchoolIcon from '@mui/icons-material/School';
import ComputerIcon from '@mui/icons-material/Computer';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import HotelIcon from '@mui/icons-material/Hotel';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import VerifiedIcon from '@mui/icons-material/Verified';
import KeyIcon from '@mui/icons-material/Key';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuIcon from '@mui/icons-material/Menu';

import { UpdateCsmtTaskModal } from './components/UpdateCsmtTaskModal';
import { CsmtLoginModal } from './components/CsmtLoginModal';
import { CsmtLoginView } from './components/CsmtLoginView';
import { CsmtSidebar } from './components/CsmtSidebar';
import { CsmtProjectDetailView } from './components/CsmtProjectDetailView';
import { CreateCsmtProjectView } from './components/CreateCsmtProjectView';
import { CsmtOrgUsersView } from './components/CsmtOrgUsersView';

export const App: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Full Page Navigation States
  const [selectedDetailProject, setSelectedDetailProject] = useState<any>(null);
  const [isCreatingProjectView, setIsCreatingProjectView] = useState(false);
  const [isUsersViewOpen, setIsUsersViewOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [alertMsg, setAlertMsg] = useState('');

  const [loading, setLoading] = useState<boolean>(false);
  const [csmtProjects, setCsmtProjects] = useState<any[]>([]);

  // Logged-in Staff User State (Safe JSON Parse)
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const savedUser = localStorage.getItem('csmt_current_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (err) {
      localStorage.removeItem('csmt_current_user');
      return null;
    }
  });

  const [activeCategory, setActiveCategory] = useState<string>(() => {
    return currentUser?.allowedCategory || 'ALL';
  });

  const isAdmin = currentUser?.isSystemAdmin || currentUser?.role?.includes('Admin');
  const userAllowedCategory = currentUser?.allowedCategory || 'ALL';

  const handleLogout = () => {
    localStorage.removeItem('csmt_current_user');
    setCurrentUser(null);
    setSelectedDetailProject(null);
    setIsCreatingProjectView(false);
    setIsUsersViewOpen(false);
  };

  const handleLoginSuccess = (user: any) => {
    localStorage.setItem('csmt_current_user', JSON.stringify(user));
    setCurrentUser(user);
    setActiveCategory(user.allowedCategory || 'ALL');
    setLoginModalOpen(false);
  };

  // Fetch Live Database Engine Projects
  const fetchLiveEngineProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/projects', {
        headers: {
          'X-Organization-Code': 'CSMT-SCHOOLS-DISTRICT',
          'X-Api-Key': 'upme_live_sec_csmt_schools_8f9a0b1c',
          'Accept': 'application/json'
        }
      });
      const data = await res.json();
      setLoading(false);

      if (data.status === 'success' && data.data && data.data.length > 0) {
        const mapped = data.data.map((p: any) => {
          const milestones = (p.milestones || []).map((m: any) => {
            const activities = (m.activities || []).map((a: any) => ({
              id: a.id,
              name: a.name,
              progress: a.progress,
              status: a.status
            }));
            return {
              id: m.id,
              name: m.name,
              progress: m.progress,
              activities
            };
          });

          const allTasks = milestones.flatMap((m: any) =>
            m.activities.length > 0
              ? m.activities
              : [{ id: m.id, name: m.name, progress: m.progress }]
          );

          const computedProgress = allTasks.length > 0
            ? Math.round(allTasks.reduce((sum: number, t: any) => sum + Number(t.progress || 0), 0) / allTasks.length)
            : p.overall_progress;

          return {
            id: p.id,
            uuid: p.uuid,
            schoolName: 'CSMT Science & Technology Campus',
            projectName: p.name,
            category: p.code?.includes('LIB') ? 'LIBRARY' : p.code?.includes('SPORTS') ? 'SPORTS' : p.code?.includes('HOSTEL') ? 'HOSTEL' : p.code?.includes('CLUBS') ? 'CLUBS' : 'ACADEMIC_LAB',
            location: 'Main Campus',
            budget: '₦35,000,000',
            progress: computedProgress,
            healthScore: computedProgress === 100 ? 100.0 : (p.health_status === 'ON_TRACK' ? 94.5 : 68.0),
            healthStatus: computedProgress === 100 ? 'ON_TRACK' : p.health_status,
            supervisor: 'Dr. Robert Vance (HOD Computer Science)',
            iconType: p.code?.includes('LIB') ? 'book' : p.code?.includes('SPORTS') ? 'sports' : p.code?.includes('HOSTEL') ? 'hotel' : p.code?.includes('CLUBS') ? 'robotics' : 'computer',
            milestones: allTasks
          };
        });

        setCsmtProjects(mapped);
      } else {
        setCsmtProjects([]);
      }
    } catch (err) {
      setLoading(false);
      setCsmtProjects([]);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchLiveEngineProjects();
    }
  }, [currentUser]);

  const renderIcon = (type: string) => {
    switch (type) {
      case 'computer': return <ComputerIcon sx={{ color: '#4f46e5' }} />;
      case 'book': return <MenuBookIcon sx={{ color: '#0284c7' }} />;
      case 'sports': return <SportsSoccerIcon sx={{ color: '#d97706' }} />;
      case 'hotel': return <HotelIcon sx={{ color: '#059669' }} />;
      case 'robotics': return <PrecisionManufacturingIcon sx={{ color: '#7c3aed' }} />;
      default: return <SchoolIcon sx={{ color: '#4f46e5' }} />;
    }
  };

  // Role-Based Projects Filtering:
  const accessibleProjects = csmtProjects.filter((p) => {
    if (isAdmin || userAllowedCategory === 'ALL') return true;
    return p.category === userAllowedCategory;
  });

  const projectCounts: Record<string, number> = {
    ALL: accessibleProjects.length,
    ACADEMIC_LAB: accessibleProjects.filter((p) => p.category === 'ACADEMIC_LAB').length,
    LIBRARY: accessibleProjects.filter((p) => p.category === 'LIBRARY').length,
    SPORTS: accessibleProjects.filter((p) => p.category === 'SPORTS').length,
    HOSTEL: accessibleProjects.filter((p) => p.category === 'HOSTEL').length,
    CLUBS: accessibleProjects.filter((p) => p.category === 'CLUBS').length
  };

  const filteredProjects = accessibleProjects.filter((p) => {
    if (isAdmin || userAllowedCategory === 'ALL') {
      if (activeCategory === 'ALL') return true;
      return p.category === activeCategory;
    }
    return true;
  });

  // Render Fullscreen Staff Login Screen if User is Not Logged In
  if (!currentUser) {
    return <CsmtLoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100vh', background: '#f8fafc' }}>
      {/* Premium Mobile Top App Bar Navigation */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          display: { xs: 'flex', md: 'none' },
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 2, minHeight: 56 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => setMobileDrawerOpen(true)} sx={{ color: '#ffffff', p: 1 }}>
              <MenuIcon />
            </IconButton>
            <SchoolIcon sx={{ color: '#38bdf8', fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#ffffff', fontSize: '0.98rem', letterSpacing: -0.3 }}>
              CSMT Schools
            </Typography>
          </Box>

          <Chip
            label={currentUser.role}
            size="small"
            sx={{
              background: '#4f46e5',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.62rem',
              height: 22,
              px: 0.5
            }}
          />
        </Toolbar>
      </AppBar>

      {/* Responsive Navigation Sidebar */}
      <CsmtSidebar
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
        onSyncDb={fetchLiveEngineProjects}
        syncing={loading}
        projectCounts={projectCounts}
        mobileOpen={mobileDrawerOpen}
        onMobileClose={() => setMobileDrawerOpen(false)}
      />

      {/* Main Dashboard Content Area */}
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, overflowX: 'hidden' }}>
        {/* Full Page Navigation Routing */}
        {isCreatingProjectView ? (
          <CreateCsmtProjectView
            onBack={() => setIsCreatingProjectView(false)}
            onProjectCreated={(newProj) => {
              setCsmtProjects((prev) => [newProj, ...prev]);
              setAlertMsg(`🎉 Real School Project "${newProj.projectName}" created in live database!`);
            }}
          />
        ) : isUsersViewOpen ? (
          <CsmtOrgUsersView
            onBack={() => setIsUsersViewOpen(false)}
          />
        ) : selectedDetailProject ? (
          <CsmtProjectDetailView
            project={selectedDetailProject}
            onBack={() => setSelectedDetailProject(null)}
            onUpdateProject={(updatedProj) => {
              setSelectedDetailProject(updatedProj);
              setCsmtProjects((prev) => prev.map((p) => (p.id === updatedProj.id ? updatedProj : p)));
            }}
          />
        ) : (
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Ultra-Sleek Responsive Header Banner */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5, md: 4 },
                mb: 3,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                color: '#ffffff',
                border: '1px solid #4338ca',
                boxShadow: '0 10px 25px rgba(30, 27, 75, 0.2)'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: '70%' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<SchoolIcon sx={{ color: '#fff !important', fontSize: 14 }} />}
                      label="CSMT DISTRICT PORTAL"
                      size="small"
                      sx={{ background: '#4f46e5', color: '#fff', fontWeight: 800, fontSize: '0.62rem', height: 24 }}
                    />
                    <Chip
                      icon={<VerifiedIcon sx={{ color: '#fff !important', fontSize: 13 }} />}
                      label="LIVE DATABASE"
                      size="small"
                      sx={{ background: '#059669', color: '#fff', fontWeight: 800, fontSize: '0.62rem', height: 24 }}
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
                        ? 'All District Projects Portfolio'
                        : activeCategory === 'ACADEMIC_LAB'
                        ? 'Academic CS & AI Laboratories'
                        : activeCategory === 'LIBRARY'
                        ? 'Digital Library & E-Readers'
                        : activeCategory === 'SPORTS'
                        ? 'Sports Turf Complex'
                        : activeCategory === 'HOSTEL'
                        ? 'Student Hostels'
                        : 'STEM Robotics Clubs'
                      : `${currentUser.dept} Projects Portfolio`}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#c7d2fe', fontSize: { xs: '0.8rem', sm: '0.88rem' } }}>
                    Multi-Campus Educational Projects Portfolio Budgeted in Nigerian Naira (₦).
                  </Typography>
                </Box>

                {/* Stacked Full-Width Action Buttons Layout on Mobile */}
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
                    startIcon={<AddCircleOutlineIcon sx={{ fontSize: '18px !important' }} />}
                    onClick={() => setIsCreatingProjectView(true)}
                    sx={{
                      width: { xs: '100%', sm: 'auto' },
                      height: 42,
                      whiteSpace: 'nowrap',
                      fontSize: '0.85rem',
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      color: '#fff',
                      textTransform: 'none',
                      fontWeight: 800,
                      px: 3.5,
                      borderRadius: '10px',
                      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                      '&:hover': { background: '#047857' }
                    }}
                  >
                    Create Project
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <RefreshIcon />}
                    onClick={fetchLiveEngineProjects}
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

            {/* Role Scope Info Notification */}
            {!isAdmin && (
              <Alert severity="info" icon={<KeyIcon />} sx={{ mb: 3, borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem' }}>
                Logged in as <strong>{currentUser.name} ({currentUser.role})</strong>. Projects are scoped specifically to <strong>{currentUser.dept}</strong> ({accessibleProjects.length} Active Projects).
              </Alert>
            )}

            {/* Project Cards Grid */}
            {filteredProjects.length === 0 ? (
              <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: '16px', background: '#ffffff', border: '1px dashed #cbd5e1' }}>
                <SchoolIcon sx={{ fontSize: 44, color: '#94a3b8', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 1, fontSize: '1.05rem' }}>
                  No Active Projects Found for Category: {activeCategory}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 3, fontSize: '0.85rem' }}>
                  Click below to instantiate a new project baseline directly inside the UPME Engine (`CSMT-SCHOOLS-DISTRICT`).
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => setIsCreatingProjectView(true)}
                  sx={{ background: '#4f46e5', color: '#fff', borderRadius: '10px', px: 3, py: 1.2, fontWeight: 800, textTransform: 'none' }}
                >
                  Create First Project Baseline
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={2.5}>
                {filteredProjects.map((proj) => (
                  <Grid item xs={12} sm={12} md={6} key={proj.id}>
                    <Card
                      onClick={() => setSelectedDetailProject(proj)}
                      sx={{
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        boxShadow: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': { borderColor: '#4f46e5', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.12)' }
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {renderIcon(proj.iconType)}
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.78rem' }}>
                                {proj.schoolName}
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem', lineHeight: 1.2 }}>
                                {proj.projectName}
                              </Typography>
                            </Box>
                          </Box>

                          <Chip
                            label={`HEALTH: ${proj.healthScore}/100`}
                            size="small"
                            sx={{
                              fontWeight: 800,
                              fontSize: '0.65rem',
                              height: 22,
                              background: proj.healthStatus === 'ON_TRACK' ? '#ecfdf5' : '#fef3c7',
                              color: proj.healthStatus === 'ON_TRACK' ? '#047857' : '#b45309'
                            }}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, p: 2, background: '#f8fafc', borderRadius: '10px' }}>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', fontSize: '0.68rem' }}>
                              BUDGET ALLOCATED (NAIRA)
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#059669', fontSize: { xs: '1.15rem', sm: '1.35rem' } }}>
                              {proj.budget}
                            </Typography>
                          </Box>

                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', fontSize: '0.68rem' }}>
                              COMPLETION PROGRESS
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#4f46e5', fontSize: { xs: '1.15rem', sm: '1.35rem' } }}>
                              {proj.progress}%
                            </Typography>
                          </Box>
                        </Box>

                        <LinearProgress
                          variant="determinate"
                          value={proj.progress}
                          sx={{ height: 8, borderRadius: 4, mb: 2, background: '#e2e8f0', '& .MuiLinearProgress-bar': { background: '#4f46e5' } }}
                        />

                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>
                          Lead Supervisor: <strong>{proj.supervisor}</strong>
                        </Typography>

                        <Divider sx={{ my: 1.5 }} />

                        {/* Redesigned Sleek Card Action Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mt: 1 }}>
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem' }}>
                            {proj.milestones?.length || 0} Milestone Stages & Audit Docs
                          </Typography>

                          <Button
                            size="small"
                            variant="contained"
                            endIcon={<ArrowForwardIcon sx={{ fontSize: 15, transition: 'transform 0.2s ease' }} />}
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
                              background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
                              color: '#ffffff',
                              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                              width: { xs: '100%', sm: 'auto' },
                              '&:hover': {
                                background: 'linear-gradient(135deg, #4338ca 0%, #1e1b4b 100%)',
                                '& .MuiSvgIcon-root': { transform: 'translateX(3px)' }
                              }
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

        {/* School Staff Login Modal */}
        <CsmtLoginModal
          open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </Box>
    </Box>
  );
};

export default App;
