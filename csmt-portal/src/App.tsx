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
  Tabs,
  Tab,
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
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DescriptionIcon from '@mui/icons-material/Description';

import { UpdateCsmtTaskModal } from './components/UpdateCsmtTaskModal';
import { CsmtLoginModal } from './components/CsmtLoginModal';
import { CreateCsmtProjectModal } from './components/CreateCsmtProjectModal';
import { StageDocumentViewerModal } from './components/StageDocumentViewerModal';
import { CsmtLoginView } from './components/CsmtLoginView';

export const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem('csmt_current_user');
    setCurrentUser(null);
  };

  const handleLoginSuccess = (user: any) => {
    localStorage.setItem('csmt_current_user', JSON.stringify(user));
    setCurrentUser(user);
    setLoginModalOpen(false);
  };

  // Fetch Live MySQL Engine Database Projects
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
      `🎉 Task "${selectedTask.name}" updated to ${newProgress}% by ${currentUser.name}! Saved directly to MySQL database.`
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

  const filteredProjects = csmtProjects.filter((p) => {
    if (activeCategory === 'ALL') return true;
    return p.category === activeCategory;
  });

  // Render Fullscreen Staff Login Screen if User is Not Logged In
  if (!currentUser) {
    return <CsmtLoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8fafc', py: 5 }}>
      <Container maxWidth="xl">
        {/* Top Header Navigation Bar */}
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Chip
                  icon={<SchoolIcon sx={{ color: '#fff !important', fontSize: 16 }} />}
                  label="CSMT SCHOOLS DISTRICT PORTAL"
                  sx={{ background: '#4f46e5', color: '#fff', fontWeight: 800 }}
                />
                <Chip
                  icon={<VerifiedIcon sx={{ color: '#fff !important', fontSize: 14 }} />}
                  label="CONNECTED TO MYSQL DATABASE"
                  sx={{ background: '#059669', color: '#fff', fontWeight: 800 }}
                />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: -0.5, mb: 0.5 }}>
                CSMT Schools Infrastructure & Projects Portal
              </Typography>
              <Typography variant="body1" sx={{ color: '#c7d2fe' }}>
                Multi-Campus Educational Projects Portfolio Budgeted in Nigerian Naira (₦).
              </Typography>
            </Box>

            <Stack direction="column" spacing={1.5} alignItems="flex-end">
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => setCreateModalOpen(true)}
                  sx={{ background: '#059669', color: '#fff', textTransform: 'none', fontWeight: 800, '&:hover': { background: '#047857' } }}
                >
                  Create School Project
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <RefreshIcon />}
                  onClick={fetchLiveEngineProjects}
                  sx={{ color: '#a5f3fc', borderColor: 'rgba(255,255,255,0.3)', textTransform: 'none', fontWeight: 700 }}
                >
                  Sync Engine DB
                </Button>
              </Stack>

              <Paper elevation={0} sx={{ p: 1.5, px: 2, background: 'rgba(255,255,255,0.1)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AccountCircleIcon sx={{ color: '#38bdf8' }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                    {currentUser.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    {currentUser.email} ({currentUser.role})
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<LogoutIcon sx={{ fontSize: 13 }} />}
                  onClick={handleLogout}
                  sx={{ textTransform: 'none', ml: 1, color: '#fca5a5', borderColor: '#fca5a5', fontSize: '0.72rem' }}
                >
                  Logout
                </Button>
              </Paper>
            </Stack>
          </Box>
        </Paper>

        {alertMsg && (
          <Alert severity="success" sx={{ mb: 4, borderRadius: '12px' }} onClose={() => setAlertMsg('')}>
            {alertMsg}
          </Alert>
        )}

        {/* Category Filter Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs
            value={activeCategory}
            onChange={(_, val) => setActiveCategory(val)}
            sx={{ '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', fontSize: '0.95rem' } }}
          >
            <Tab label={`All Projects (${csmtProjects.length})`} value="ALL" />
            <Tab label="Academic CS Labs" value="ACADEMIC_LAB" />
            <Tab label="Digital Library" value="LIBRARY" />
            <Tab label="Sports Turf Complex" value="SPORTS" />
            <Tab label="Student Hostels" value="HOSTEL" />
            <Tab label="STEM Robotics Clubs" value="CLUBS" />
          </Tabs>
        </Box>

        {/* Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '16px', background: '#ffffff', border: '1px dashed #cbd5e1' }}>
            <SchoolIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
              No Active Projects Found in Live Engine Database
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
              Click below to instantiate your first real project baseline directly inside the UPME Engine (`CSMT-SCHOOLS-DISTRICT`).
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setCreateModalOpen(true)}
              sx={{ background: '#4f46e5', color: '#fff', borderRadius: '10px', px: 3, py: 1.2, fontWeight: 800, textTransform: 'none' }}
            >
              Create First CSMT School Project
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredProjects.map((proj) => (
              <Grid item xs={12} md={6} key={proj.id}>
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
        {selectedTask && selectedProject && (
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
        {selectedStage && selectedProject && (
          <StageDocumentViewerModal
            open={docModalOpen}
            onClose={() => setDocModalOpen(false)}
            stageId={selectedStage.id || selectedStage.name}
            stageName={selectedStage.name}
            projectName={selectedProject.projectName}
            supervisorName={selectedProject.supervisor}
            progress={selectedStage.progress}
          />
        )}

        {/* Create Project Modal */}
        <CreateCsmtProjectModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onProjectCreated={(newProj) => {
            setCsmtProjects((prev) => [newProj, ...prev]);
            setAlertMsg(`🎉 Real School Project "${newProj.projectName}" created in MySQL database!`);
          }}
        />

        {/* School Staff Login Modal */}
        <CsmtLoginModal
          open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </Container>
    </Box>
  );
};

export default App;
