import React, { useState } from 'react';
import { Milestone } from '../types';
import { Box, Typography, Chip, LinearProgress, Button, Stack, Alert } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import VerifiedIcon from '@mui/icons-material/Verified';

import { DeliverableEvidenceModal } from './DeliverableEvidenceModal';
import { DependencyManagerModal } from './DependencyManagerModal';

interface GanttTimelineProps {
  milestones: Milestone[];
}

export const GanttTimeline: React.FC<GanttTimelineProps> = ({ milestones }) => {
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [dependencyModalOpen, setDependencyModalOpen] = useState(false);
  const [selectedActivityName, setSelectedActivityName] = useState('');
  
  // Track uploaded evidence per task
  const [verifiedEvidence, setVerifiedEvidence] = useState<{ [key: string]: string }>({});
  const [alertMsg, setAlertMsg] = useState('');

  // Extract flat list of activities for dependency manager
  const allActivities = milestones.flatMap((m) => m.activities);

  const handleOpenEvidence = (activityName: string) => {
    setSelectedActivityName(activityName);
    setEvidenceModalOpen(true);
  };

  const handleEvidenceSuccess = (fakeUrl: string) => {
    setVerifiedEvidence((prev) => ({
      ...prev,
      [selectedActivityName]: fakeUrl
    }));
    setAlertMsg(`🎉 Evidence Verified & Saved: Audit asset attached to "${selectedActivityName}"!`);
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
                      sx={{
                        fontWeight: 700,
                        background: act.status === 'COMPLETED' ? '#d1fae5' : act.status === 'BLOCKED' ? '#fee2e2' : '#e0e7ff',
                        color: act.status === 'COMPLETED' ? '#047857' : act.status === 'BLOCKED' ? '#b91c1c' : '#4338ca'
                      }}
                    />

                    <Button
                      variant={hasEvidence ? 'outlined' : 'text'}
                      size="small"
                      color={hasEvidence ? 'success' : 'primary'}
                      startIcon={<CloudUploadIcon sx={{ fontSize: 14 }} />}
                      onClick={() => handleOpenEvidence(act.name)}
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

      {/* Deliverable Evidence Upload Modal */}
      <DeliverableEvidenceModal
        open={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        activityName={selectedActivityName}
        onUploadSuccess={handleEvidenceSuccess}
      />

      {/* DAG Dependency Manager Modal */}
      <DependencyManagerModal
        open={dependencyModalOpen}
        onClose={() => setDependencyModalOpen(false)}
        activities={allActivities}
        onAddDependency={(pred, succ, type, lag) => console.log('Added DAG dependency:', pred, succ, type, lag)}
      />
    </Box>
  );
};
