import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  Slider,
  TextField,
  Divider,
  Stack,
  Alert,
  CircularProgress,
  MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';
import DescriptionIcon from '@mui/icons-material/Description';

interface CsmtStageEditViewProps {
  project: any;
  stage: any;
  onBack: () => void;
  onSaveProgress: (stageId: any, newProgress: number, notes: string) => void;
}

export const CsmtStageEditView: React.FC<CsmtStageEditViewProps> = ({
  project,
  stage,
  onBack,
  onSaveProgress
}) => {
  const [progress, setProgress] = useState<number>(stage?.progress || 0);
  const [notes, setNotes] = useState<string>(
    `Milestone stage "${stage?.name}" verified on site by ${project?.supervisor || 'Lead Supervisor'}. All quality standards met.`
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handlePresetSelect = (val: number) => {
    setProgress(val);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      onSaveProgress(stage?.id || stage?.name, progress, notes);
      setSaving(false);
      setSuccessMsg(`🎉 Milestone stage "${stage?.name}" progress updated to ${progress}% and synced with UPME Engine!`);
      setTimeout(() => {
        onBack();
      }, 900);
    }, 400);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: 1100, mx: 'auto', boxSizing: 'border-box' }}>
      {/* Top Back Navigation Button */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{ mb: 3, textTransform: 'none', fontWeight: 800, color: '#334155', borderColor: '#cbd5e1', borderRadius: '10px' }}
      >
        Back to {project?.projectName || 'Project Details'}
      </Button>

      {/* Main Header Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          color: '#ffffff',
          border: '1px solid #4338ca',
          boxShadow: '0 10px 25px rgba(30, 27, 75, 0.2)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<EditIcon sx={{ color: '#fff !important', fontSize: 14 }} />}
            label="FULL-PAGE STAGE PROGRESS EDITOR"
            size="small"
            sx={{ background: '#4f46e5', color: '#fff', fontWeight: 800, fontSize: '0.68rem' }}
          />
          <Chip
            icon={<VerifiedIcon sx={{ color: '#fff !important', fontSize: 13 }} />}
            label={`CURRENT: ${stage?.progress || 0}% COMPLETED`}
            size="small"
            sx={{ background: (stage?.progress || 0) >= 100 ? '#059669' : '#d97706', color: '#fff', fontWeight: 800, fontSize: '0.68rem' }}
          />
        </Box>

        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -0.5, mb: 1, fontSize: { xs: '1.4rem', sm: '2.1rem' } }}>
          {stage?.name || 'Milestone Stage'}
        </Typography>

        <Typography variant="body2" sx={{ color: '#c7d2fe' }}>
          Project: <strong>{project?.projectName}</strong> • Lead Supervisor: <strong>{project?.supervisor}</strong>
        </Typography>
      </Paper>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 4, borderRadius: '12px' }}>
          {successMsg}
        </Alert>
      )}

      {/* Interactive Stage Progress Form */}
      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          
          {/* Progress Slider & Numerical Selector */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Completion Percentage: <span style={{ color: '#4f46e5' }}>{progress}%</span>
              </Typography>
              
              <Stack direction="row" spacing={1}>
                {[0, 25, 50, 75, 100].map((val) => (
                  <Chip
                    key={val}
                    label={`${val}%`}
                    onClick={() => handlePresetSelect(val)}
                    color={progress === val ? 'primary' : 'default'}
                    variant={progress === val ? 'filled' : 'outlined'}
                    sx={{ fontWeight: 800, cursor: 'pointer', height: 26 }}
                  />
                ))}
              </Stack>
            </Box>

            <Slider
              value={progress}
              onChange={(_, val) => setProgress(val as number)}
              valueLabelDisplay="auto"
              min={0}
              max={100}
              step={5}
              sx={{
                height: 12,
                '& .MuiSlider-track': { background: progress >= 100 ? '#059669' : '#4f46e5' },
                '& .MuiSlider-thumb': { width: 24, height: 24, background: '#ffffff', border: '3px solid #4f46e5' }
              }}
            />
          </Box>

          <Divider />

          {/* Supervisor Field Execution Notes */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <DescriptionIcon sx={{ color: '#4f46e5' }} />
              Supervisor Field Audit Notes
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter site verification observations, quality audit sign-offs, or delays..."
              sx={{ background: '#f8fafc' }}
            />
          </Box>

          {/* Verification Evidence Attachment */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CloudUploadIcon sx={{ color: '#059669' }} />
              Attach Stage Proof Document (Optional PDF / Image)
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{ textTransform: 'none', fontWeight: 700, borderColor: '#cbd5e1', color: '#334155' }}
              >
                Select Audit Proof File...
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />
              </Button>

              {selectedFile && (
                <Chip
                  label={`Attached: ${selectedFile.name}`}
                  onDelete={() => setSelectedFile(null)}
                  color="success"
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              )}
            </Box>
          </Box>

          <Divider />

          {/* Submit Save Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={onBack} sx={{ textTransform: 'none', fontWeight: 700, color: '#64748b' }}>
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              sx={{
                background: '#4f46e5',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 800,
                px: 4,
                py: 1.2,
                borderRadius: '10px',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
                '&:hover': { background: '#4338ca' }
              }}
            >
              {saving ? 'Saving to Database Engine...' : 'Save Milestone Progress & Sync'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
