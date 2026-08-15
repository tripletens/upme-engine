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
  CircularProgress
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

import { UpdateCsmtTaskModal } from './components/UpdateCsmtTaskModal';
import { CsmtLoginModal } from './components/CsmtLoginModal';
import { CreateCsmtProjectModal } from './components/CreateCsmtProjectModal';
import { StageDocumentViewerModal } from './components/StageDocumentViewerModal';
import { CsmtLoginView } from './components/CsmtLoginView';
import { CsmtOrgUsersModal } from './components/CsmtOrgUsersModal';
import { CsmtSidebar } from './components/CsmtSidebar';

export const App: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [usersModalOpen, setUsersModalOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedStage, setSelectedStage] = useState<any>(null);
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

  const handleLogout = () => {
    localStorage.removeItem('csmt_current_user');
    setCurrentUser(null);
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

  const handleOpenTaskModal = (proj: any, task: any) => {
    setSelectedProject(proj);
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleOpenDocModal = (proj: any, stage: any) => {
    setSelectedProject(proj);
    setSelectedStage(stage);
    setDocModalOpen(true);
  };

  const handleTaskSaved = (newProgress: number, notes: string, fileName: string) => {
    if (!selectedProject || !selectedTask) return;

    setCsmtProjects((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== selectedProject.id) return p;

        const updatedMilestones = p.milestones.map((m: any) => {
          if (m.id === selectedTask.id || m.name === selectedTask.name) {
            return { ...m, progress: newProgress };
          }
          return m;
        });

        const avgProgress = Math.round(
          updatedMilestones.reduce((sum: number, m: any) => sum + Number(m.progress || 0), 0) / updatedMilestones.length
        );

        return {
          ...p,
          progress: avgProgress,
          healthScore: avgProgress === 100 ? 100.0 : p.healthScore,
          healthStatus: avgProgress === 100 ? 'ON_TRACK' : p.healthStatus,
          milestones: updatedMilestones
        };
      });

      return updated;
    });

    setAlertMsg(
      `🎉 Task "${selectedTask.name}" updated to ${newProgress}% by ${currentUser.name}! Saved directly to live database.`
    );
  };

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

  // Compute Project Counts per Category for Sidebar Badges
  const projectCounts: Record<string, number> = {
    ALL: csmtProjects.length,
    ACADEMIC_LAB: csmtProjects.filter((p) => p.category === 'ACADEMIC_LAB').length,
    LIBRARY: csmtProjects.filter((p) => p.category === 'LIBRARY').length,
    SPORTS: csmtProjects.filter((p) => p.category === 'SPORTS').length,
    HOSTEL: csmtProjects.filter((p) => p.category === 'HOSTEL').length,
    CLUBS: csmtProjects.filter((p) => p.category === 'CLUBS').length
  };

  // Role-Based Filtering Logic:
  const userAllowedCategory = currentUser?.allowedCategory || 'ALL';

  const filteredProjects = csmtProjects.filter((p) => {
    if (!isAdmin && userAllowedCategory !== 'ALL' && p.category !== userAllowedCategory) {
      return false;
    }
    if (activeCategory === 'ALL') return true;
    return p.category === activeCategory;
  });

  // Render Fullscreen Staff Login Screen if User is Not Logged In
  if (!currentUser) {
    return <CsmtLoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sleek Left Navigation Sidebar */}
      <CsmtSidebar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenCreateModal={() => setCreateModalOpen(true)}
        onOpenUsersModal={() => setUsersModalOpen(true)}
        onSyncDb={fetchLiveEngineProjects}
        syncing={loading}
        projectCounts={projectCounts}
      />

      {/* Main Dashboard Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, overflowX: 'hidden' }}>
        {/* Top Header Card */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            color: '#ffffff',
            border: '1px solid #4338ca'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Chip
                  icon={<SchoolIcon sx={{ color: '#fff !important', fontSize: 16 }} />}
                  label="CSMT SCHOOLS DISTRICT PORTAL"
                  sx={{ background: '#4f46e5', color: '#fff', fontWeight: 800 }}
                />
                <Chip
                  icon={<VerifiedIcon sx={{ color: '#fff !important', fontSize: 14 }} />}
                  label="CONNECTED TO LIVE DATABASE"
                  sx={{ background: '#059669', color: '#fff', fontWeight: 800 }}
                />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5, mb: 0.5 }}>
                {activeCategory === 'ALL'
                  ? 'All District Projects Portfolio'
                  : activeCategory === 'ACADEMIC_LAB'
                  ? 'Academic CS & AI Laboratories'
                  : activeCategory === 'LIBRARY'
                  ? 'Digital Library & E-Readers'
                  : activeCategory === 'SPORTS'
                  ? 'Sports Turf Complex'
                  : activeCategory === 'HOSTEL'
                  ? 'Student Hostels'
                  : 'STEM Robotics Clubs'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#c7d2fe' }}>
                Multi-Campus Educational Projects Portfolio Budgeted in Nigerian Naira (₦).
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Button
                variant="contained"
                size="small"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => setCreateModalOpen(true)}
                sx={{ background: '#059669', color: '#fff', textTransform: 'none', fontWeight: 800, px: 2, py: 1, borderRadius: '10px', '&:hover': { background: '#047857' } }}
              >
                Create Project
              </Button>

              <Button
                variant="outlined"
                size="small"
                startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <RefreshIcon />}
                onClick={fetchLiveEngineProjects}
                sx={{ color: '#a5f3fc', borderColor: 'rgba(255,255,255,0.3)', textTransform: 'none', fontWeight: 700, borderRadius: '10px' }}
              >
                Sync DB
              </Button>
            </Stack>
          </Box>
        </Paper>

        {alertMsg && (
          <Alert severity="success" sx={{ mb: 4, borderRadius: '12px' }} onClose={() => setAlertMsg('')}>
            {alertMsg}
          </Alert>
        )}

        {/* Role Scope Info Notification */}
        {!isAdmin && (
          <Alert severity="info" icon={<KeyIcon />} sx={{ mb: 3, borderRadius: '12px', fontWeight: 700 }}>
            Logged in as <strong>{currentUser.name} ({currentUser.role})</strong>. Projects are scoped specifically to <strong>{currentUser.dept}</strong>.
          </Alert>
        )}

        {/* Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '16px', background: '#ffffff', border: '1px dashed #cbd5e1' }}>
            <SchoolIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
              No Active Projects Found for Category: {activeCategory}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
              Click below to instantiate a new project baseline directly inside the UPME Engine (`CSMT-SCHOOLS-DISTRICT`).
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setCreateModalOpen(true)}
              sx={{ background: '#4f46e5', color: '#fff', borderRadius: '10px', px: 3, py: 1.2, fontWeight: 800, textTransform: 'none' }}
            >
              Create First Project Baseline
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredProjects.map((proj) => (
              <Grid item xs={12} lg={6} key={proj.id}>
                <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none', '&:hover': { borderColor: '#4f46e5' } }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {renderIcon(proj.iconType)}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
                            {proj.schoolName}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                            {proj.projectName}
                          </Typography>
                        </Box>
                      </Box>

                      <Chip
                        label={`ENGINE HEALTH: ${proj.healthScore}/100`}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.68rem',
                          background: proj.healthStatus === 'ON_TRACK' ? '#ecfdf5' : '#fef3c7',
                          color: proj.healthStatus === 'ON_TRACK' ? '#047857' : '#b45309'
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, p: 2, background: '#f8fafc', borderRadius: '10px' }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block' }}>
                          BUDGET ALLOCATED (NAIRA)
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#059669' }}>
                          {proj.budget}
                        </Typography>
                      </Box>

                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block' }}>
                          COMPLETION PROGRESS
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#4f46e5' }}>
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

                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, display: 'block', mb: 1 }}>
                      PROJECT MILESTONES & STAGE AUDIT DOCUMENTS
                    </Typography>

                    {proj.milestones.map((m: any) => (
                      <Box key={m.id || m.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px dashed #f1f5f9' }}>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700, fontSize: '0.82rem' }}>
                            {m.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
                            Progress: <strong>{m.progress}%</strong>
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={1} alignItems="center">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<DescriptionIcon sx={{ fontSize: 13 }} />}
                            onClick={() => handleOpenDocModal(proj, m)}
                            sx={{ fontSize: '0.7rem', textTransform: 'none', fontWeight: 700, color: '#059669', borderColor: '#a7f3d0' }}
                          >
                            View Stage Docs
                          </Button>

                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<EditIcon sx={{ fontSize: 13 }} />}
                            onClick={() => handleOpenTaskModal(proj, m)}
                            sx={{ fontSize: '0.7rem', textTransform: 'none', fontWeight: 700, background: '#4f46e5', color: '#fff' }}
                          >
                            Update
                          </Button>
                        </Stack>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Interactive Update Modal */}
        {modalOpen && selectedTask && selectedProject && (
          <UpdateCsmtTaskModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            taskId={selectedTask.id}
            taskName={selectedTask.name}
            currentProgress={selectedTask.progress}
            supervisorName={selectedProject.supervisor}
            onSaveSuccess={handleTaskSaved}
          />
        )}

        {/* Stage Documents Viewer Modal */}
        {docModalOpen && selectedStage && selectedProject && (
          <StageDocumentViewerModal
            open={docModalOpen}
            onClose={() => setDocModalOpen(false)}
            stageId={selectedStage.id || selectedStage.name || 'stage-1'}
            stageName={selectedStage.name || 'Milestone Stage'}
            projectName={selectedProject.projectName || selectedProject.name || 'CSMT School Project'}
            supervisorName={selectedProject.supervisor || 'Dr. Robert Vance'}
            progress={selectedStage.progress || 0}
          />
        )}

        {/* Create Project Modal */}
        <CreateCsmtProjectModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onProjectCreated={(newProj) => {
            setCsmtProjects((prev) => [newProj, ...prev]);
            setAlertMsg(`🎉 Real School Project "${newProj.projectName}" created in live database!`);
          }}
        />

        {/* Admin Organization Users Inspector Modal */}
        <CsmtOrgUsersModal
          open={usersModalOpen}
          onClose={() => setUsersModalOpen(false)}
        />

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
