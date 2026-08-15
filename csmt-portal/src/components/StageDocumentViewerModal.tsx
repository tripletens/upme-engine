import React, { useState, useEffect } from 'react';
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
  Alert,
  MenuItem
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
  stageId: string | number;
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
  stageId,
  stageName,
  projectName,
  supervisorName,
  progress,
  startDate = '2026-08-01',
  endDate = '2026-08-25'
}) => {
  const docStorageKey = `csmt_milestone_docs_${stageId}`;

  // Default seed documents per milestone stage
  const getDefaultDocs = () => [
    {
      id: 1,
      title: `Blueprint_${stageName.replace(/[^a-zA-Z0-9]/g, '_')}_v1.pdf`,
      type: 'PDF Blueprint',
      size: '3.4 MB',
      uploadedBy: supervisorName,
      date: new Date(Date.now() - 86400000 * 3).toLocaleString(),
      category: 'Design & Specification',
      status: 'VERIFIED'
    },
    {
      id: 2,
      title: `Safety_Compliance_Pass_${stageName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      type: 'PDF Certificate',
      size: '1.2 MB',
      uploadedBy: 'Engr. Quality Auditor',
      date: new Date(Date.now() - 86400000 * 1).toLocaleString(),
      category: 'Inspection Certificate',
      status: 'VERIFIED'
    }
  ];

  const [documents, setDocuments] = useState<any[]>([]);
  const [docTitle, setDocTitle] = useState('');
  const [category, setCategory] = useState('Audit Proof');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem(docStorageKey);
      if (saved) {
        setDocuments(JSON.parse(saved));
      } else {
        const defaults = getDefaultDocs();
        setDocuments(defaults);
        localStorage.setItem(docStorageKey, JSON.stringify(defaults));
      }
    }
  }, [open, stageId]);

  const handleUploadNewDoc = (e: React.FormEvent) => {
    e.preventDefault();
    const fileName = selectedFile ? selectedFile.name : docTitle.trim();
    if (!fileName) return;

    setUploading(true);

    setTimeout(() => {
      const formattedTitle = fileName.includes('.') ? fileName : `${fileName.replace(/\s+/g, '_')}.pdf`;
      const fileSize = selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '2.1 MB';
      const fileType = selectedFile ? selectedFile.type || 'PDF Document' : 'PDF Document';

      const newDoc = {
        id: Date.now(),
        title: formattedTitle,
        type: fileType,
        size: fileSize,
        uploadedBy: supervisorName,
        date: new Date().toLocaleString(),
        category,
        status: 'VERIFIED'
      };

      const updatedDocs = [newDoc, ...documents];
      setDocuments(updatedDocs);
      localStorage.setItem(docStorageKey, JSON.stringify(updatedDocs));

      setUploading(false);
      setDocTitle('');
      setSelectedFile(null);
      setAlertMsg(`🎉 Document "${formattedTitle}" uploaded to milestone "${stageName}" at ${newDoc.date}!`);
    }, 600);
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: '16px', p: 1, minWidth: { xs: '92%', sm: 700 } } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <DescriptionIcon sx={{ color: '#4f46e5', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              Stage Audit Documents: {stageName}
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
              Milestone Stage: {stageName}
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
          ATTACHED AUDIT DOCUMENTS FOR THIS STAGE ({documents.length})
        </Typography>

        <Stack spacing={1.5} sx={{ mb: 3, maxHeight: 280, overflowY: 'auto' }}>
          {documents.length === 0 ? (
            <Paper elevation={0} sx={{ p: 3, textAlign: 'center', background: '#ffffff', border: '1px dashed #cbd5e1', borderRadius: '12px' }}>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                No documents uploaded for this milestone stage yet. Use the form below to attach files.
              </Typography>
            </Paper>
          ) : (
            documents.map((doc) => (
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
                      Category: <strong>{doc.category}</strong> • Size: {doc.size} • Uploaded by {doc.uploadedBy} at {doc.date}
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
            ))
          )}
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Upload New Document Form with File Attachment */}
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CloudUploadIcon sx={{ color: '#4f46e5', fontSize: 20 }} />
          UPLOAD NEW DOCUMENT TO THIS SPECIFIC MILESTONE STAGE
        </Typography>

        <Box component="form" onSubmit={handleUploadNewDoc} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                size="small"
                label="Document Title / Name"
                placeholder="e.g. Electrical_Inspection_Pass_Certificate"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                required={!selectedFile}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                size="small"
                label="Document Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="Audit Proof">Audit Proof / Evidence</MenuItem>
                <MenuItem value="Inspection Certificate">Inspection Certificate</MenuItem>
                <MenuItem value="Design & Blueprints">Design & Blueprints</MenuItem>
                <MenuItem value="Procurement Receipt">Procurement Receipt</MenuItem>
                <MenuItem value="Photographic Proof">Photographic Proof</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ textTransform: 'none', fontWeight: 700, borderColor: '#cbd5e1', color: '#334155' }}
            >
              Choose File from Device...
              <input
                type="file"
                hidden
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                    setDocTitle(e.target.files[0].name);
                  }
                }}
              />
            </Button>

            {selectedFile && (
              <Chip
                label={`Selected: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)`}
                onDelete={() => setSelectedFile(null)}
                color="primary"
                size="small"
                sx={{ fontWeight: 700 }}
              />
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={uploading}
              startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
              sx={{ background: '#4f46e5', color: '#fff', textTransform: 'none', fontWeight: 800, ml: 'auto', px: 3 }}
            >
              {uploading ? 'Uploading Document...' : 'Upload & Save to Milestone'}
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: '#64748b' }}>Close Viewer</Button>
      </DialogActions>
    </Dialog>
  );
};
