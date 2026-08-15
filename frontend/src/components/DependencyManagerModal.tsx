import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Chip,
  Grid
} from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LinkIcon from '@mui/icons-material/Link';

interface DependencyManagerModalProps {
  open: boolean;
  onClose: () => void;
  activities: any[];
  onAddDependency: (predecessorId: number, successorId: number, type: string, lag: number) => void;
}

export const DependencyManagerModal: React.FC<DependencyManagerModalProps> = ({
  open,
  onClose,
  activities,
  onAddDependency
}) => {
  const [predecessorId, setPredecessorId] = useState<number | ''>(activities[1]?.id || '');
  const [successorId, setSuccessorId] = useState<number | ''>(activities[2]?.id || '');
  const [dependencyType, setDependencyType] = useState('FS');
  const [lagDays, setLagDays] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!predecessorId || !successorId) return;

    if (predecessorId === successorId) {
      setErrorMsg('Self-referencing dependency loop detected! An activity cannot depend on itself.');
      return;
    }

    setErrorMsg('');
    onAddDependency(Number(predecessorId), Number(successorId), dependencyType, lagDays);
    setSuccessMsg('DAG Predecessor Link created successfully! Downstream delay propagation active.');

    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: '#ffffff',
          color: '#0f172a',
          minWidth: { xs: '90%', sm: 560 },
          borderRadius: '16px',
          p: 2
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 38, height: 38, borderRadius: '10px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AccountTreeIcon sx={{ color: '#4f46e5' }} />
        </Box>
        Directed Acyclic Graph (DAG) Dependency Manager
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
          Link tasks into a DAG precedence graph. When a predecessor activity experiences a delay, UPME automatically recalculates downstream start dates and flags successor tasks.
        </Typography>

        {errorMsg && <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>{errorMsg}</Alert>}
        {successMsg && <Alert severity="success" sx={{ mb: 3, borderRadius: '10px' }}>{successMsg}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Predecessor Activity */}
          <FormControl fullWidth>
            <InputLabel id="pred-label">Predecessor Task (Must Happen First)</InputLabel>
            <Select
              labelId="pred-label"
              value={predecessorId}
              label="Predecessor Task (Must Happen First)"
              onChange={(e) => setPredecessorId(e.target.value as number)}
            >
              {activities.map((act) => (
                <MenuItem key={act.id} value={act.id}>
                  {act.name} ({act.status})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Successor Activity */}
          <FormControl fullWidth>
            <InputLabel id="succ-label">Successor Task (Blocked Until Predecessor)</InputLabel>
            <Select
              labelId="succ-label"
              value={successorId}
              label="Successor Task (Blocked Until Predecessor)"
              onChange={(e) => setSuccessorId(e.target.value as number)}
            >
              {activities.map((act) => (
                <MenuItem key={act.id} value={act.id}>
                  {act.name} ({act.status})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <FormControl fullWidth>
                <InputLabel id="dep-type-label">Dependency Constraint Type</InputLabel>
                <Select
                  labelId="dep-type-label"
                  value={dependencyType}
                  label="Dependency Constraint Type"
                  onChange={(e) => setDependencyType(e.target.value as string)}
                >
                  <MenuItem value="FS">Finish-to-Start (FS - Predecessor must finish)</MenuItem>
                  <MenuItem value="SS">Start-to-Start (SS - Simultaneous start)</MenuItem>
                  <MenuItem value="FF">Finish-to-Finish (FF - Simultaneous finish)</MenuItem>
                  <MenuItem value="SF">Start-to-Finish (SF - Overlap constraint)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Lag Days"
                type="number"
                value={lagDays}
                onChange={(e) => setLagDays(Number(e.target.value))}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            startIcon={<LinkIcon />}
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
            Create Precedence Link
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
