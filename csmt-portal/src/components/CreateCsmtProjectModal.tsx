import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  IconButton,
  Stack,
  Chip
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface CreateCsmtProjectModalProps {
  open: boolean;
  onClose: () => void;
  onProjectCreated: (newProject: any) => void;
}

export const CreateCsmtProjectModal: React.FC<CreateCsmtProjectModalProps> = ({
  open,
  onClose,
  onProjectCreated
}) => {
  const [schoolName, setSchoolName] = useState('CSMT Main Science Campus');
  const [projectName, setProjectName] = useState('');
  const [category, setCategory] = useState('ACADEMIC_LAB');
  const [location, setLocation] = useState('Block A - Room 304');
  const [budget, setBudget] = useState('₦35,000,000');
  const [supervisor, setSupervisor] = useState('Dr. Robert Vance (HOD Computer Science)');

  // Milestone Mode State: 'DEFAULT_TEMPLATE' vs 'CUSTOM_MILESTONES'
  const [milestoneMode, setMilestoneMode] = useState<'DEFAULT_TEMPLATE' | 'CUSTOM_MILESTONES'>('DEFAULT_TEMPLATE');
  const [customMilestones, setCustomMilestones] = useState<string[]>([
    'Phase 1: Requirements & Budget Approval',
    'Phase 2: Equipment Procurement & Site Prep',
    'Phase 3: Hardware Setup & System Testing',
    'Phase 4: District Final Quality Audit'
  ]);
  const [newMilestoneInput, setNewMilestoneInput] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddCustomMilestone = () => {
    if (!newMilestoneInput.trim()) return;
    setCustomMilestones([...customMilestones, newMilestoneInput.trim()]);
    setNewMilestoneInput('');
  };

  const handleRemoveCustomMilestone = (index: number) => {
    setCustomMilestones(customMilestones.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const templateCode = matchCategoryToTemplate(category);

      const res = await fetch('http://127.0.0.1:8000/api/v1/projects/from-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Organization-Code': 'CSMT-SCHOOLS-DISTRICT',
          'X-Api-Key': 'upme_live_sec_csmt_schools_8f9a0b1c',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          template_code: templateCode,
          name: `${schoolName} - ${projectName}`,
          description: `CSMT Schools ${category} Project`,
          custom_milestones: milestoneMode === 'CUSTOM_MILESTONES' ? customMilestones : null
        })
      });

      const data = await res.json();
      setSubmitting(false);

      if (data.status === 'success' && data.data) {
        const p = data.data;

        let milestonesToUse = [];
        if (milestoneMode === 'CUSTOM_MILESTONES' && customMilestones.length > 0) {
          milestonesToUse = customMilestones.map((mName, idx) => ({
            id: idx + 100,
            name: mName,
            progress: 0,
            status: 'NOT_STARTED'
          }));
        } else {
          const fetchedMs = p.milestones || [];
          milestonesToUse = fetchedMs.flatMap((m: any) =>
            (m.activities || []).length > 0
              ? m.activities.map((a: any) => ({ id: a.id, name: a.name, progress: a.progress }))
              : [{ id: m.id, name: m.name, progress: m.progress }]
          );
        }

        if (milestonesToUse.length === 0) {
          milestonesToUse = [
            { id: 1, name: 'Phase 1: Planning & Specs', progress: 0 },
            { id: 2, name: 'Phase 2: Procurement', progress: 0 },
            { id: 3, name: 'Phase 3: Installation', progress: 0 }
          ];
        }

        const newProj = {
          id: p.id,
          uuid: p.uuid,
          schoolName,
          projectName: p.name,
          category,
          location,
          budget,
          progress: 0,
          healthScore: 100.0,
          healthStatus: 'ON_TRACK',
          supervisor,
          iconType: category === 'LIBRARY' ? 'book' : category === 'SPORTS' ? 'sports' : category === 'HOSTEL' ? 'hotel' : category === 'CLUBS' ? 'robotics' : 'computer',
          milestones: milestonesToUse
        };

        onProjectCreated(newProj);
        onClose();
      } else {
        setErrorMsg(data.message || 'Failed to create project in engine database.');
      }
    } catch (err) {
      setSubmitting(false);
      setErrorMsg('Failed to connect to UPME Engine database backend.');
    }
  };

  const matchCategoryToTemplate = (cat: string) => {
    switch (cat) {
      case 'LIBRARY': return 'TPL-LIB-2026';
      case 'SPORTS': return 'TPL-SPORTS-2026';
      case 'HOSTEL': return 'TPL-HOSTEL-2026';
      case 'CLUBS': return 'TPL-CLUBS-2026';
      default: return 'TPL-CS-LAB-2026';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: '16px', p: 2, minWidth: { xs: '90%', sm: 600 } } }}>
      <DialogTitle sx={{ fontWeight: 800, color: '#0f172a' }}>
        ➕ Add New CSMT School Project Baseline
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
          Instantiate a new project in the UPME Engine (`CSMT-SCHOOLS-DISTRICT`).
        </Typography>

        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            fullWidth
            label="School / Campus Name"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Project Title (e.g. Physics & Robotics Lab Setup)"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />

          <TextField
            fullWidth
            select
            label="Project Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="ACADEMIC_LAB">Academic CS / Science Lab</MenuItem>
            <MenuItem value="LIBRARY">Digital Library & E-Reader Hub</MenuItem>
            <MenuItem value="SPORTS">Sports Turf Stadium</MenuItem>
            <MenuItem value="HOSTEL">Student Hostels & Dormitories</MenuItem>
            <MenuItem value="CLUBS">STEM Robotics Club Workshop</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Campus Location (Room / Block)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Allocated Budget in Naira (₦)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Lead Supervisor Name & Role"
            value={supervisor}
            onChange={(e) => setSupervisor(e.target.value)}
            required
          />

          {/* Milestone Creation Choice Radio Toggle */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountTreeIcon sx={{ color: '#4f46e5' }} />
              Milestone Structure Strategy
            </Typography>

            <RadioGroup
              value={milestoneMode}
              onChange={(e) => setMilestoneMode(e.target.value as any)}
            >
              <FormControlLabel
                value="DEFAULT_TEMPLATE"
                control={<Radio size="small" />}
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      ⚡ Use Recommended Standard School Template
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Auto-populates standard milestone stages (Planning, Procurement, Installation, Audit).
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="CUSTOM_MILESTONES"
                control={<Radio size="small" />}
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      ✏️ Create Custom Milestones (Custom Build)
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Specify custom milestone stages specifically tailored for this project.
                    </Typography>
                  </Box>
                }
              />
            </RadioGroup>

            {/* Custom Milestone Builder List */}
            {milestoneMode === 'CUSTOM_MILESTONES' && (
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #cbd5e1' }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', display: 'block', mb: 1 }}>
                  CUSTOM MILESTONE STAGES ({customMilestones.length}):
                </Typography>

                <Stack spacing={1} sx={{ mb: 2 }}>
                  {customMilestones.map((m, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 1.2,
                        px: 2,
                        borderRadius: '8px',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        display: 'flex',
                        justify: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>
                        {idx + 1}. {m}
                      </Typography>
                      <IconButton size="small" color="error" onClick={() => handleRemoveCustomMilestone(idx)}>
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter custom milestone stage name..."
                    value={newMilestoneInput}
                    onChange={(e) => setNewMilestoneInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomMilestone();
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleAddCustomMilestone}
                    sx={{ background: '#059669', color: '#fff', textTransform: 'none', fontWeight: 700 }}
                  >
                    Add Stage
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>

          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <AddCircleOutlineIcon />}
            sx={{
              background: '#4f46e5',
              color: '#ffffff',
              borderRadius: '12px',
              py: 1.5,
              fontWeight: 800,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
              '&:hover': { background: '#4338ca' }
            }}
          >
            {submitting ? 'Saving Project to Database Engine...' : 'Create & Save Project'}
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: '#64748b' }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
