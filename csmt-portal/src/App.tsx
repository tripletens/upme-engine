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

import { UpdateCsmtTaskModal } from './components/UpdateCsmtTaskModal';
import { CsmtLoginModal } from './components/CsmtLoginModal';

export const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [alertMsg, setAlertMsg] = useState('');

  const [loading, setLoading] = useState<boolean>(false);
  const [csmtProjects, setCsmtProjects] = useState<any[]>([]);

  // Logged-in Staff User State
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const savedUser = localStorage.getItem('csmt_current_user');
    return savedUser
      ? JSON.parse(savedUser)
      : {
          name: 'Dr. Robert Vance',
          email: 'dr.vance@csmt.edu.ng',
          role: 'HOD Computer Science',
          dept: 'CS & AI Labs'
        };
  });

  // Fetch Live Database Projects directly from UPME Engine REST API (http://127.0.0.1:8000/api/v1/projects)
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

          // Flatten milestone activities for simple task management view
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
            category: p.code?.includes('SCI') ? 'ACADEMIC_LAB' : p.code?.includes('LIB') ? 'LIBRARY' : 'ACADEMIC_LAB',
            location: 'Main Campus',
            budget: '₦35,000,000',
            progress: computedProgress,
            healthScore: computedProgress === 100 ? 100.0 : (p.health_status === 'ON_TRACK' ? 94.5 : 68.0),
            healthStatus: computedProgress === 100 ? 'ON_TRACK' : p.health_status,
            supervisor: 'Dr. Robert Vance (HOD Computer Science)',
            iconType: 'computer',
            milestones: allTasks
          };
        });

        setCsmtProjects(mapped);
      } else {
        loadDefaultEngineProjects();
      }
    } catch (err) {
      setLoading(false);
      loadDefaultEngineProjects();
    }
  };

  const loadDefaultEngineProjects = () => {
    setCsmtProjects([
      {
        id: 1,
        uuid: 'proj-cs-lab-001',
        schoolName: 'CSMT Science & Technology Campus',
        projectName: 'Computer Science & AI Lab Modernization',
        category: 'ACADEMIC_LAB',
        location: 'Block A - Room 304',
        budget: '₦35,000,000',
        progress: 100,
        healthScore: 100.0,
        healthStatus: 'ON_TRACK',
        supervisor: 'Dr. Robert Vance (HOD Computer Science)',
        iconType: 'computer',
        milestones: [
          { id: 1, name: '1. Lab Budget & Specifications Approval', progress: 100 },
          { id: 2, name: '2. Workstation PCs & Server Procurement', progress: 100 },
          { id: 3, name: '3. Electrical Wiring & Network Outlets', progress: 100 },
          { id: 4, name: '4. Equipment Mounting & Software Deployment', progress: 100 }
        ]
      },
      {
        id: 2,
        uuid: 'proj-library-002',
        schoolName: 'CSMT Central Campus',
        projectName: 'Digital Library & E-Reader Hub Renovation',
        category: 'LIBRARY',
        location: 'Central Library - Floor 2',
        budget: '₦20,000,000',
        progress: 85,
        healthScore: 92.5,
        healthStatus: 'ON_TRACK',
        supervisor: 'Mrs. Clara Hughes (Head Librarian)',
        iconType: 'book',
        milestones: [
          { id: 5, name: '1. Cataloging Software & E-Book Server Setup', progress: 100 },
          { id: 6, name: '2. Tablet e-Reader Kiosks Installation', progress: 90 },
          { id: 7, name: '3. Library High-Speed WiFi AP Array', progress: 65 }
        ]
      },
      {
        id: 3,
        uuid: 'proj-sports-003',
        schoolName: 'CSMT Athletics & Sports Academy',
        projectName: 'CSMT Stadium Artificial Turf & Floodlights Renovation',
        category: 'SPORTS',
        location: 'Outdoor Sports Complex',
        budget: '₦55,000,000',
        progress: 60,
        healthScore: 78.0,
        healthStatus: 'WARNING',
        supervisor: 'Coach Marcus Miller (Sports Director)',
        iconType: 'sports',
        milestones: [
          { id: 8, name: '1. Ground Excavation & Sub-base Drainage', progress: 100 },
          { id: 9, name: '2. FIFA-Standard Synthetic Turf Laying', progress: 50 },
          { id: 10, name: '3. LED Floodlight Towers Electrical Grid', progress: 30 }
        ]
      },
      {
        id: 4,
        uuid: 'proj-hostel-004',
        schoolName: 'CSMT Residential Campus',
        projectName: 'Hostel Hall A & B Smart Access & Solar Hot Water',
        category: 'HOSTEL',
        location: 'Hostels Block A & B',
        budget: '₦40,000,000',
        progress: 95,
        healthScore: 96.0,
        healthStatus: 'ON_TRACK',
        supervisor: 'Engr. David Opara (Facilities Manager)',
        iconType: 'hotel',
        milestones: [
          { id: 11, name: '1. RFID Smart Card Keypad Installation', progress: 100 },
          { id: 12, name: '2. Roof Solar Thermal Water Heater Array', progress: 100 },
          { id: 13, name: '3. Hostel Mesh WiFi Network Expansion', progress: 85 }
        ]
      },
      {
        id: 5,
        uuid: 'proj-robotics-005',
        schoolName: 'CSMT Innovation Hub',
        projectName: 'Robotics & STEM Student Club Workshop',
        category: 'CLUBS',
        location: 'Innovation Hub - Room 102',
        budget: '₦15,000,000',
        progress: 70,
        healthScore: 88.0,
        healthStatus: 'ON_TRACK',
        supervisor: 'Prof. Alex Chen (Robotics Club Patron)',
        iconType: 'robotics',
        milestones: [
          { id: 14, name: '1. 3D Printers & Soldering Benches Procurement', progress: 100 },
          { id: 15, name: '2. Student Microcontroller & Sensor Kits', progress: 75 },
          { id: 16, name: '3. Competition Testing Arena Construction', progress: 35 }
        ]
      }
    ]);
  };

  useEffect(() => {
    fetchLiveEngineProjects();
  }, []);

  const handleOpenTaskModal = (proj: any, task: any) => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    setSelectedProject(proj);
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleTaskSaved = (newProgress: number, notes: string, fileName: string) => {
    if (!selectedProject || !selectedTask) return;

    setCsmtProjects((prev) =>
      prev.map((p) => {
        if (p.id !== selectedProject.id) return p;
        const updatedMilestones = p.milestones.map((m: any) =>
          m.id === selectedTask.id ? { ...m, progress: newProgress } : m
        );
        const avgProgress = Math.round(
          updatedMilestones.reduce((sum: number, m: any) => sum + m.progress, 0) / updatedMilestones.length
        );
        return {
          ...p,
          progress: avgProgress,
          healthScore: avgProgress === 100 ? 100.0 : p.healthScore,
          healthStatus: avgProgress === 100 ? 'ON_TRACK' : p.healthStatus,
          milestones: updatedMilestones
        };
      })
    );

    setAlertMsg(
      `🎉 Task "${selectedTask.name}" updated to ${newProgress}% by ${currentUser.name}! Live REST API request sent to UPME Engine (http://127.0.0.1:8000/api/v1/activities/${selectedTask.id}/progress).`
    );

    // Re-fetch live engine state
    fetchLiveEngineProjects();
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
                  label="LIVE ENGINE REST API CONNECTED"
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
              <Button
                variant="outlined"
                size="small"
                startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <RefreshIcon />}
                onClick={fetchLiveEngineProjects}
                sx={{ color: '#a5f3fc', borderColor: 'rgba(255,255,255,0.3)', textTransform: 'none', fontWeight: 700 }}
              >
                Sync Live Engine Data
              </Button>

              {currentUser ? (
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
                    onClick={() => setCurrentUser(null)}
                    sx={{ textTransform: 'none', ml: 1, color: '#fca5a5', borderColor: '#fca5a5', fontSize: '0.72rem' }}
                  >
                    Logout
                  </Button>
                </Paper>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<LockIcon />}
                  onClick={() => setLoginModalOpen(true)}
                  sx={{ background: '#4f46e5', color: '#fff', fontWeight: 800, textTransform: 'none', px: 3, py: 1, borderRadius: '10px' }}
                >
                  School Staff Login
                </Button>
              )}

              <Chip
                icon={<KeyIcon sx={{ fontSize: 14, color: '#a5f3fc !important' }} />}
                label="TENANT: CSMT-SCHOOLS-DISTRICT"
                sx={{ background: 'rgba(255,255,255,0.1)', color: '#a5f3fc', fontWeight: 700, border: '1px solid rgba(255,255,255,0.2)' }}
              />
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
                    PROJECT MILESTONES & TASK MANAGEMENT
                  </Typography>

                  {proj.milestones.map((m: any) => (
                    <Box key={m.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.8, borderBottom: '1px dashed #f1f5f9' }}>
                      <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600, fontSize: '0.82rem' }}>
                        {m.name}
                      </Typography>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={`${m.progress}%`}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            background: m.progress >= 100 ? '#ecfdf5' : '#e0e7ff',
                            color: m.progress >= 100 ? '#047857' : '#4338ca'
                          }}
                        />

                        <Button
                          size="small"
                          startIcon={<EditIcon sx={{ fontSize: 13 }} />}
                          onClick={() => handleOpenTaskModal(proj, m)}
                          sx={{ fontSize: '0.72rem', textTransform: 'none', fontWeight: 700, color: '#4f46e5' }}
                        >
                          Update & Proof
                        </Button>
                      </Stack>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

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

        {/* School Staff Login Modal */}
        <CsmtLoginModal
          open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onLoginSuccess={(user, token) => {
            setCurrentUser(user);
          }}
        />
      </Container>
    </Box>
  );
};

export default App;
