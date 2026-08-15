import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  LinearProgress,
  IconButton,
  TextField,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VerifiedIcon from '@mui/icons-material/Verified';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';

interface StageDocumentViewerModalProps {
  open: boolean;
  onClose: () => void;
  stageName: string;
  projectName: string;
  supervisorName: string;
  progress: number;
  startDate?: string;
  endDate?: string;
}

export const StageDocumentViewerModal: React.FC<StageDocumentViewerModalProps> = ({
  open,
  onClose,
  stageName,
  projectName,
  supervisorName,
  progress,
  startDate = '2026-08-01',
  endDate = '2026-08-25'
}) => {
  const [documents, setDocuments] = useState<any[]>([
    {
      id: 1,
      title: 'Architectural_Blueprint_&_Electrical_Layout_v2.pdf',
      type: 'PDF Document',
      size: '4.2 MB',
      uploadedBy: supervisorName,
      date: '2026-08-05 10:30 AM',
      category: 'Design & Blueprints',
      status: 'VERIFIED',
      url: '#'
    },
    {
      id: 2,
      title: 'Government_Safety_&_Building_Inspection_Certificate.pdf',
      type: 'PDF Certificate',
      size: '1.8 MB',
      uploadedBy: 'Engr. David Opara (Quality Inspector)',
      date: '2026-08-10 02:15 PM',
      category: 'Inspection Certificate',
      status: 'VERIFIED',
      url: '#'
    },
    {
      id: 3,
      title: 'Equipment_Procurement_Invoice_&_Receipt_Naira.pdf',
      type: 'PDF Invoice',
      size: '850 KB',
      uploadedBy: supervisorName,
      date: '2026-08-12 11:00 AM',
      category: 'Procurement Receipt',
      status: 'VERIFIED',
      url: '#'
    },
    {
      id: 4,
      title: 'Site_Work_Completion_Photo_01.jpg',
      type: 'High-Res Image',
      size: '3.1 MB',
      uploadedBy: supervisorName,
      date: '2026-08-14 04:45 PM',
      category: 'Photographic Proof',
      status: 'VERIFIED',
      url: '#'
    }
  ]);

  const [uploading, setUploading] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [alertMsg, setAlertMsg] = useState('');

  const handleUploadNewDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    setUploading(true);
    setTimeout(() => {
      const newDoc = {
        id: Date.now(),
        title: `${newDocTitle.replace(/\s+/g, '_')}_${Date.now().toString().slice(-4)}.pdf`,
        type: 'PDF Document',
        size: '2.4 MB',
        uploadedBy: supervisorName,
        date: new Date().toLocaleString(),
        category: 'Audit Attachment',
        status: 'VERIFIED',
        url: '#'
      };

      setDocuments((prev) => [newDoc, ...prev]);
      setUploading(false);
      setNewDocTitle('');
      setAlertMsg(`🎉 Document "${newDoc.title}" attached to stage "${stageName}" and saved to UPME audit repository!`);
    }, 600);
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: '16px', p: 1, minWidth: { xs: '92%', sm: 680 } } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <DescriptionIcon sx={{ color: '#4f46e5', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              Stage Documents & Audit Details
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Project: {projectName}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Stage Overview Metadata Card */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b' }}>
              Stage: {stageName}
            </Typography>
            <Chip
              label={`${progress}% COMPLETE`}
              size="small"
              sx={{
                fontWeight: 800,
                background: progress >= 100 ? '#ecfdf5' : '#e0e7ff',
                color: progress >= 100 ? '#047857' : '#4338ca'
              }}
            />
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 8, borderRadius: 4, mb: 2, background: '#cbd5e1', '& .MuiLinearProgress-bar': { background: '#4f46e5' } }}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 13 }} /> Schedule Window: {startDate} → {endDate}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PersonIcon sx={{ fontSize: 13 }} /> Stage Supervisor: {supervisorName}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {alertMsg && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: '10px' }} onClose={() => setAlertMsg('')}>
            {alertMsg}
          </Alert>
        )}

        {/* Attached Audit Documents List */}
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <InsertDriveFileIcon sx={{ color: '#059669', fontSize: 20 }} />
          ATTACHED AUDIT DOCUMENTS & EVIDENCE ({documents.length})
        </Typography>

        <Stack spacing={1.5} sx={{ mb: 3 }}>
          {documents.map((doc) => (
            <Paper
              key={doc.id}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                '&:hover': { borderColor: '#4f46e5', background: '#faf5ff' },
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1.5
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <InsertDriveFileIcon sx={{ color: '#4f46e5' }} />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>
                      {doc.title}
                    </Typography>
                    <Chip
                      icon={<VerifiedIcon sx={{ fontSize: 13, color: '#047857 !important' }} />}
                      label={doc.status}
                      size="small"
                      sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800, background: '#ecfdf5', color: '#047857' }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Category: <strong>{doc.category}</strong> • Size: {doc.size} • Uploaded by {doc.uploadedBy} on {doc.date}
                  </Typography>
                </Box>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                  onClick={() => alert(`Previewing document "${doc.title}"...`)}
                  sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', color: '#4f46e5', borderColor: '#c7d2fe' }}
                >
                  View
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
                  onClick={() => alert(`Downloading "${doc.title}"...`)}
                  sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', background: '#059669', color: '#fff', '&:hover': { background: '#047857' } }}
                >
                  Download
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Upload New Document Form */}
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CloudUploadIcon sx={{ color: '#4f46e5', fontSize: 20 }} />
          ATTACH NEW AUDIT DOCUMENT / INSPECTION CERTIFICATE
        </Typography>

        <Box component="form" onSubmit={handleUploadNewDoc} sx={{ display: 'flex', gap: 1.5 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter Document Title (e.g. Electrical_Inspection_Pass_Certificate)"
            value={newDocTitle}
            onChange={(e) => setNewDocTitle(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            disabled={uploading}
            startIcon={<CloudUploadIcon />}
            sx={{ background: '#4f46e5', color: '#fff', textTransform: 'none', fontWeight: 800, whiteSpace: 'nowrap', px: 3 }}
          >
            {uploading ? 'Attaching...' : 'Upload & Attach'}
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: '#64748b' }}>Close Viewer</Button>
      </DialogActions>
    </Dialog>
  );
};
