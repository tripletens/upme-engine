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
    <Box className="glass-card" sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 700, mb: 3 }}>
        📊 Project Timeline & Activity Dependencies (Gantt Chart)
      </Typography>

      {milestones.map((m) => (
        <Box key={m.id} sx={{ mb: 4 }}>
          {/* Milestone Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="subtitle1" sx={{ color: '#cbd5e1', fontWeight: 600 }}>
              {m.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
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
                p: 2,
                mb: 1.5,
                borderRadius: 2,
                background: act.status === 'BLOCKED' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(15, 23, 42, 0.6)',
                border: act.status === 'BLOCKED' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {act.status === 'COMPLETED' && <CheckCircleIcon sx={{ color: '#10b981', fontSize: 18 }} />}
                  {act.status === 'BLOCKED' && <LockIcon sx={{ color: '#ef4444', fontSize: 18 }} />}
                  {act.status === 'IN_PROGRESS' && <WarningAmberIcon sx={{ color: '#f59e0b', fontSize: 18 }} />}
                  
                  <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                    {act.name}
                  </Typography>
                  
                  {act.isCriticalPath && (
                    <Chip label="Critical Path" size="small" sx={{ height: 20, fontSize: '0.65rem', background: '#ef4444', color: '#fff' }} />
                  )}
                </Box>

                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Assigned: <strong style={{ color: '#6366f1' }}>{act.assignedTo || 'Unassigned'}</strong>
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
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: act.status === 'BLOCKED' ? '#ef4444' : act.progress === 100 ? '#10b981' : '#6366f1'
                      }
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#f8fafc', fontWeight: 600, minWidth: 35 }}>
                  {act.progress}%
                </Typography>
              </Box>

              {/* Deliverable & Evidence Tag */}
              {act.deliverableTitle && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    Deliverable: <em>{act.deliverableTitle}</em>
                  </Typography>
                  <Chip
                    label={`Evidence: ${act.evidenceStatus}`}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      background: act.evidenceStatus === 'APPROVED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: act.evidenceStatus === 'APPROVED' ? '#34d399' : '#fbbf24'
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
