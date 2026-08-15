import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Tabs,
  Tab,
  Stack,
  Alert as MuiAlert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoIcon from '@mui/icons-material/Info';
import AddTaskIcon from '@mui/icons-material/AddTask';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

interface AlertsAndActionsViewProps {
  projectId?: string;
}

export const AlertsAndActionsView: React.FC<AlertsAndActionsViewProps> = () => {
  const [activeSeverityTab, setActiveSeverityTab] = useState<string>('ALL');
  const [createActionOpen, setCreateActionOpen] = useState(false);
  const [newActionTitle, setNewActionTitle] = useState('');
  const [newActionOwner, setNewActionOwner] = useState('');

  // Initial Seed Engine Alerts
  const [alerts, setAlerts] = useState([
    {
      id: 101,
      severity: 'CRITICAL',
      alertType: 'DEPENDENCY_BLOCKED',
      message: 'Activity "Unpack & Mount Workstations" is BLOCKED due to 7-day delivery delay in predecessor task "Purchase Workstation PCs".',
      activityName: 'Unpack & Mount Workstations',
      isResolved: false,
      createdAt: '2026-08-15 11:30'
    },
    {
      id: 102,
      severity: 'HIGH',
      alertType: 'SCHEDULE_VARIANCE_WARNING',
      message: 'Milestone "2. Procurement Phase" schedule variance exceeded 3-day threshold policy.',
      activityName: 'Purchase Workstation PCs (40 Units)',
      isResolved: false,
      createdAt: '2026-08-15 10:15'
    },
    {
      id: 103,
      severity: 'WARNING',
      alertType: 'CUSTOMS_RISK_MONITORED',
      message: 'Supplier customs clearance risk severity score elevated to 5. Monitoring active.',
      activityName: 'Customs Clearance Log',
      isResolved: true,
      createdAt: '2026-08-14 16:45'
    }
  ]);

  // Initial Corrective Action Recommendations
  const [actions, setActions] = useState([
    {
      id: 201,
      title: 'Escalate Supplier Workstation Delivery via Expedited Air Freight',
      description: 'Contact hardware vendor account manager to re-route remaining 20 workstation units via priority air freight to eliminate downstream blockage.',
      owner: 'Procurement Lead (Jane Doe)',
      dueDate: '2026-08-18',
      status: 'IN_PROGRESS',
      alertId: 101
    },
    {
      id: 202,
      title: 'Pre-wire Computer Science Room Electrical Subnets',
      description: 'Advance electrical wiring and network drop installation in Room 302 while awaiting PC shipment arrival.',
      owner: 'Facilities Supervisor (Mark Smith)',
      dueDate: '2026-08-19',
      status: 'RECOMMENDED',
      alertId: 102
    }
  ]);

  const handleResolveAlert = (id: number) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isResolved: true } : a))
    );
  };

  const handleUpdateActionStatus = (id: number, nextStatus: string) => {
    setActions((prev) =>
      prev.map((ac) => (ac.id === id ? { ...ac, status: nextStatus } : ac))
    );
  };

  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionTitle) return;

    setActions((prev) => [
      {
        id: Date.now(),
        title: newActionTitle,
        description: 'Manual corrective recommendation added by project manager.',
        owner: newActionOwner || 'Unassigned',
        dueDate: '2026-08-20',
        status: 'ASSIGNED',
        alertId: undefined
      },
      ...prev
    ]);

    setNewActionTitle('');
    setNewActionOwner('');
    setCreateActionOpen(false);
  };

  const filteredAlerts = alerts.filter((a) => {
    if (activeSeverityTab === 'ALL') return true;
    return a.severity === activeSeverityTab;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
            ⚡ Detected Engine Alerts & Corrective Actions
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Real-time execution monitoring alerts paired with actionable recovery recommendations.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddTaskIcon />}
          onClick={() => setCreateActionOpen(true)}
          sx={{
            background: '#4f46e5',
            color: '#ffffff',
            borderRadius: '10px',
            px: 3,
            py: 1,
            fontWeight: 700,
            textTransform: 'none',
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
            '&:hover': { background: '#4338ca' }
          }}
        >
          Add Corrective Action Recommendation
        </Button>
      </Box>

      {/* Severity Filter Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeSeverityTab}
          onChange={(_, val) => setActiveSeverityTab(val)}
          sx={{ '& .MuiTab-root': { fontWeight: 700, textTransform: 'none' } }}
        >
          <Tab label={`All Alerts (${alerts.length})`} value="ALL" />
          <Tab label="Critical" value="CRITICAL" />
          <Tab label="High" value="HIGH" />
          <Tab label="Warning" value="WARNING" />
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column: Alerts Stream */}
        <Grid item xs={12} lg={6}>
          <Box className="enterprise-card" sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningAmberIcon sx={{ color: '#d97706' }} />
              Detected Engine Alerts ({filteredAlerts.length})
            </Typography>

            {filteredAlerts.map((alert) => {
              const severityColor =
                alert.severity === 'CRITICAL'
                  ? '#dc2626'
                  : alert.severity === 'HIGH'
                  ? '#d97706'
                  : '#0284c7';

              return (
                <Box
                  key={alert.id}
                  sx={{
                    p: 2.5,
                    mb: 2,
                    borderRadius: '12px',
                    background: alert.isResolved ? '#f8fafc' : '#fff',
                    border: alert.isResolved ? '1px solid #e2e8f0' : `1px solid ${severityColor}`,
                    opacity: alert.isResolved ? 0.7 : 1
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Chip
                      label={alert.severity}
                      size="small"
                      sx={{
                        fontWeight: 800,
                        fontSize: '0.65rem',
                        background: alert.severity === 'CRITICAL' ? '#fee2e2' : '#fef3c7',
                        color: severityColor
                      }}
                    />

                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      {alert.createdAt}
                    </Typography>
                  </Box>

                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                    {alert.message}
                  </Typography>

                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1.5 }}>
                    Target Task: <strong>{alert.activityName}</strong>
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {alert.isResolved ? (
                      <Chip icon={<CheckCircleIcon />} label="Resolved" color="success" size="small" variant="outlined" />
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleResolveAlert(alert.id)}
                        sx={{ fontSize: '0.75rem', textTransform: 'none', fontWeight: 700 }}
                      >
                        Mark Resolved
                      </Button>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Grid>

        {/* Right Column: Corrective Action Recommendations */}
        <Grid item xs={12} lg={6}>
          <Box className="enterprise-card" sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AddTaskIcon sx={{ color: '#4f46e5' }} />
              Corrective Action Recommendations ({actions.length})
            </Typography>

            {actions.map((act) => (
              <Box
                key={act.id}
                sx={{
                  p: 2.5,
                  mb: 2,
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Chip
                    label={`STATUS: ${act.status}`}
                    size="small"
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.65rem',
                      background: act.status === 'RESOLVED' ? '#d1fae5' : act.status === 'IN_PROGRESS' ? '#e0e7ff' : '#fef3c7',
                      color: act.status === 'RESOLVED' ? '#047857' : act.status === 'IN_PROGRESS' ? '#4338ca' : '#b45309'
                    }}
                  />

                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Due: {act.dueDate}
                  </Typography>
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                  {act.title}
                </Typography>

                <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem', mb: 1.5 }}>
                  {act.description}
                </Typography>

                <Divider sx={{ mb: 1.5 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AssignmentIndIcon sx={{ fontSize: 16, color: '#4f46e5' }} />
                    Owner: <strong>{act.owner}</strong>
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    {act.status !== 'IN_PROGRESS' && act.status !== 'RESOLVED' && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleUpdateActionStatus(act.id, 'IN_PROGRESS')}
                        sx={{ fontSize: '0.72rem', textTransform: 'none', fontWeight: 700 }}
                      >
                        Start Progress
                      </Button>
                    )}

                    {act.status !== 'RESOLVED' && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleUpdateActionStatus(act.id, 'RESOLVED')}
                        sx={{ fontSize: '0.72rem', textTransform: 'none', fontWeight: 700, background: '#059669' }}
                      >
                        Mark Resolved
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Manual Corrective Action Creator Modal */}
      <Dialog open={createActionOpen} onClose={() => setCreateActionOpen(false)} PaperProps={{ sx: { borderRadius: '16px', p: 1, minWidth: 480 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Add Corrective Action Recommendation</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleCreateAction} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Corrective Action Title"
              value={newActionTitle}
              onChange={(e) => setNewActionTitle(e.target.value)}
              placeholder="e.g. Expedite Customs Broker Clearance"
              required
            />
            <TextField
              fullWidth
              label="Assigned Owner / Role"
              value={newActionOwner}
              onChange={(e) => setNewActionOwner(e.target.value)}
              placeholder="e.g. Logistics Manager"
              required
            />
            <Button type="submit" variant="contained" sx={{ background: '#4f46e5', fontWeight: 700, py: 1.2 }}>
              Save Recommendation
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateActionOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
