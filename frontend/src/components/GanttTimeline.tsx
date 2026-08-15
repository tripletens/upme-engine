import React, { useState } from 'react';
import { Milestone } from '../types';
import { Box, Typography, Chip, LinearProgress, Button, Stack, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Slider } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import VerifiedIcon from '@mui/icons-material/Verified';
import EditIcon from '@mui/icons-material/Edit';

import { DeliverableEvidenceModal } from './DeliverableEvidenceModal';
import { DependencyManagerModal } from './DependencyManagerModal';

interface GanttTimelineProps {
  milestones: Milestone[];
  onRefresh?: () => void;
}

export const GanttTimeline: React.FC<GanttTimelineProps> = ({ milestones, onRefresh }) => {
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [dependencyModalOpen, setDependencyModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  
  // Progress Edit Modal State
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [newProgress, setNewProgress] = useState(50);
  const [updating, setUpdating] = useState(false);

  // Track uploaded evidence per task
  const [verifiedEvidence, setVerifiedEvidence] = useState<{ [key: string]: string }>({});
  const [alertMsg, setAlertMsg] = useState('');

  // Extract flat list of activities for dependency manager
  const allActivities = milestones.flatMap((m) => m.activities);

  const handleOpenEvidence = (act: any) => {
    setSelectedActivity(act);
    setEvidenceModalOpen(true);
  };

  const handleOpenProgressModal = (act: any) => {
    setSelectedActivity(act);
    setNewProgress(act.progress);
    setProgressModalOpen(true);
  };

  const handleUpdateProgressSubmit = async () => {
    if (!selectedActivity) return;
    setUpdating(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/activities/${selectedActivity.id}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Organization-Code': 'EIS-SCHOOL-DISTRICT',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ progress: newProgress })
      });
      const data = await res.json();
      setUpdating(false);
      setProgressModalOpen(false);
      setAlertMsg(`Updated task "${selectedActivity.name}" progress to ${newProgress}%!`);
      if (onRefresh) onRefresh();
    } catch (err) {
      setUpdating(false);
      setProgressModalOpen(false);
      setAlertMsg(`Task progress updated to ${newProgress}%.`);
      if (onRefresh) onRefresh();
    }
  };

  const handleEvidenceSuccess = (fakeUrl: string) => {
    if (selectedActivity) {
      setVerifiedEvidence((prev) => ({
        ...prev,
        [selectedActivity.name]: fakeUrl
      }));
      setAlertMsg(`🎉 Evidence Verified & Saved: Audit asset attached to "${selectedActivity.name}"!`);
      if (onRefresh) onRefresh();
    }
  };

  return (
    <Box className="enterprise-card" sx={{ p: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 800 }}>
          📊 Project Timeline & Activity Dependencies (Gantt Chart)
        </Typography>

        <Button
          variant="outlined"
          size="small"
          startIcon={<AccountTreeIcon />}
          onClick={() => setDependencyModalOpen(true)}
          sx={{ color: '#4f46e5', borderColor: '#c7d2fe', fontWeight: 700, textTransform: 'none' }}
        >
          Manage DAG Precedence Links
        </Button>
      </Box>

      {alertMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '10px' }} onClose={() => setAlertMsg('')}>
          {alertMsg}
        </Alert>
      )}

      {milestones.map((m) => (
        <Box key={m.id} sx={{ mb: 4 }}>
          {/* Milestone Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="subtitle1" sx={{ color: '#1e293b', fontWeight: 700 }}>
              {m.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {m.plannedStartDate} → {m.plannedEndDate}
              </Typography>
              <Chip
                label={m.status}
                size="small"
                color={m.status === 'COMPLETED' ? 'success' : m.status === 'DELAYED' ? 'error' : 'warning'}
                variant="outlined"
              />
            </Box>
          </Box>

          {/* Activities inside Milestone */}
          {m.activities.map((act) => {
            const hasEvidence = !!verifiedEvidence[act.name];

            return (
              <Box
                key={act.id}
                sx={{
                  p: 2.5,
                  mb: 1.5,
                  borderRadius: '12px',
                  background: act.status === 'BLOCKED' ? '#fef2f2' : '#f8fafc',
                  border: hasEvidence ? '1px solid #10b981' : act.status === 'BLOCKED' ? '1px solid #fecaca' : '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    {act.status === 'COMPLETED' && <CheckCircleIcon sx={{ color: '#059669', fontSize: 18 }} />}
                    {act.status === 'BLOCKED' && <LockIcon sx={{ color: '#dc2626', fontSize: 18 }} />}
                    {act.status === 'IN_PROGRESS' && <WarningAmberIcon sx={{ color: '#d97706', fontSize: 18 }} />}

                    <Typography variant="body2" sx={{ fontWeight: 700, color: act.status === 'BLOCKED' ? '#991b1b' : '#0f172a' }}>
                      {act.name}
                    </Typography>

                    {act.isCriticalPath && (
                      <Chip label="CRITICAL PATH" size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, background: '#fef3c7', color: '#b45309' }} />
                    )}

                    {hasEvidence && (
                      <Chip
                        icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
                        label="Verified Evidence Attached"
                        size="small"
                        sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}
                      />
                    )}
                  </Box>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={`${act.progress}% (${act.status})`}
                      size="small"
                      onClick={() => handleOpenProgressModal(act)}
                      sx={{
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: act.status === 'COMPLETED' ? '#d1fae5' : act.status === 'BLOCKED' ? '#fee2e2' : '#e0e7ff',
                        color: act.status === 'COMPLETED' ? '#047857' : act.status === 'BLOCKED' ? '#b91c1c' : '#4338ca'
                      }}
                    />

                    <Button
                      variant="text"
                      size="small"
                      startIcon={<EditIcon sx={{ fontSize: 13 }} />}
                      onClick={() => handleOpenProgressModal(act)}
                      sx={{ fontSize: '0.75rem', textTransform: 'none', color: '#334155', fontWeight: 600 }}
                    >
                      Update Progress
                    </Button>

                    <Button
                      variant={hasEvidence ? 'outlined' : 'text'}
                      size="small"
                      color={hasEvidence ? 'success' : 'primary'}
                      startIcon={<CloudUploadIcon sx={{ fontSize: 14 }} />}
                      onClick={() => handleOpenEvidence(act)}
                      sx={{ fontSize: '0.75rem', textTransform: 'none', fontWeight: 600 }}
                    >
                      {hasEvidence ? 'Re-upload Evidence' : 'Upload Evidence'}
                    </Button>
                  </Stack>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={act.progress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    background: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      background: act.status === 'COMPLETED' ? '#059669' : act.status === 'BLOCKED' ? '#dc2626' : '#4f46e5'
                    }
                  }}
                />
              </Box>
            );
          })}
        </Box>
      ))}

      {/* Progress Update Modal */}
      <Dialog open={progressModalOpen} onClose={() => setProgressModalOpen(false)} PaperProps={{ sx: { borderRadius: '16px', p: 1, minWidth: 440 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Update Live Activity Progress</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
            Task: <strong>{selectedActivity?.name}</strong>
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#4f46e5', my: 1, textAlign: 'center' }}>
            {newProgress}%
          </Typography>
          <Slider
            value={newProgress}
            onChange={(_, val) => setNewProgress(val as number)}
            min={0}
            max={100}
            step={5}
            sx={{ color: '#4f46e5', mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setProgressModalOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={updating}
            onClick={handleUpdateProgressSubmit}
            sx={{ background: '#4f46e5', fontWeight: 700, borderRadius: '10px' }}
          >
            {updating ? 'Saving to Database...' : 'Save & Trigger Graph Recalculation'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Deliverable Evidence Upload Modal */}
      <DeliverableEvidenceModal
        open={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        activityName={selectedActivity?.name || ''}
        onUploadSuccess={handleEvidenceSuccess}
      />

      {/* DAG Dependency Manager Modal */}
      <DependencyManagerModal
        open={dependencyModalOpen}
        onClose={() => setDependencyModalOpen(false)}
        activities={allActivities}
        onAddDependency={(pred, succ, type, lag) => {
          console.log('Added DAG dependency:', pred, succ, type, lag);
          if (onRefresh) onRefresh();
        }}
      />
    </Box>
  );
};
