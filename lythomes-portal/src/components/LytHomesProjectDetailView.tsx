import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  LinearProgress,
  Stack,
  Divider,
  TextField,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FoundationIcon from '@mui/icons-material/Foundation';
import EngineeringIcon from '@mui/icons-material/Engineering';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import { LytHomesStageEditView } from './LytHomesStageEditView';

interface LytHomesProjectDetailViewProps {
  project: any;
  onBack: () => void;
  onUpdateProject: (updatedProj: any) => void;
}

export const LytHomesProjectDetailView: React.FC<LytHomesProjectDetailViewProps> = ({
  project,
  onBack,
  onUpdateProject
}) => {
  const [selectedEditingStage, setSelectedEditingStage] = useState<any>(null);
  const [activeStageId, setActiveStageId] = useState<number>(project?.milestones?.[0]?.id || 1);
  const [alertMsg, setAlertMsg] = useState('');

  // Upload Form State
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('Structural Certificate');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Attached Documents Proof Records
  const [stageDocs, setStageDocs] = useState<Record<number, any[]>>({
    1: [
      {
        id: 101,
        title: 'Geotechnical_Soil_Bearing_Test_Cert.pdf',
        category: 'Soil Inspection',
        size: '4.2 MB',
        uploadedBy: 'Engr. Michael Vance',
        date: '10/08/2026',
        status: 'VERIFIED BY COREN'
      },
      {
        id: 102,
        title: 'Concrete_Cube_28Day_Compression_Audit.pdf',
        category: 'Lab Audit Proof',
        size: '2.8 MB',
        uploadedBy: 'Engr. Sarah Jenkins',
        date: '14/08/2026',
        status: 'VERIFIED BY COREN'
      }
    ]
  });

  const activeStage = project?.milestones?.find((m: any) => m.id === activeStageId) || project?.milestones?.[0];
  const currentDocs = stageDocs[activeStageId] || [];

  const handleStageSaved = (stageId: number, newProgress: number, notes: string, docFile?: File | null) => {
    const updatedMilestones = project.milestones.map((m: any) =>
      m.id === stageId ? { ...m, progress: newProgress } : m
    );

    const allProgress = updatedMilestones.map((m: any) => Number(m.progress || 0));
    const newOverallProgress = Math.round(allProgress.reduce((a: number, b: number) => a + b, 0) / allProgress.length);

    const updatedProject = {
      ...project,
      progress: newOverallProgress,
      milestones: updatedMilestones
    };

    if (docFile) {
      const newDocObj = {
        id: Date.now(),
        title: docFile.name,
        category: 'Quality Inspection Certificate',
        size: `${(docFile.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedBy: 'Engr. Michael Vance',
        date: new Date().toLocaleDateString(),
        status: 'VERIFIED BY COREN'
      };

      setStageDocs((prev) => ({
        ...prev,
        [stageId]: [newDocObj, ...(prev[stageId] || [])]
      }));
    }

    onUpdateProject(updatedProject);
    setSelectedEditingStage(null);
    setAlertMsg(`🎉 Construction Stage progress saved at ${newProgress}%! Engine database updated.`);
  };

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle && !selectedFile) return;

    setUploading(true);
    setTimeout(() => {
      const newDoc = {
        id: Date.now(),
        title: selectedFile ? selectedFile.name : `${docTitle}.pdf`,
        category: docCategory,
        size: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '3.5 MB',
        uploadedBy: 'Engr. Michael Vance',
        date: new Date().toLocaleDateString(),
        status: 'VERIFIED BY COREN'
      };

      setStageDocs((prev) => ({
        ...prev,
        [activeStageId]: [newDoc, ...(prev[activeStageId] || [])]
      }));

      setDocTitle('');
      setSelectedFile(null);
      setUploading(false);
      setAlertMsg(`🎉 Structural document proof "${newDoc.title}" uploaded to UPME Engine!`);
    }, 600);
  };

  const handleDownloadDoc = (doc: any) => {
    const content = `LYTHOMES CONSTRUCTION CO. STRUCTURAL AUDIT PROOF\n--------------------------------------------------\nTitle: ${doc.title}\nCategory: ${doc.category}\nUploaded By: ${doc.uploadedBy}\nVerification: COREN STRUCTURAL SIGN-OFF PASSED\n\nOfficial building infrastructure verification proof registered in UPME Engine.`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (selectedEditingStage) {
    return (
      <LytHomesStageEditView
        project={project}
        stage={selectedEditingStage}
        onBack={() => setSelectedEditingStage(null)}
        onSaveProgress={handleStageSaved}
      />
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: 1100, mx: 'auto', boxSizing: 'border-box', overflowX: 'hidden' }}>
      {/* Top Back Navigation */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{ mb: 3, textTransform: 'none', fontWeight: 800, color: '#334155', borderColor: '#cbd5e1', borderRadius: '10px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
      >
        Back to Construction Portfolio
      </Button>

      {/* Header Banner Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5, md: 4 },
          mb: 3,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)',
          color: '#ffffff',
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.3)',
          border: '1px solid #334155'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
          <Chip
            icon={<FoundationIcon sx={{ color: '#fff !important', fontSize: 14 }} />}
            label="LYTHOMES CIVIL PROJECT"
            size="small"
            sx={{ background: '#f59e0b', color: '#fff', fontWeight: 800, fontSize: '0.68rem', height: 24 }}
          />
          <Chip
            icon={<VerifiedIcon sx={{ color: '#fff !important', fontSize: 13 }} />}
            label={`HEALTH SCORE: ${project?.healthScore || 98.5}/100`}
            size="small"
            sx={{ background: '#10b981', color: '#fff', fontWeight: 800, fontSize: '0.68rem', height: 24 }}
          />
        </Box>

        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -0.5, mb: 1, fontSize: { xs: '1.4rem', sm: '2.2rem' } }}>
          {project?.projectName}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', color: '#94a3b8', fontSize: '0.85rem', mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOnIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
            <span>{project?.location || 'Lagos, Nigeria'}</span>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <BusinessIcon sx={{ fontSize: 18, color: '#06b6d4' }} />
            <span>Contractor: <strong>{project?.contractor || 'Julius Berger Plc'}</strong></span>
          </Box>
        </Box>

        <Divider sx={{ my: 2.5, borderColor: 'rgba(255, 255, 255, 0.15)' }} />

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, display: 'block', fontSize: '0.72rem' }}>
              ALLOCATED BOQ BUDGET (NAIRA ₦)
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#10b981', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              {project?.budget || '₦350,000,000'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.72rem' }}>
                OVERALL PHYSICAL COMPLETION
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#f59e0b' }}>
                {project?.progress || 0}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={project?.progress || 0}
              sx={{ height: 10, borderRadius: 5, background: 'rgba(255, 255, 255, 0.15)', '& .MuiLinearProgress-bar': { background: '#f59e0b' } }}
            />
          </Grid>
        </Grid>
      </Paper>

      {alertMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setAlertMsg('')}>
          {alertMsg}
        </Alert>
      )}

      {/* Main Content Layout: Stages & Proof Documents */}
      <Grid container spacing={3}>
        {/* Left Column: Milestone Construction Stages */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0', height: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <EngineeringIcon sx={{ color: '#f59e0b' }} />
              Construction Stages & Quality Milestones ({project?.milestones?.length || 0})
            </Typography>

            <Stack spacing={2}>
              {project?.milestones?.map((stg: any, index: number) => {
                const isActive = activeStageId === stg.id;
                return (
                  <Paper
                    key={stg.id}
                    onClick={() => setActiveStageId(stg.id)}
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: '14px',
                      border: '2px solid',
                      borderColor: isActive ? '#f59e0b' : '#e2e8f0',
                      background: isActive ? '#fffbeb' : '#f8fafc',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': { borderColor: '#f59e0b' }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem', lineHeight: 1.3 }}>
                          {stg.name}
                        </Typography>
                      </Box>

                      <Chip
                        label={`${stg.progress}% COMPLETE`}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.68rem',
                          height: 22,
                          background: stg.progress === 100 ? '#ecfdf5' : '#feefc3',
                          color: stg.progress === 100 ? '#047857' : '#b45309'
                        }}
                      />
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={stg.progress}
                      sx={{ height: 6, borderRadius: 3, mb: 2, background: '#e2e8f0', '& .MuiLinearProgress-bar': { background: '#f59e0b' } }}
                    />

                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEditingStage(stg);
                      }}
                      sx={{
                        width: '100%',
                        height: 36,
                        whiteSpace: 'nowrap',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: '#ffffff',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
                        '&:hover': { background: '#d97706' }
                      }}
                    >
                      Update Stage Progress
                    </Button>
                  </Paper>
                );
              })}
            </Stack>
          </Paper>
        </Grid>

        {/* Right Column: Stage Quality Proof Documents & Upload */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0', height: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptLongIcon sx={{ color: '#06b6d4' }} />
              COREN Quality Proof Documents ({currentDocs.length})
            </Typography>

            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, mb: 2, display: 'block' }}>
              Attached to: <strong>"{activeStage?.name || 'Selected Stage'}"</strong>
            </Typography>

            {/* List of Documents */}
            <Stack spacing={1.5} sx={{ mb: 3 }}>
              {currentDocs.length === 0 ? (
                <Paper elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: '12px', background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700 }}>
                    No audit proof documents attached to this stage yet.
                  </Typography>
                </Paper>
              ) : (
                currentDocs.map((doc) => (
                  <Paper key={doc.id} elevation={0} sx={{ p: 2, borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem', wordBreak: 'break-word' }}>
                          {doc.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>
                          Category: {doc.category} • Size: {doc.size}
                        </Typography>
                      </Box>
                      <Chip label={doc.status} size="small" sx={{ background: '#ecfdf5', color: '#047857', fontWeight: 800, fontSize: '0.62rem', height: 20 }} />
                    </Box>

                    {/* Stacked Full-Width Buttons on Mobile */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, width: '100%', pt: 0.5 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon sx={{ fontSize: 15 }} />}
                        onClick={() => handleDownloadDoc(doc)}
                        sx={{
                          flex: { xs: 'initial', sm: 1 },
                          width: { xs: '100%', sm: 'auto' },
                          height: 34,
                          whiteSpace: 'nowrap',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          textTransform: 'none',
                          color: '#6366f1',
                          borderColor: '#c7d2fe',
                          borderRadius: '8px'
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
                          height: 34,
                          whiteSpace: 'nowrap',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          textTransform: 'none',
                          background: '#10b981',
                          color: '#ffffff',
                          borderRadius: '8px'
                        }}
                      >
                        Download Proof
                      </Button>
                    </Box>
                  </Paper>
                ))
              )}
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Upload Document Form */}
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CloudUploadIcon sx={{ color: '#f59e0b' }} />
              Upload Inspection Certificate / CAD Blueprint
            </Typography>

            <Box component="form" onSubmit={handleUploadDoc} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <TextField
                fullWidth
                size="small"
                label="Document Title"
                placeholder="e.g. Concrete_Compressive_Strength_Audit.pdf"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
              />

              <TextField
                fullWidth
                select
                size="small"
                label="Document Category"
                value={docCategory}
                onChange={(e) => setDocCategory(e.target.value)}
              >
                <MenuItem value="Structural Certificate">Structural Certificate</MenuItem>
                <MenuItem value="Soil Inspection">Soil Inspection Audit</MenuItem>
                <MenuItem value="CAD Blueprint">CAD Architectural Blueprint</MenuItem>
                <MenuItem value="COREN Sign-off">COREN Official Sign-off</MenuItem>
              </TextField>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{ textTransform: 'none', fontWeight: 800, borderColor: '#cbd5e1', color: '#334155', borderRadius: '8px', height: 38, fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                >
                  Choose File...
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
                  <Chip label={selectedFile.name} onDelete={() => setSelectedFile(null)} size="small" color="warning" />
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={uploading}
                startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                  height: 42,
                  whiteSpace: 'nowrap',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#ffffff',
                  borderRadius: '10px',
                  mt: 1,
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
                  '&:hover': { background: '#d97706' }
                }}
              >
                {uploading ? 'Uploading Engine File...' : 'Upload Document'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
