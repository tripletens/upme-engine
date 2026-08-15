import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  TextField,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FoundationIcon from '@mui/icons-material/Foundation';
import EngineeringIcon from '@mui/icons-material/Engineering';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BuildIcon from '@mui/icons-material/Build';
import VerifiedIcon from '@mui/icons-material/Verified';

interface CreateLytHomesProjectViewProps {
  onBack: () => void;
  onProjectCreated: (newProj: any) => void;
}

export const CreateLytHomesProjectView: React.FC<CreateLytHomesProjectViewProps> = ({
  onBack,
  onProjectCreated
}) => {
  const [projectName, setProjectName] = useState('');
  const [location, setLocation] = useState('Lekki Phase 1, Lagos');
  const [category, setCategory] = useState('RESIDENTIAL_ESTATE');
  const [budgetNaira, setBudgetNaira] = useState('₦350,000,000');
  const [contractor, setContractor] = useState('Julius Berger Nig. Plc');
  const [supervisor, setSupervisor] = useState('Engr. Michael Vance (COREN Reg #28941)');
  
  // Strategy: 'STANDARD' or 'CUSTOM'
  const [milestoneStrategy, setMilestoneStrategy] = useState<'STANDARD' | 'CUSTOM'>('STANDARD');

  // Custom Milestone Stage Inputs Builder
  const [customStages, setCustomStages] = useState<string[]>([
    'Site Acquisition & Soil Mechanics Audit',
    'Foundation Excavation & Concrete Base Pouring',
    'Reinforced Superstructure Framing & Slabs',
    'Roof Trussing, MEP & Electrical Grid',
    'COREN Final Quality Certification & Handover'
  ]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddCustomStage = () => {
    setCustomStages([...customStages, `Phase ${customStages.length + 1}: Custom Construction Milestone`]);
  };

  const handleUpdateCustomStage = (index: number, val: string) => {
    const updated = [...customStages];
    updated[index] = val;
    setCustomStages(updated);
  };

  const handleRemoveCustomStage = (index: number) => {
    if (customStages.length <= 1) return;
    setCustomStages(customStages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setErrorMsg('Please enter a project title.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const generatedId = Date.now();
    const projectCode = `LYTHOMES-${category.slice(0, 4)}-${Math.floor(100 + Math.random() * 900)}`;

    const selectedMilestones = milestoneStrategy === 'STANDARD'
      ? [
          { id: 101, name: 'Phase 1: Site Geotechnical Survey & Foundation Pouring', progress: 0 },
          { id: 102, name: 'Phase 2: Superstructure Concrete Columns & Deck Slabs', progress: 0 },
          { id: 103, name: 'Phase 3: Roofing, MEP & Smart Utilities', progress: 0 },
          { id: 104, name: 'Phase 4: High-End Interior Architectural Finishing', progress: 0 },
          { id: 105, name: 'Phase 5: COREN Structural Integrity Audit & Handover', progress: 0 }
        ]
      : customStages.map((stgName, idx) => ({
          id: 200 + idx,
          name: stgName,
          progress: 0
        }));

    const createdObj = {
      id: generatedId,
      uuid: `uuid-lythomes-${generatedId}`,
      location: location,
      projectName: projectName,
      category: category,
      budget: budgetNaira,
      progress: 0,
      healthScore: 98.5,
      healthStatus: 'ON_TRACK',
      contractor: contractor,
      supervisor: supervisor,
      iconType: category === 'COMMERCIAL_TOWER' ? 'tower' : category === 'CIVIL_INFRASTRUCTURE' ? 'road' : 'villa',
      milestones: selectedMilestones
    };

    const payload = {
      name: projectName,
      code: projectCode,
      description: `LytHomes Construction Project in ${location}. Executed by ${contractor}. Supervised by ${supervisor}.`,
      category: category,
      budget_naira: budgetNaira,
      contractor: contractor,
      supervisor: supervisor,
      milestones: selectedMilestones
    };

    try {
      await fetch('http://127.0.0.1:8000/api/v1/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Organization-Code': 'LYTHOMES-CONSTRUCTION-CO',
          'X-Api-Key': 'upme_live_sec_lythomes_9c8d7e6f',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      // Offline Engine fallback silent catch
    }

    setLoading(false);
    onProjectCreated(createdObj);
    onBack();
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: 960, mx: 'auto', boxSizing: 'border-box', overflowX: 'hidden' }}>
      {/* Top Back Navigation */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{ mb: 3, textTransform: 'none', fontWeight: 800, color: '#334155', borderColor: '#cbd5e1', borderRadius: '10px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
      >
        Back to Construction Portfolio
      </Button>

      {/* Header Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5, md: 4 },
          mb: 3,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.3)',
          border: '1px solid #334155'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
          <Chip
            icon={<FoundationIcon sx={{ color: '#fff !important', fontSize: 14 }} />}
            label="INSTANTIATE CONSTRUCTION BASELINE"
            size="small"
            sx={{ background: '#f59e0b', color: '#fff', fontWeight: 800, fontSize: '0.68rem', height: 24 }}
          />
          <Chip
            icon={<VerifiedIcon sx={{ color: '#fff !important', fontSize: 13 }} />}
            label="OFFICIAL CIVIL BASELINE"
            size="small"
            sx={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff', fontWeight: 800, fontSize: '0.68rem', height: 24 }}
          />
        </Box>

        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -0.5, mb: 1, fontSize: { xs: '1.35rem', sm: '2.1rem' } }}>
          New LytHomes Project Baseline
        </Typography>

        <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: { xs: '0.8rem', sm: '0.88rem' } }}>
          Instantiate a new civil or building construction project with Naira BOQ budgets.
        </Typography>
      </Paper>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {errorMsg}
        </Alert>
      )}

      {/* Main Creation Form Card */}
      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5, md: 4 }, borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Project Title"
                placeholder="e.g. LytHomes SkyTower Commercial Complex - Phase 2"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Construction Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="RESIDENTIAL_ESTATE">Residential Estates & Villas</MenuItem>
                <MenuItem value="COMMERCIAL_TOWER">Commercial Towers & Hubs</MenuItem>
                <MenuItem value="CIVIL_INFRASTRUCTURE">Civil Roads & Microgrids</MenuItem>
                <MenuItem value="INDUSTRIAL_PARK">Logistics Parks & Warehousing</MenuItem>
                <MenuItem value="INTERIOR_RENOVATION">Interior Architecture & Fit-outs</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Site / Estate Location"
                placeholder="e.g. Victoria Island Extension, Lagos"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Allocated BOQ Budget (Nigerian Naira ₦)"
                placeholder="e.g. ₦450,000,000"
                value={budgetNaira}
                onChange={(e) => setBudgetNaira(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="General Contracting Firm"
                placeholder="e.g. Apex Civil Engineering Nig. Ltd"
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Lead Structural Supervisor & COREN #"
                placeholder="e.g. Engr. Michael Vance (COREN Reg #28941)"
                value={supervisor}
                onChange={(e) => setSupervisor(e.target.value)}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 1 }} />

          {/* Mobile-Friendly Selectable Milestone Strategy Cards */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
              Select Milestone Construction Strategy
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2, fontSize: '0.82rem' }}>
              Choose whether to generate standard civil phases or build custom construction stages.
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  onClick={() => setMilestoneStrategy('STANDARD')}
                  sx={{
                    p: 2.5,
                    borderRadius: '16px',
                    border: '2px solid',
                    borderColor: milestoneStrategy === 'STANDARD' ? '#f59e0b' : '#e2e8f0',
                    background: milestoneStrategy === 'STANDARD' ? '#fffbeb' : '#f8fafc',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    height: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Chip
                      icon={<CheckCircleIcon sx={{ color: milestoneStrategy === 'STANDARD' ? '#f59e0b !important' : '#cbd5e1', fontSize: 16 }} />}
                      label="RECOMMENDED"
                      size="small"
                      sx={{ fontWeight: 800, fontSize: '0.62rem', height: 22, background: milestoneStrategy === 'STANDARD' ? '#feefc3' : '#e2e8f0', color: milestoneStrategy === 'STANDARD' ? '#b45309' : '#64748b' }}
                    />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '0.95rem', mb: 0.5 }}>
                    ⚡ Standard Civil Phases
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>
                    Auto-generates 5 standard construction milestones: Soil Test & Foundation, Superstructure Columns, MEP & Roofing, Finishing, and COREN Final Sign-off.
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper
                  elevation={0}
                  onClick={() => setMilestoneStrategy('CUSTOM')}
                  sx={{
                    p: 2.5,
                    borderRadius: '16px',
                    border: '2px solid',
                    borderColor: milestoneStrategy === 'CUSTOM' ? '#f59e0b' : '#e2e8f0',
                    background: milestoneStrategy === 'CUSTOM' ? '#fffbeb' : '#f8fafc',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    height: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Chip
                      icon={<BuildIcon sx={{ color: milestoneStrategy === 'CUSTOM' ? '#f59e0b !important' : '#cbd5e1', fontSize: 16 }} />}
                      label="CUSTOM BUILDER"
                      size="small"
                      sx={{ fontWeight: 800, fontSize: '0.62rem', height: 22, background: milestoneStrategy === 'CUSTOM' ? '#feefc3' : '#e2e8f0', color: milestoneStrategy === 'CUSTOM' ? '#b45309' : '#64748b' }}
                    />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '0.95rem', mb: 0.5 }}>
                    🛠 Custom Stages Builder
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.78rem', display: 'block' }}>
                    Unlocks custom stage inputs. Define bespoke construction milestone titles tailored specifically to your site project.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Dynamic Custom Stages Input Rows */}
          {milestoneStrategy === 'CUSTOM' && (
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
                Custom Construction Stage Builder ({customStages.length} Stages)
              </Typography>

              <Stack spacing={1.5}>
                {customStages.map((stageTitle, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={stageTitle}
                      onChange={(e) => handleUpdateCustomStage(idx, e.target.value)}
                      placeholder={`Stage ${idx + 1} Name`}
                    />
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveCustomStage(idx)}
                      disabled={customStages.length <= 1}
                      size="small"
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Box>
                ))}

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleAddCustomStage}
                  sx={{
                    width: 'fit-content',
                    textTransform: 'none',
                    fontWeight: 800,
                    borderColor: '#cbd5e1',
                    color: '#334155',
                    borderRadius: '8px',
                    mt: 1,
                    whiteSpace: 'nowrap'
                  }}
                >
                  + Add Stage
                </Button>
              </Stack>
            </Paper>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, gap: 1.5, justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="outlined"
              onClick={onBack}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                height: 42,
                whiteSpace: 'nowrap',
                fontWeight: 800,
                color: '#64748b',
                borderColor: '#cbd5e1',
                borderRadius: '10px',
                px: 3.5
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AddCircleOutlineIcon />}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                height: 42,
                whiteSpace: 'nowrap',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#ffffff',
                borderRadius: '10px',
                px: 3.5,
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
                '&:hover': { background: '#d97706' }
              }}
            >
              {loading ? 'Instantiating Baseline...' : 'Create Project'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
