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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

interface CreateTemplateModalProps {
  open: boolean;
  onClose: () => void;
  onProjectCreated: (newProject: any) => void;
}

export const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  open,
  onClose,
  onProjectCreated
}) => {
  const [templateId, setTemplateId] = useState(1);
  const [name, setName] = useState('New Solar Microgrid Installation');
  const [code, setCode] = useState('SOLAR-GRID-2026');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    setTimeout(() => {
      setLoading(false);
      setMessage('Project baseline instantiated successfully from industry template!');
      onProjectCreated({
        id: Date.now(),
        code,
        name,
        healthStatus: 'ON_TRACK',
        overallHealthScore: 100,
        overallProgress: 0
      });
      setTimeout(() => {
        setMessage('');
        onClose();
      }, 1000);
    }, 1000);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: '#ffffff',
          color: '#0f172a',
          minWidth: { xs: '90%', sm: 540 },
          borderRadius: '16px',
          p: 2
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 38, height: 38, borderRadius: '10px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RocketLaunchIcon sx={{ color: '#4f46e5' }} />
        </Box>
        Instantiate Project Baseline from Template
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
          Select an industry domain template to instantly generate milestone activity graphs and precedence links.
        </Typography>

        {message && <Alert severity="success" sx={{ mb: 3, borderRadius: '10px' }}>{message}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <FormControl fullWidth>
            <InputLabel id="tpl-label">Industry Domain Template</InputLabel>
            <Select
              labelId="tpl-label"
              value={templateId}
              label="Industry Domain Template"
              onChange={(e) => setTemplateId(e.target.value as number)}
            >
              <MenuItem value={1}>🏫 School Computer Science Laboratory Setup (4 Milestones)</MenuItem>
              <MenuItem value={2}>🏗️ Commercial Construction Site Preparation (5 Milestones)</MenuItem>
              <MenuItem value={3}>💻 Enterprise Software Development Release (4 Milestones)</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Project Code (e.g. SCH-LAB-2026)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Planned Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AddTaskIcon />}
            sx={{
              background: '#4f46e5',
              color: '#ffffff',
              borderRadius: '12px',
              py: 1.5,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
              '&:hover': { background: '#4338ca' }
            }}
          >
            {loading ? 'Instantiating Baseline...' : 'Create Project Baseline'}
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: '#64748b', fontWeight: 600 }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
