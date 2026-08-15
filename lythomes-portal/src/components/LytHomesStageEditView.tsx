import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Slider,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EngineeringIcon from '@mui/icons-material/Engineering';
import VerifiedIcon from '@mui/icons-material/Verified';
import SpeedIcon from '@mui/icons-material/Speed';

interface LytHomesStageEditViewProps {
  project: any;
  stage: any;
  onBack: () => void;
  onSaveProgress: (updatedStageId: number, newProgress: number, notes: string, docFile?: File | null) => void;
}

export const LytHomesStageEditView: React.FC<LytHomesStageEditViewProps> = ({
  project,
  stage,
  onBack,
  onSaveProgress
}) => {
  const [progress, setProgress] = useState<number>(stage?.progress || 0);
  const [auditNotes, setAuditNotes] = useState<string>('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const percentagePresets = [0, 25, 50, 75, 100];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      // Simulate live API request latency
      await new Promise((resolve) => setTimeout(resolve, 600));

      onSaveProgress(stage.id, progress, auditNotes, attachedFile);
      setSaving(false);
      setSuccessMsg(`🎉 Milestone progress updated to ${progress}%! Synchronized with UPME Engine database.`);
    } catch (err) {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: 900, mx: 'auto', boxSizing: 'border-box', overflowX: 'hidden' }}>
      {/* Top Navigation */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{ mb: 3, textTransform: 'none', fontWeight: 800, color: '#334155', borderColor: '#cbd5e1', borderRadius: '10px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
      >
        Back to Project Details
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
            icon={<EngineeringIcon sx={{ color: '#fff !important', fontSize: 14 }} />}
            label="STAGE PROGRESS EDITOR"
            size="small"
            sx={{ background: '#f59e0b', color: '#fff', fontWeight: 800, fontSize: '0.68rem', height: 24 }}
          />
          <Chip
            icon={<VerifiedIcon sx={{ color: '#fff !important', fontSize: 13 }} />}
            label={`PROJECT: ${project?.projectName || 'LytHomes Construction'}`}
            size="small"
            sx={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff', fontWeight: 800, fontSize: '0.68rem', height: 24 }}
          />
        </Box>

        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -0.5, mb: 1, fontSize: { xs: '1.35rem', sm: '2.1rem' } }}>
          {stage?.name || 'Construction Stage Progress'}
        </Typography>

        <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: { xs: '0.8rem', sm: '0.88rem' } }}>
          Update physical construction progress and attach COREN / Site Quality Inspection Certificates.
        </Typography>
      </Paper>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
          {successMsg}
        </Alert>
      )}

      {/* Editor Form Card */}
      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5, md: 4 }, borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Completion Slider & Presets */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
                <SpeedIcon sx={{ color: '#f59e0b' }} />
                Completion Progress Percentage
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#f59e0b' }}>
                {progress}%
              </Typography>
            </Box>

            <Slider
              value={progress}
              onChange={(_, val) => setProgress(val as number)}
              step={5}
              min={0}
              max={100}
              valueLabelDisplay="auto"
              sx={{
                color: '#f59e0b',
                height: 10,
                mb: 2,
                '& .MuiSlider-thumb': { width: 22, height: 22, border: '3px solid #ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }
              }}
            />

            {/* Responsive Wrapping Preset Chips */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {percentagePresets.map((pct) => (
                <Chip
                  key={pct}
                  label={`${pct}%`}
                  onClick={() => setProgress(pct)}
                  sx={{
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    px: 1.5,
                    height: 32,
                    cursor: 'pointer',
                    background: progress === pct ? '#f59e0b' : '#f1f5f9',
                    color: progress === pct ? '#ffffff' : '#334155',
                    border: '1px solid',
                    borderColor: progress === pct ? '#d97706' : '#cbd5e1',
                    '&:hover': { background: '#f59e0b', color: '#ffffff' }
                  }}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Audit Notes */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
              Site Engineer Field Inspection Audit Notes
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="e.g. Concrete cube compression test passed 32 N/mm² at 28 days curing. Formwork stripped cleanly."
              value={auditNotes}
              onChange={(e) => setAuditNotes(e.target.value)}
            />
          </Box>

          {/* File Attachment */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
              Attach Structural Quality / Safety Audit Proof PDF
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{ textTransform: 'none', fontWeight: 800, borderColor: '#cbd5e1', color: '#334155', borderRadius: '10px', height: 40, whiteSpace: 'nowrap' }}
              >
                Choose Audit Document...
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setAttachedFile(e.target.files[0]);
                    }
                  }}
                />
              </Button>

              {attachedFile && (
                <Chip
                  label={`File: ${attachedFile.name}`}
                  onDelete={() => setAttachedFile(null)}
                  color="warning"
                  sx={{ fontWeight: 800, height: 32 }}
                />
              )}
            </Box>
          </Box>

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
                px: 3
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
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
              {saving ? 'Saving Engine Progress...' : 'Save Stage Progress'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
