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
  Alert
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

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

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
          description: `CSMT Schools ${category} Project`
        })
      });

      const data = await res.json();
      setSubmitting(false);

      if (data.status === 'success' && data.data) {
        const p = data.data;

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
          milestones: allTasks
        };

        onProjectCreated(newProj);
        onClose();
      } else {
        setErrorMsg(data.message || 'Failed to create project in database engine.');
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
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: '16px', p: 2, minWidth: { xs: '90%', sm: 540 } } }}>
      <DialogTitle sx={{ fontWeight: 800, color: '#0f172a' }}>
        ➕ Add Real CSMT School Project
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
          Instantiate a real project baseline in the UPME Engine backend database (`CSMT-SCHOOLS-DISTRICT`).
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
            {submitting ? 'Saving to UPME Database...' : 'Create & Save to Database'}
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
