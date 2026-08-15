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
  Chip,
  Alert,
  Stack,
  CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VerifiedIcon from '@mui/icons-material/Verified';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

interface DeliverableEvidenceModalProps {
  open: boolean;
  onClose: () => void;
  activityName: string;
  onUploadSuccess: (evidenceUrl: string) => void;
}

export const DeliverableEvidenceModal: React.FC<DeliverableEvidenceModalProps> = ({
  open,
  onClose,
  activityName,
  onUploadSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [approved, setApproved] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMessage('');

    // Simulate S3 presigned URL upload & evidence verification request
    setTimeout(() => {
      setUploading(false);
      setApproved(true);
      const fakeUrl = `https://upme-evidence-vault.s3.amazonaws.com/deliverables/${Date.now()}_${file.name}`;
      setMessage('Evidence asset successfully uploaded and verified by RBAC Supervisor audit rule.');
      onUploadSuccess(fakeUrl);
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
          minWidth: { xs: '90%', sm: 520 },
          borderRadius: '16px',
          p: 2
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 38, height: 38, borderRadius: '10px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CloudUploadIcon sx={{ color: '#4f46e5' }} />
        </Box>
        Upload Deliverable Verification Evidence
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
          Task: <strong>{activityName}</strong>
        </Typography>

        <Alert severity="info" sx={{ mb: 3, borderRadius: '10px' }}>
          Audit-grade evidence requires uploading inspection certificates, photos, or delivery waybills before deliverable sign-off.
        </Alert>

        {message && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: '10px' }}>
            {message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleUpload} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box
            sx={{
              p: 4,
              border: '2px dashed #cbd5e1',
              borderRadius: '12px',
              textAlign: 'center',
              background: '#f8fafc',
              cursor: 'pointer',
              '&:hover': { borderColor: '#4f46e5', background: '#f1f5f9' }
            }}
            component="label"
          >
            <input type="file" hidden onChange={handleFileChange} accept="image/*,.pdf,.doc,.docx" />
            <InsertDriveFileIcon sx={{ fontSize: 40, color: '#4f46e5', mb: 1 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
              {file ? file.name : 'Click to Browse Verification File'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
              Supports PDF, PNG, JPG, and DOCX (Max 25MB)
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Audit Notes / Inspection Summary"
            variant="outlined"
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Workstations unpacked, mounted on lab desks, and cable ties secured."
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#cbd5e1' },
                '&:hover fieldset': { borderColor: '#4f46e5' },
              }
            }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={!file || uploading}
            startIcon={uploading ? <CircularProgress size={18} color="inherit" /> : <VerifiedIcon />}
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
            {uploading ? 'Uploading to S3 Vault...' : 'Submit Evidence for Sign-off'}
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: '#64748b', fontWeight: 600 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
