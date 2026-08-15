import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Slider,
  TextField,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface UpdateCsmtTaskModalProps {
  open: boolean;
  onClose: () => void;
  taskName: string;
  currentProgress: number;
  supervisorName: string;
  onSaveSuccess: (newProgress: number, notes: string, fileName: string) => void;
}

export const UpdateCsmtTaskModal: React.FC<UpdateCsmtTaskModalProps> = ({
  open,
  onClose,
  taskName,
  currentProgress,
  supervisorName,
  onSaveSuccess
}) => {
  const [progress, setProgress] = useState(currentProgress);
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      onSaveSuccess(progress, notes, fileName || 'inspection_proof.pdf');
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: '16px', p: 2, minWidth: { xs: '90%', sm: 500 } } }}>
      <DialogTitle sx={{ fontWeight: 800, color: '#0f172a' }}>
        ✏️ Update Task Progress & Attach Inspection Proof
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
          Task: <strong>{taskName}</strong>
        </Typography>

        <Chip
          label={`Supervisor: ${supervisorName}`}
          size="small"
          sx={{ mb: 3, background: '#e0e7ff', color: '#4338ca', fontWeight: 700 }}
        />

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Progress Slider */}
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', mb: 1 }}>
              UPDATE COMPLETION PERCENTAGE:
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#4f46e5', textAlign: 'center', mb: 1 }}>
              {progress}%
            </Typography>
            <Slider
              value={progress}
              onChange={(_, val) => setProgress(val as number)}
              min={0}
              max={100}
              step={5}
              sx={{ color: '#4f46e5' }}
            />
          </Box>

          {/* Evidence File Upload Button */}
          <Box sx={{ p: 2.5, borderRadius: '12px', border: '1px dashed #cbd5e1', background: '#f8fafc', textAlign: 'center' }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{ textTransform: 'none', fontWeight: 700, borderColor: '#cbd5e1', color: '#334155', mb: 1 }}
            >
              Upload Inspection Proof (PDF, PNG, JPG)
              <input type="file" hidden onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg,.docx" />
            </Button>
            <Typography variant="caption" sx={{ display: 'block', color: fileName ? '#059669' : '#94a3b8', fontWeight: 600 }}>
              {fileName ? `✓ Selected: ${fileName}` : 'No file selected (Optional)'}
            </Typography>
          </Box>

          {/* Supervisor Notes */}
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Supervisor Inspection Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Equipment received, mounted, and verified working by site engineer."
          />

          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
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
            {submitting ? 'Syncing with UPME Engine...' : 'Save & Sync with UPME Engine'}
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
