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
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { DocumentPreviewModal } from './DocumentPreviewModal';
import { CsmtStageEditView } from './CsmtStageEditView';

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
  const [activeStage, setActiveStage] = useState<any>(project?.milestones?.[0] || null);

  // Full-Page Stage Progress Editor State
  const [selectedEditingStage, setSelectedEditingStage] = useState<any>(null);

  // Read Logged-In User Permissions
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('csmt_current_user') || '{}');
    } catch (e) {
      return {};
    }
  })();
  const canUpdateProgress = currentUser?.canUpdateProgress !== false;

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
    return [
      {
        id: 1,
        title: `Specification_Doc_v1.pdf`,
        size: '3.4 MB',
        uploadedBy: project?.supervisor || 'Lead Supervisor',
        date: new Date(Date.now() - 86400000 * 2).toLocaleDateString(),
        category: 'Design & Specs',
        status: 'VERIFIED'
      },
      {
        id: 2,
        title: `Quality_Audit_Signoff.pdf`,
        size: '1.8 MB',
        uploadedBy: 'Quality Assurance Lead',
        date: new Date(Date.now() - 86400000 * 1).toLocaleDateString(),
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
    if (!stage) return;
    setActiveStage(stage);
    const sId = stage?.id || stage?.name || 'stage-1';
    const sKey = `csmt_milestone_docs_${sId}`;
    try {
      const saved = localStorage.getItem(sKey);
      if (saved) {
        setDocuments(JSON.parse(saved));
        return;
      }
    } catch (e) {}
    const defaults = [
      {
        id: 1,
        title: `Specification_Doc_v1.pdf`,
        size: '3.4 MB',
        uploadedBy: project?.supervisor || 'Lead Supervisor',
        date: new Date(Date.now() - 86400000 * 2).toLocaleDateString(),
        category: 'Design & Specs',
        status: 'VERIFIED'
      },
      {
        id: 2,
        title: `Quality_Audit_Signoff.pdf`,
        size: '1.8 MB',
        uploadedBy: 'Quality Assurance Lead',
        date: new Date(Date.now() - 86400000 * 1).toLocaleDateString(),
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
    const dummyContent = `CSMT SCHOOLS DISTRICT INFRASTRUCTURE AUDIT PROOF\n----------------------------------------------------\nDocument Title: ${doc?.title || 'Audit Proof'}\nCategory: ${doc?.category || 'Audit Proof'}\nSize: ${doc?.size || '3.4 MB'}\nUploaded By: ${doc?.uploadedBy || 'Lead Supervisor'}\nTimestamp: ${doc?.date || new Date().toLocaleString()}\nVerification Status: VERIFIED & AUDITED BY ENGINE\n\nThis is an official verification document proof attached to the CSMT Schools District Infrastructure Portfolio.`;

    const blob = new Blob([dummyContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc?.title || 'document_audit_proof.pdf';
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
        uploadedBy: project?.supervisor || 'Lead Supervisor',
        date: new Date().toLocaleDateString(),
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

  const handleTaskSaved = (targetStageId: any, newProgress: number, notes: string) => {
    if (!project?.milestones) return;

    const updatedMilestones = project.milestones.map((m: any) => {
      if (m?.id === targetStageId || m?.name === targetStageId) {
        return { ...m, progress: newProgress };
      }
      return m;
    });

    const avgProgress = Math.round(
      updatedMilestones.reduce((sum: number, m: any) => sum + Number(m?.progress || 0), 0) / updatedMilestones.length
    );

    const updatedProj = {
      ...project,
      progress: avgProgress,
      healthScore: avgProgress === 100 ? 100.0 : project?.healthScore || 90.0,
      healthStatus: avgProgress === 100 ? 'ON_TRACK' : project?.healthStatus || 'ON_TRACK',
      milestones: updatedMilestones
    };

    onUpdateProject(updatedProj);
    if (activeStage && (activeStage?.id === targetStageId || activeStage?.name === targetStageId)) {
      setActiveStage({ ...activeStage, progress: newProgress });
    }
    setAlertMsg(`🎉 Milestone stage progress updated to ${newProgress}%! Saved directly to engine database.`);
  };

  // If Full Page Stage Editor is active, render it instead of the detail view
  if (selectedEditingStage) {
    return (
      <CsmtStageEditView
        project={project}
        stage={selectedEditingStage}
        onBack={() => setSelectedEditingStage(null)}
        onSaveProgress={handleTaskSaved}
      />
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      {/* Top Back Header Navigation */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{ mb: 3, textTransform: 'none', fontWeight: 800, color: '#334155', borderColor: '#cbd5e1', borderRadius: '10px', fontSize: '0.85rem' }}
      >
        Back to All Projects Portfolio
      </Button>

      {/* Permission Lock Warning Banner */}
      {!canUpdateProgress && (
        <Alert severity="warning" icon={<LockIcon />} sx={{ mb: 3, borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem' }}>
          <strong>PROGRESS EDITING RESTRICTED:</strong> Your Organization Admin has revoked permission to edit or update milestone progress for projects. Contact your administrator to regain access.
        </Alert>
      )}

      {/* Ultra-Modern Redesigned Responsive Project Header Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5, md: 4 },
          mb: 3,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
          color: '#ffffff',
          border: '1px solid #4338ca',
          boxShadow: '0 12px 30px rgba(30, 27, 75, 0.25)',
          overflow: 'hidden'
        }}
      >
        {/* Top Badges Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<SchoolIcon sx={{ color: '#fff !important', fontSize: 14 }} />}
            label={project?.schoolName || 'CSMT Science Campus'}
            size="small"
            sx={{ background: '#4f46e5', color: '#fff', fontWeight: 800, fontSize: '0.68rem', height: 24 }}
          />
          <Chip
            icon={<VerifiedIcon sx={{ color: '#fff !important', fontSize: 13 }} />}
            label={`HEALTH: ${project?.healthScore || 90.0}/100`}
            size="small"
            sx={{ background: project?.healthStatus === 'ON_TRACK' ? '#059669' : '#d97706', color: '#fff', fontWeight: 800, fontSize: '0.68rem', height: 24 }}
          />
        </Box>

        {/* Project Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            letterSpacing: -0.5,
            mb: 2.5,
            fontSize: { xs: '1.35rem', sm: '1.8rem', md: '2.4rem' },
            lineHeight: 1.2,
            wordBreak: 'normal',
            overflowWrap: 'break-word'
          }}
        >
          {project?.projectName || 'School Infrastructure Project'}
        </Typography>

        {/* Supervisor & Location Glassmorphism Card */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" flexWrap="wrap">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon sx={{ fontSize: 18, color: '#38bdf8' }} />
              <Typography variant="body2" sx={{ color: '#e0e7ff', fontSize: { xs: '0.78rem', sm: '0.88rem' } }}>
                Supervisor: <strong>{project?.supervisor || 'Dr. Robert Vance (HOD CS)'}</strong>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon sx={{ fontSize: 18, color: '#f472b6' }} />
              <Typography variant="body2" sx={{ color: '#e0e7ff', fontSize: { xs: '0.78rem', sm: '0.88rem' } }}>
                Location: <strong>{project?.location || 'Main Campus'}</strong>
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Budget & Progress Bar Row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountBalanceWalletIcon sx={{ color: '#34d399', fontSize: 20 }} />
            <Typography variant="caption" sx={{ color: '#a5f3fc', fontWeight: 800, fontSize: '0.72rem', letterSpacing: 0.5 }}>
              ALLOCATED BUDGET: <strong style={{ color: '#34d399', fontSize: '1rem' }}>{project?.budget || '₦35,000,000'}</strong>
            </Typography>
          </Box>

          <Typography variant="caption" sx={{ color: '#c7d2fe', fontWeight: 800, fontSize: '0.8rem' }}>
            Overall Completion: <strong>{project?.progress || 0}%</strong>
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={project?.progress || 0}
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
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 2, fontSize: '1.05rem' }}>
              📑 Project Milestones & Stages ({project?.milestones?.length || 0})
            </Typography>

            <Stack spacing={1.5}>
              {(project?.milestones || []).map((m: any) => {
                const isSelected = activeStage?.id === m?.id || activeStage?.name === m?.name;
                const isCompleted = (m?.progress || 0) >= 100;
                return (
                  <Paper
                    key={m?.id || m?.name}
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
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isSelected ? '#4f46e5' : '#0f172a', fontSize: '0.88rem' }}>
                        {m?.name || 'Milestone Stage'}
                      </Typography>
                      <Chip
                        label={`${m?.progress || 0}%`}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.65rem',
                          background: isCompleted ? '#ecfdf5' : '#e0e7ff',
                          color: isCompleted ? '#047857' : '#4338ca'
                        }}
                      />
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={m?.progress || 0}
                      sx={{ height: 6, borderRadius: 3, background: '#cbd5e1', '& .MuiLinearProgress-bar': { background: isCompleted ? '#059669' : '#4f46e5' } }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.72rem' }}>
                        Click to view stage docs
                      </Typography>

                      <Tooltip title={canUpdateProgress ? (isCompleted ? 'Progress complete (100%)' : 'Open full-page stage progress editor') : 'Permission Removed by Admin'}>
                        <span>
                          <Button
                            size="small"
                            variant="contained"
                            disabled={!canUpdateProgress}
                            startIcon={
                              !canUpdateProgress ? (
                                <LockIcon sx={{ fontSize: 13 }} />
                              ) : isCompleted ? (
                                <CheckCircleIcon sx={{ fontSize: 13 }} />
                              ) : (
                                <EditIcon sx={{ fontSize: 13 }} />
                              )
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!canUpdateProgress) return;
                              setSelectedEditingStage(m);
                            }}
                            sx={{
                              height: 30,
                              px: 2,
                              borderRadius: '20px',
                              fontSize: '0.72rem',
                              textTransform: 'none',
                              fontWeight: 800,
                              whiteSpace: 'nowrap',
                              background: !canUpdateProgress
                                ? '#f1f5f9'
                                : isCompleted
                                ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                                : 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
                              color: !canUpdateProgress ? '#94a3b8' : '#ffffff',
                              boxShadow: !canUpdateProgress ? 'none' : '0 3px 10px rgba(79, 70, 229, 0.25)',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                background: !canUpdateProgress
                                  ? '#f1f5f9'
                                  : isCompleted
                                  ? '#047857'
                                  : '#312e81',
                                transform: !canUpdateProgress ? 'none' : 'translateY(-1px)'
                              }
                            }}
                          >
                            {canUpdateProgress ? (isCompleted ? 'Completed' : 'Edit Progress') : 'Locked'}
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
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3.5, md: 4 }, borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DescriptionIcon sx={{ color: '#4f46e5', fontSize: 32 }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', fontSize: { xs: '1.1rem', sm: '1.35rem' } }}>
                    Stage Audit Documents: {activeStage?.name || 'Selected Stage'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.82rem' }}>
                    View and upload verification documents for milestone: <strong>{activeStage?.name || 'Selected Stage'}</strong>
                  </Typography>
                </Box>
              </Box>

              <Chip
                label={`${activeStage?.progress || 0}% COMPLETED`}
                size="small"
                sx={{
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  px: 1,
                  background: (activeStage?.progress || 0) >= 100 ? '#ecfdf5' : '#e0e7ff',
                  color: (activeStage?.progress || 0) >= 100 ? '#047857' : '#4338ca'
                }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Attached Documents List */}
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.95rem' }}>
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
                      p: 2,
                      borderRadius: '14px',
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc',
                      '&:hover': { borderColor: '#4f46e5', background: '#faf5ff' },
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5
                    }}
                  >
                    {/* Header: File Icon + Title + Status Badge */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Box sx={{ width: 38, height: 38, borderRadius: '10px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.2 }}>
                        <InsertDriveFileIcon sx={{ color: '#4f46e5', fontSize: 22 }} />
                      </Box>
                      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem', wordBreak: 'break-word' }}>
                            {doc.title}
                          </Typography>
                          <Chip
                            icon={<VerifiedIcon sx={{ fontSize: 12, color: '#047857 !important' }} />}
                            label={doc.status}
                            size="small"
                            sx={{ height: 20, fontSize: '0.62rem', fontWeight: 800, background: '#ecfdf5', color: '#047857' }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5, fontSize: '0.72rem' }}>
                          Category: <strong>{doc.category}</strong> • Size: {doc.size} • Uploaded by {doc.uploadedBy}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Footer: Responsive Action Buttons */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, width: '100%', pt: 0.5 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon sx={{ fontSize: 15 }} />}
                        onClick={() => handleOpenDocPreview(doc)}
                        sx={{
                          flex: { xs: 'initial', sm: 1 },
                          width: { xs: '100%', sm: 'auto' },
                          height: 36,
                          whiteSpace: 'nowrap',
                          textTransform: 'none',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          color: '#4f46e5',
                          borderColor: '#c7d2fe',
                          borderRadius: '8px',
                          '&:hover': { background: '#e0e7ff', borderColor: '#4f46e5' }
                        }}
                      >
                        View Document
                      </Button>

                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<DownloadIcon sx={{ fontSize: 15 }} />}
                        onClick={() => handleDownloadDoc(doc)}
                        sx={{
                          flex: { xs: 'initial', sm: 1 },
                          width: { xs: '100%', sm: 'auto' },
                          height: 36,
                          whiteSpace: 'nowrap',
                          textTransform: 'none',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          background: '#059669',
                          color: '#fff',
                          borderRadius: '8px',
                          boxShadow: '0 2px 6px rgba(5, 150, 105, 0.2)',
                          '&:hover': { background: '#047857' }
                        }}
                      >
                        Download Proof
                      </Button>
                    </Box>
                  </Paper>
                ))
              )}
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Document Upload Form */}
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.95rem' }}>
              <CloudUploadIcon sx={{ color: '#4f46e5' }} />
              Upload Audit Proof Document to "{activeStage?.name || 'Selected Stage'}"
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
                  sx={{ textTransform: 'none', fontWeight: 700, borderColor: '#cbd5e1', color: '#334155', fontSize: '0.8rem' }}
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
                  sx={{
                    background: '#4f46e5',
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 800,
                    height: 42,
                    whiteSpace: 'nowrap',
                    px: 3,
                    fontSize: '0.85rem',
                    borderRadius: '10px',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                    width: { xs: '100%', sm: 'auto' },
                    ml: { xs: 0, sm: 'auto' },
                    '&:hover': { background: '#4338ca' }
                  }}
                >
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

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
