import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  LinearProgress,
  Divider,
  Stack,
  Alert,
  TextField,
  MenuItem,
  CircularProgress,
  Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import VerifiedIcon from '@mui/icons-material/Verified';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockIcon from '@mui/icons-material/Lock';

import { UpdateCsmtTaskModal } from './UpdateCsmtTaskModal';
import { DocumentPreviewModal } from './DocumentPreviewModal';

interface CsmtProjectDetailViewProps {
  project: any;
  onBack: () => void;
  onUpdateProject: (updatedProj: any) => void;
}

export const CsmtProjectDetailView: React.FC<CsmtProjectDetailViewProps> = ({
  project,
  onBack,
  onUpdateProject
}) => {
  const [activeStage, setActiveStage] = useState<any>(project.milestones?.[0] || null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // Read Logged-In User Permissions
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('csmt_current_user') || '{}');
    } catch (e) {
      return {};
    }
  })();
  const canUpdateProgress = currentUser.canUpdateProgress !== false;

  // Document Viewer Preview Modal State
  const [previewDocModalOpen, setPreviewDocModalOpen] = useState(false);
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<any>(null);

  // Per-stage document storage key
  const stageId = activeStage?.id || activeStage?.name || 'stage-1';
  const docStorageKey = `csmt_milestone_docs_${stageId}`;

  const [documents, setDocuments] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem(docStorageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    const cleanStage = (activeStage?.name || 'Milestone').replace(/[^a-zA-Z0-9]/g, '_');
    return [
      {
        id: 1,
        title: `Specification_Doc_${cleanStage}_v1.pdf`,
        size: '3.4 MB',
        uploadedBy: project.supervisor,
        date: new Date(Date.now() - 86400000 * 2).toLocaleString(),
        category: 'Design & Specs',
        status: 'VERIFIED'
      },
      {
        id: 2,
        title: `Quality_Audit_Signoff_${cleanStage}.pdf`,
        size: '1.8 MB',
        uploadedBy: 'Quality Assurance Lead',
        date: new Date(Date.now() - 86400000 * 1).toLocaleString(),
        category: 'Audit Certificate',
        status: 'VERIFIED'
      }
    ];
  });

  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('Audit Proof');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  const handleStageSelect = (stage: any) => {
    setActiveStage(stage);
    const sId = stage.id || stage.name || 'stage-1';
    const sKey = `csmt_milestone_docs_${sId}`;
    try {
      const saved = localStorage.getItem(sKey);
      if (saved) {
        setDocuments(JSON.parse(saved));
        return;
      }
    } catch (e) {}
    const cleanStage = (stage.name || 'Milestone').replace(/[^a-zA-Z0-9]/g, '_');
    const defaults = [
      {
        id: 1,
        title: `Specification_Doc_${cleanStage}_v1.pdf`,
        size: '3.4 MB',
        uploadedBy: project.supervisor,
        date: new Date(Date.now() - 86400000 * 2).toLocaleString(),
        category: 'Design & Specs',
        status: 'VERIFIED'
      },
      {
        id: 2,
        title: `Quality_Audit_Signoff_${cleanStage}.pdf`,
        size: '1.8 MB',
        uploadedBy: 'Quality Assurance Lead',
        date: new Date(Date.now() - 86400000 * 1).toLocaleString(),
        category: 'Audit Certificate',
        status: 'VERIFIED'
      }
    ];
    setDocuments(defaults);
    try {
      localStorage.setItem(sKey, JSON.stringify(defaults));
    } catch (e) {}
  };

  const handleOpenDocPreview = (doc: any) => {
    setSelectedPreviewDoc(doc);
    setPreviewDocModalOpen(true);
  };

  const handleDownloadDoc = (doc: any) => {
    const dummyContent = `CSMT SCHOOLS DISTRICT INFRASTRUCTURE AUDIT PROOF\n----------------------------------------------------\nDocument Title: ${doc.title}\nCategory: ${doc.category || 'Audit Proof'}\nSize: ${doc.size || '3.4 MB'}\nUploaded By: ${doc.uploadedBy || 'Lead Supervisor'}\nTimestamp: ${doc.date || new Date().toLocaleString()}\nVerification Status: VERIFIED & AUDITED BY ENGINE\n\nThis is an official verification document proof attached to the CSMT Schools District Infrastructure Portfolio.`;

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

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    const fileName = selectedFile ? selectedFile.name : docTitle.trim();
    if (!fileName) return;

    setUploading(true);

    setTimeout(() => {
      const formattedTitle = fileName.includes('.') ? fileName : `${fileName.replace(/\s+/g, '_')}.pdf`;
      const fileSize = selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '2.1 MB';

      const newDoc = {
        id: Date.now(),
        title: formattedTitle,
        size: fileSize,
        uploadedBy: project.supervisor,
        date: new Date().toLocaleString(),
        category: docCategory,
        status: 'VERIFIED'
      };

      const updatedDocs = [newDoc, ...documents];
      setDocuments(updatedDocs);
      try {
        localStorage.setItem(docStorageKey, JSON.stringify(updatedDocs));
      } catch (err) {}

      setUploading(false);
      setDocTitle('');
      setSelectedFile(null);
      setAlertMsg(`🎉 Document "${formattedTitle}" uploaded to milestone stage "${activeStage?.name}"!`);
    }, 500);
  };

  const handleTaskSaved = (newProgress: number) => {
    if (!selectedTask) return;

    const updatedMilestones = project.milestones.map((m: any) => {
      if (m.id === selectedTask.id || m.name === selectedTask.name) {
        return { ...m, progress: newProgress };
      }
      return m;
    });

    const avgProgress = Math.round(
      updatedMilestones.reduce((sum: number, m: any) => sum + Number(m.progress || 0), 0) / updatedMilestones.length
    );

    const updatedProj = {
      ...project,
      progress: avgProgress,
      healthScore: avgProgress === 100 ? 100.0 : project.healthScore,
      healthStatus: avgProgress === 100 ? 'ON_TRACK' : project.healthStatus,
      milestones: updatedMilestones
    };

    onUpdateProject(updatedProj);
    if (activeStage && (activeStage.id === selectedTask.id || activeStage.name === selectedTask.name)) {
      setActiveStage({ ...activeStage, progress: newProgress });
    }
    setAlertMsg(`🎉 Task "${selectedTask.name}" progress updated to ${newProgress}%!`);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      {/* Top Back Header Navigation */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{ mb: 3, textTransform: 'none', fontWeight: 800, color: '#334155', borderColor: '#cbd5e1', borderRadius: '10px' }}
      >
        Back to All Projects Portfolio
      </Button>

      {/* Permission Lock Warning Banner */}
      {!canUpdateProgress && (
        <Alert severity="warning" icon={<LockIcon />} sx={{ mb: 3, borderRadius: '12px', fontWeight: 700 }}>
          <strong>PROGRESS EDITING RESTRICTED:</strong> Your Organization Admin has revoked permission to edit or update milestone progress for projects. Contact your administrator to regain access.
        </Alert>
      )}

      {/* Main Project Overview Card */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          color: '#ffffff',
          border: '1px solid #4338ca'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Box sx={{ maxWidth: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<SchoolIcon sx={{ color: '#fff !important', fontSize: 16 }} />}
                label={project.schoolName || 'CSMT Science Campus'}
                sx={{ background: '#4f46e5', color: '#fff', fontWeight: 800 }}
              />
              <Chip
                icon={<VerifiedIcon sx={{ color: '#fff !important', fontSize: 14 }} />}
                label={`HEALTH: ${project.healthScore}/100 (${project.healthStatus})`}
                sx={{ background: project.healthStatus === 'ON_TRACK' ? '#059669' : '#d97706', color: '#fff', fontWeight: 800 }}
              />
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -0.5, mb: 1, wordBreak: 'break-word' }}>
              {project.projectName}
            </Typography>

            <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ color: '#c7d2fe', fontSize: '0.88rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PersonIcon sx={{ fontSize: 16 }} /> Lead Supervisor: <strong>{project.supervisor}</strong>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOnIcon sx={{ fontSize: 16 }} /> Location: <strong>{project.location || 'Main Campus'}</strong>
              </Box>
            </Stack>
          </Box>

          <Box sx={{ textAlign: 'right', background: 'rgba(255, 255, 255, 0.1)', p: 2.5, borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <Typography variant="caption" sx={{ color: '#a5f3fc', fontWeight: 800, display: 'block' }}>
              ALLOCATED BUDGET (NAIRA)
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#34d399', my: 0.5 }}>
              {project.budget}
            </Typography>
            <Typography variant="caption" sx={{ color: '#c7d2fe', fontWeight: 700 }}>
              Overall Completion: {project.progress}%
            </Typography>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={project.progress}
          sx={{ height: 10, borderRadius: 5, background: 'rgba(255, 255, 255, 0.2)', '& .MuiLinearProgress-bar': { background: '#34d399' } }}
        />
      </Paper>

      {alertMsg && (
        <Alert severity="success" sx={{ mb: 4, borderRadius: '12px' }} onClose={() => setAlertMsg('')}>
          {alertMsg}
        </Alert>
      )}

      {/* Main Content Layout Grid */}
      <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
        {/* Left Column: Milestone Stages Selector */}
        <Grid item xs={12} md={4} sx={{ pl: '0 !important', pt: '0 !important' }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
              📑 Project Milestones & Stages ({project.milestones?.length || 0})
            </Typography>

            <Stack spacing={1.5}>
              {(project.milestones || []).map((m: any) => {
                const isSelected = activeStage?.id === m.id || activeStage?.name === m.name;
                return (
                  <Paper
                    key={m.id || m.name}
                    elevation={0}
                    onClick={() => handleStageSelect(m)}
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: isSelected ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                      background: isSelected ? '#f5f3ff' : '#f8fafc',
                      transition: 'all 0.2s ease',
                      '&:hover': { borderColor: '#4f46e5', background: '#f5f3ff' }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isSelected ? '#4f46e5' : '#0f172a' }}>
                        {m.name}
                      </Typography>
                      <Chip
                        label={`${m.progress}%`}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.65rem',
                          background: m.progress >= 100 ? '#ecfdf5' : '#e0e7ff',
                          color: m.progress >= 100 ? '#047857' : '#4338ca'
                        }}
                      />
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={m.progress}
                      sx={{ height: 6, borderRadius: 3, background: '#cbd5e1', '& .MuiLinearProgress-bar': { background: m.progress >= 100 ? '#059669' : '#4f46e5' } }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                        Click to view stage docs
                      </Typography>

                      <Tooltip title={canUpdateProgress ? 'Update progress %' : 'Permission Removed by Admin'}>
                        <span>
                          <Button
                            size="small"
                            variant="contained"
                            disabled={!canUpdateProgress}
                            startIcon={canUpdateProgress ? <EditIcon sx={{ fontSize: 12 }} /> : <LockIcon sx={{ fontSize: 12 }} />}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!canUpdateProgress) return;
                              setSelectedTask(m);
                              setTaskModalOpen(true);
                            }}
                            sx={{ fontSize: '0.65rem', textTransform: 'none', fontWeight: 800, background: canUpdateProgress ? '#4f46e5' : '#94a3b8', px: 1.5 }}
                          >
                            {canUpdateProgress ? 'Update %' : 'Locked'}
                          </Button>
                        </span>
                      </Tooltip>
                    </Box>
                  </Paper>
                );
              })}
            </Stack>
          </Paper>
        </Grid>

        {/* Right Column: Stage Details & Document Audit Hub */}
        <Grid item xs={12} md={8} sx={{ pr: '0 !important', pt: { xs: '24px !important', md: '0 !important' } }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DescriptionIcon sx={{ color: '#4f46e5', fontSize: 32 }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    Stage Audit Documents: {activeStage?.name || 'Selected Stage'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    View and upload verification documents for milestone: <strong>{activeStage?.name}</strong>
                  </Typography>
                </Box>
              </Box>

              <Chip
                label={`${activeStage?.progress || 0}% COMPLETED`}
                size="small"
                sx={{
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  px: 1,
                  background: (activeStage?.progress || 0) >= 100 ? '#ecfdf5' : '#e0e7ff',
                  color: (activeStage?.progress || 0) >= 100 ? '#047857' : '#4338ca'
                }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Attached Documents List */}
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <InsertDriveFileIcon sx={{ color: '#059669' }} />
              Attached Proof Documents ({documents.length})
            </Typography>

            <Stack spacing={2} sx={{ mb: 4 }}>
              {documents.length === 0 ? (
                <Paper elevation={0} sx={{ p: 4, textAlign: 'center', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px' }}>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    No audit documents uploaded for this stage yet. Upload files using the form below.
                  </Typography>
                </Paper>
              ) : (
                documents.map((doc) => (
                  <Paper
                    key={doc.id}
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc',
                      '&:hover': { borderColor: '#4f46e5', background: '#faf5ff' },
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <InsertDriveFileIcon sx={{ color: '#4f46e5', fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem', wordBreak: 'break-word' }}>
                            {doc.title}
                          </Typography>
                          <Chip
                            icon={<VerifiedIcon sx={{ fontSize: 13, color: '#047857 !important' }} />}
                            label={doc.status}
                            size="small"
                            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, background: '#ecfdf5', color: '#047857' }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.3 }}>
                          Category: <strong>{doc.category}</strong> • Size: {doc.size} • Uploaded by {doc.uploadedBy} at {doc.date}
                        </Typography>
                      </Box>
                    </Box>

                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                        onClick={() => handleOpenDocPreview(doc)}
                        sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', color: '#4f46e5', borderColor: '#c7d2fe' }}
                      >
                        View Document
                      </Button>

                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
                        onClick={() => handleDownloadDoc(doc)}
                        sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', background: '#059669', color: '#fff', '&:hover': { background: '#047857' } }}
                      >
                        Download
                      </Button>
                    </Stack>
                  </Paper>
                ))
              )}
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Document Upload Form */}
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CloudUploadIcon sx={{ color: '#4f46e5' }} />
              Upload Audit Proof Document to "{activeStage?.name}"
            </Typography>

            <Box component="form" onSubmit={handleUploadDoc} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Document Title"
                    placeholder="e.g. Electrical_Safety_Inspection_Certificate"
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
                    label="Category"
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value)}
                  >
                    <MenuItem value="Audit Proof">Audit Proof / Evidence</MenuItem>
                    <MenuItem value="Inspection Certificate">Inspection Certificate</MenuItem>
                    <MenuItem value="Design & Specs">Design & Blueprints</MenuItem>
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
                  sx={{ background: '#4f46e5', color: '#fff', textTransform: 'none', fontWeight: 800, ml: 'auto', px: 3, py: 1 }}
                >
                  {uploading ? 'Uploading...' : 'Upload Document to Stage'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Task Progress Update Modal */}
      {selectedTask && (
        <UpdateCsmtTaskModal
          open={taskModalOpen}
          onClose={() => setTaskModalOpen(false)}
          taskId={selectedTask.id}
          taskName={selectedTask.name}
          currentProgress={selectedTask.progress}
          supervisorName={project.supervisor}
          onSaveSuccess={handleTaskSaved}
        />
      )}

      {/* Rich Interactive Document Preview Modal */}
      {selectedPreviewDoc && (
        <DocumentPreviewModal
          open={previewDocModalOpen}
          onClose={() => setPreviewDocModalOpen(false)}
          document={selectedPreviewDoc}
        />
      )}
    </Box>
  );
};
