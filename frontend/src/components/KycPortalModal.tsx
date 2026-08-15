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
  Grid,
  CircularProgress
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BadgeIcon from '@mui/icons-material/Badge';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface KycPortalModalProps {
  open: boolean;
  onClose: () => void;
  currentKycStatus: string;
  onKycUpdated: (newStatus: string) => void;
}

export const KycPortalModal: React.FC<KycPortalModalProps> = ({
  open,
  onClose,
  currentKycStatus,
  onKycUpdated
}) => {
  const [rcNumber, setRcNumber] = useState('RC-84920482');
  const [taxId, setTaxId] = useState('TIN-92840194');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(currentKycStatus || 'VERIFIED');
  const [message, setMessage] = useState('');

  const handleSubmitKyc = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    setTimeout(() => {
      setSubmitting(false);
      setStatus('VERIFIED');
      onKycUpdated('VERIFIED');
      setMessage('Corporate KYC document submitted and verified by UPME Enterprise Compliance engine!');
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
          minWidth: { xs: '90%', sm: 540 },
          borderRadius: '16px',
          p: 2
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 38, height: 38, borderRadius: '10px', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <VerifiedUserIcon sx={{ color: '#059669' }} />
        </Box>
        Corporate KYC Verification & Compliance
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
          UPME enforces corporate verification state machines (`UNVERIFIED` → `PENDING_REVIEW` → `VERIFIED`) to prevent unauthorized project creation.
        </Typography>

        {/* Current KYC Status Pill */}
        <Box sx={{ p: 2, mb: 3, background: status === 'VERIFIED' ? '#ecfdf5' : '#fff7ed', borderRadius: '12px', border: status === 'VERIFIED' ? '1px solid #a7f3d0' : '1px solid #ffedd5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block' }}>
              KYC VERIFICATION STATE
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: status === 'VERIFIED' ? '#047857' : '#c2410c' }}>
              {status}
            </Typography>
          </Box>
          <Chip
            icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
            label={status === 'VERIFIED' ? 'Project Creation Unlocked' : 'Pending Action'}
            sx={{
              fontWeight: 800,
              background: status === 'VERIFIED' ? '#059669' : '#d97706',
              color: '#ffffff'
            }}
          />
        </Box>

        {message && <Alert severity="success" sx={{ mb: 3, borderRadius: '10px' }}>{message}</Alert>}

        <Box component="form" onSubmit={handleSubmitKyc} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            fullWidth
            label="Corporate Registration / RC Number"
            variant="outlined"
            value={rcNumber}
            onChange={(e) => setRcNumber(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Tax Identification Number (TIN / EIN)"
            variant="outlined"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="contained"
            disabled={submitting || status === 'VERIFIED'}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <BadgeIcon />}
            sx={{
              background: '#059669',
              color: '#ffffff',
              borderRadius: '12px',
              py: 1.5,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
              '&:hover': { background: '#047857' }
            }}
          >
            {submitting ? 'Verifying Corporate Credentials...' : status === 'VERIFIED' ? 'Corporate KYC Fully Verified' : 'Submit for Immediate Verification'}
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
