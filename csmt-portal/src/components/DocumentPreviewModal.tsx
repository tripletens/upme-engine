import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Chip,
  Paper,
  IconButton,
  Divider,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import VerifiedIcon from '@mui/icons-material/Verified';
import PrintIcon from '@mui/icons-material/Print';
import SecurityIcon from '@mui/icons-material/Security';

interface DocumentPreviewModalProps {
  open: boolean;
  onClose: () => void;
  document: any;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  open,
  onClose,
  document: doc
}) => {
  if (!doc) return null;

  const handleDownload = () => {
    // Generate a downloadable text/PDF file blob dynamically
    const dummyContent = `CSMT SCHOOLS DISTRICT INFRASTRUCTURE AUDIT PROOF\n----------------------------------------------------\nDocument Title: ${doc.title}\nCategory: ${doc.category || 'Audit Proof'}\nSize: ${doc.size || '3.4 MB'}\nUploaded By: ${doc.uploadedBy || 'Lead Supervisor'}\nTimestamp: ${doc.date || new Date().toLocaleString()}\nVerification Status: VERIFIED & AUDITED BY ENGINE (MySQL)\n\nThis is an official verification document proof attached to the CSMT Schools District Infrastructure Portfolio.`;
    
    const blob = new Blob([dummyContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.title || 'document_audit_proof.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          overflow: 'hidden',
          minHeight: 620
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          color: '#ffffff',
          py: 2,
          px: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PictureAsPdfIcon sx={{ color: '#38bdf8', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              {doc.title}
            </Typography>
            <Typography variant="caption" sx={{ color: '#c7d2fe' }}>
              Document Category: {doc.category || 'Audit Proof'} • Size: {doc.size || '3.4 MB'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#ffffff' }} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, background: '#f8fafc' }}>
        {/* Document Metadata Bar */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={<VerifiedIcon sx={{ color: '#047857 !important', fontSize: 14 }} />}
              label="VERIFIED STAGE PROOF"
              size="small"
              sx={{ background: '#ecfdf5', color: '#047857', fontWeight: 800, border: '1px solid #a7f3d0' }}
            />
            <Chip
              icon={<SecurityIcon sx={{ color: '#4338ca !important', fontSize: 14 }} />}
              label="TAMPER-PROOF AUDIT HASH"
              size="small"
              sx={{ background: '#e0e7ff', color: '#4338ca', fontWeight: 800 }}
            />
          </Box>

          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
            Uploaded by <strong>{doc.uploadedBy}</strong> on {doc.date}
          </Typography>
        </Paper>

        {/* Embedded Interactive PDF Viewer Frame */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '14px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            minHeight: 380,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justify: 'center',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.03)'
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 550,
              p: 4,
              borderRadius: '12px',
              border: '2px dashed #a5b4fc',
              background: '#f5f3ff',
              textAlign: 'center'
            }}
          >
            <PictureAsPdfIcon sx={{ fontSize: 64, color: '#4f46e5', mb: 2 }} />
            
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
              {doc.title}
            </Typography>

            <Typography variant="body2" sx={{ color: '#475569', mb: 3 }}>
              Official Infrastructure Audit Proof Document attached to CSMT Schools District Portfolio. Signed & Verified by {doc.uploadedBy}.
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                sx={{
                  background: '#059669',
                  color: '#ffffff',
                  fontWeight: 800,
                  textTransform: 'none',
                  borderRadius: '10px',
                  px: 3,
                  py: 1,
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                  '&:hover': { background: '#047857' }
                }}
              >
                Download Official PDF
              </Button>

              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={() => window.print()}
                sx={{
                  color: '#4f46e5',
                  borderColor: '#c7d2fe',
                  fontWeight: 800,
                  textTransform: 'none',
                  borderRadius: '10px',
                  px: 2.5
                }}
              >
                Print Document
              </Button>
            </Stack>
          </Box>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <Button onClick={onClose} sx={{ color: '#64748b', fontWeight: 700 }}>
          Close Preview
        </Button>
      </DialogActions>
    </Dialog>
  );
};
