import React from 'react';
import { Milestone } from '../types';
import { Box, Typography, Chip, LinearProgress } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface GanttTimelineProps {
  milestones: Milestone[];
}

export const GanttTimeline: React.FC<GanttTimelineProps> = ({ milestones }) => {
  return (
    <Box className="enterprise-card" sx={{ p: 4, mb: 4 }}>
      <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 800, mb: 3 }}>
        📊 Project Timeline & Activity Dependencies (Gantt Chart)
      </Typography>

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
          {m.activities.map((act) => (
            <Box
              key={act.id}
              sx={{
                p: 2.5,
                mb: 1.5,
                borderRadius: '12px',
                background: act.status === 'BLOCKED' ? '#fef2f2' : '#f8fafc',
                border: act.status === 'BLOCKED' ? '1px solid #fecaca' : '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {act.status === 'COMPLETED' && <CheckCircleIcon sx={{ color: '#059669', fontSize: 18 }} />}
                  {act.status === 'BLOCKED' && <LockIcon sx={{ color: '#dc2626', fontSize: 18 }} />}
                  {act.status === 'IN_PROGRESS' && <WarningAmberIcon sx={{ color: '#d97706', fontSize: 18 }} />}
                  
                  <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 700 }}>
                    {act.name}
                  </Typography>
                  
                  {act.isCriticalPath && (
                    <Chip label="Critical Path" size="small" sx={{ height: 20, fontSize: '0.65rem', background: '#dc2626', color: '#fff', fontWeight: 700 }} />
                  )}
                </Box>

                <Typography variant="caption" sx={{ color: '#475569' }}>
                  Assigned: <strong style={{ color: '#4f46e5' }}>{act.assignedTo || 'Unassigned'}</strong>
                </Typography>
              </Box>

              {/* Progress Bar & Status */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={act.progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#e2e8f0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: act.status === 'BLOCKED' ? '#dc2626' : act.progress === 100 ? '#059669' : '#4f46e5'
                      }
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#0f172a', fontWeight: 700, minWidth: 35 }}>
                  {act.progress}%
                </Typography>
              </Box>

              {/* Deliverable & Evidence Tag */}
              {act.deliverableTitle && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Deliverable: <em>{act.deliverableTitle}</em>
                  </Typography>
                  <Chip
                    label={`Evidence: ${act.evidenceStatus}`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      background: act.evidenceStatus === 'APPROVED' ? '#ecfdf5' : '#fff7ed',
                      color: act.evidenceStatus === 'APPROVED' ? '#047857' : '#c2410c',
                      border: act.evidenceStatus === 'APPROVED' ? '1px solid #a7f3d0' : '1px solid #ffedd5'
                    }}
                  />
                </Box>
              )}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};
