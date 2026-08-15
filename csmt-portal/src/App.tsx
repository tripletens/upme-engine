import React, { useState } from 'react';
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
  Alert
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ComputerIcon from '@mui/icons-material/Computer';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import HotelIcon from '@mui/icons-material/Hotel';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import VerifiedIcon from '@mui/icons-material/Verified';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyIcon from '@mui/icons-material/Key';
import EditIcon from '@mui/icons-material/Edit';

import { UpdateCsmtTaskModal } from './components/UpdateCsmtTaskModal';

export const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [alertMsg, setAlertMsg] = useState('');

  const [csmtProjects, setCsmtProjects] = useState<any[]>([
    {
      id: 101,
      schoolName: 'CSMT Science & Technology Campus',
      projectName: 'Computer Science & AI Lab Modernization',
      category: 'ACADEMIC_LAB',
      location: 'Block A - Room 304',
      budget: '₦35,000,000',
      uuid: 'proj-cs-lab-001',
      progress: 100,
      healthScore: 100.0,
      healthStatus: 'ON_TRACK',
      supervisor: 'Dr. Robert Vance (HOD Computer Science)',
      icon: <ComputerIcon sx={{ color: '#4f46e5' }} />,
      milestones: [
        { id: 1, name: '1. Lab Budget & Specifications Approval', progress: 100 },
        { id: 2, name: '2. Workstation PCs & Server Procurement', progress: 100 },
        { id: 3, name: '3. Electrical Wiring & Network Outlets', progress: 100 },
        { id: 4, name: '4. Equipment Mounting & Software Deployment', progress: 100 }
      ]
    },
    {
      id: 102,
      schoolName: 'CSMT Central Campus',
      projectName: 'Digital Library & E-Reader Hub Renovation',
      category: 'LIBRARY',
      location: 'Central Library - Floor 2',
      budget: '₦20,000,000',
      uuid: 'proj-library-002',
      progress: 85,
      healthScore: 92.5,
      healthStatus: 'ON_TRACK',
      supervisor: 'Mrs. Clara Hughes (Head Librarian)',
      icon: <MenuBookIcon sx={{ color: '#0284c7' }} />,
      milestones: [
        { id: 5, name: '1. Cataloging Software & E-Book Server Setup', progress: 100 },
        { id: 6, name: '2. Tablet e-Reader Kiosks Installation', progress: 90 },
        { id: 7, name: '3. Library High-Speed WiFi AP Array', progress: 65 }
      ]
    },
    {
      id: 103,
      schoolName: 'CSMT Athletics & Sports Academy',
      projectName: 'CSMT Stadium Artificial Turf & Floodlights Renovation',
      category: 'SPORTS',
      location: 'Outdoor Sports Complex',
      budget: '₦55,000,000',
      uuid: 'proj-sports-003',
      progress: 60,
      healthScore: 78.0,
      healthStatus: 'WARNING',
      supervisor: 'Coach Marcus Miller (Sports Director)',
      icon: <SportsSoccerIcon sx={{ color: '#d97706' }} />,
      milestones: [
        { id: 8, name: '1. Ground Excavation & Sub-base Drainage', progress: 100 },
        { id: 9, name: '2. FIFA-Standard Synthetic Turf Laying', progress: 50 },
        { id: 10, name: '3. LED Floodlight Towers Electrical Grid', progress: 30 }
      ]
    },
    {
      id: 104,
      schoolName: 'CSMT Residential Campus',
      projectName: 'Hostel Hall A & B Smart Access & Solar Hot Water',
      category: 'HOSTEL',
      location: 'Hostels Block A & B',
      budget: '₦40,000,000',
      uuid: 'proj-hostel-004',
      progress: 95,
      healthScore: 96.0,
      healthStatus: 'ON_TRACK',
      supervisor: 'Engr. David Opara (Facilities Manager)',
      icon: <HotelIcon sx={{ color: '#059669' }} />,
      milestones: [
        { id: 11, name: '1. RFID Smart Card Keypad Installation', progress: 100 },
        { id: 12, name: '2. Roof Solar Thermal Water Heater Array', progress: 100 },
        { id: 13, name: '3. Hostel Mesh WiFi Network Expansion', progress: 85 }
      ]
    },
    {
      id: 105,
      schoolName: 'CSMT Innovation Hub',
      projectName: 'Robotics & STEM Student Club Workshop',
      category: 'CLUBS',
      location: 'Innovation Hub - Room 102',
      budget: '₦15,000,000',
      uuid: 'proj-robotics-005',
      progress: 70,
      healthScore: 88.0,
      healthStatus: 'ON_TRACK',
      supervisor: 'Prof. Alex Chen (Robotics Club Patron)',
      icon: <PrecisionManufacturingIcon sx={{ color: '#7c3aed' }} />,
      milestones: [
        { id: 14, name: '1. 3D Printers & Soldering Benches Procurement', progress: 100 },
        { id: 15, name: '2. Student Microcontroller & Sensor Kits', progress: 75 },
        { id: 16, name: '3. Competition Testing Arena Construction', progress: 35 }
      ]
    }
  ]);

  const handleOpenTaskModal = (proj: any, task: any) => {
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
      `🎉 Task "${selectedTask.name}" updated to ${newProgress}%! Proof asset "${fileName}" attached & synced with UPME Engine.`
    );
  };

  const filteredProjects = csmtProjects.filter((p) => {
    if (activeCategory === 'ALL') return true;
    return p.category === activeCategory;
  });

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8fafc', py: 5 }}>
      <Container maxWidth="xl">
        {/* Header Banner */}
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
                  label="POWERED BY UPME ENGINE"
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

            <Stack direction="column" spacing={1} alignItems="flex-end">
              <Chip
                icon={<KeyIcon sx={{ fontSize: 14, color: '#a5f3fc !important' }} />}
                label="TENANT: CSMT-SCHOOLS-DISTRICT"
                sx={{ background: 'rgba(255,255,255,0.1)', color: '#a5f3fc', fontWeight: 700, border: '1px solid rgba(255,255,255,0.2)' }}
              />
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Engine Server: <code>http://127.0.0.1:8000/api/v1</code>
              </Typography>
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
                        {proj.icon}
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
            taskName={selectedTask.name}
            currentProgress={selectedTask.progress}
            supervisorName={selectedProject.supervisor}
            onSaveSuccess={handleTaskSaved}
          />
        )}
      </Container>
    </Box>
  );
};

export default App;
