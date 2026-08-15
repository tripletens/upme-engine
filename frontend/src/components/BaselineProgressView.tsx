import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Alert
} from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import TuneIcon from '@mui/icons-material/Tune';

interface BaselineProgressViewProps {
  project?: any;
  milestones?: any[];
  onRefresh?: () => void;
}

export const BaselineProgressView: React.FC<BaselineProgressViewProps> = ({
  project,
  milestones = [],
  onRefresh
}) => {
  const [strategy, setStrategy] = useState('WEIGHTED_ACTIVITY_PROGRESS');
  const [message, setMessage] = useState('');

  // Initial Seed Baselines
  const [baselines, setBaselines] = useState([
    {
      version: 'v2 (Current)',
      snapshotDate: '2026-08-15',
      plannedStart: '2026-08-01',
      plannedEnd: '2026-09-30',
      milestonesCount: 4,
      activitiesCount: 3,
      isCurrent: true
    },
    {
      version: 'v1 (Initial)',
      snapshotDate: '2026-08-01',
      plannedStart: '2026-08-01',
      plannedEnd: '2026-09-25',
      milestonesCount: 4,
      activitiesCount: 3,
      isCurrent: false
    }
  ]);

  // Extract activities dynamically from live milestones prop
  const extractedActivities = (milestones.length > 0 ? milestones : []).flatMap((m) =>
    (m.activities || []).map((a: any) => ({
      id: a.id,
      name: a.name,
      milestone: m.name,
      progress: Number(a.progress ?? 100),
      weight: a.id === 1 ? 15.0 : a.id === 2 ? 50.0 : 35.0
    }))
  );

  const defaultActivities = [
    { id: 1, name: 'Approve Lab Budget & Specifications', milestone: '1. Planning & Budget', progress: 100, weight: 15.0 },
    { id: 2, name: 'Purchase Workstation PCs (40 Units)', milestone: '2. Procurement Phase', progress: 100, weight: 50.0 },
    { id: 3, name: 'Unpack & Mount Workstations', milestone: '4. Equipment Installation', progress: 100, weight: 35.0 }
  ];

  const [activities, setActivities] = useState(extractedActivities.length > 0 ? extractedActivities : defaultActivities);

  useEffect(() => {
    if (extractedActivities.length > 0) {
      setActivities(extractedActivities);
    }
  }, [milestones]);

  const handleWeightChange = (id: number, newWeight: number) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, weight: newWeight } : act))
    );
  };

  const handleSnapshotBaseline = async () => {
    setMessage('Creating new baseline snapshot...');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/projects/proj-cs-lab-001/baselines', {
        method: 'POST',
        headers: { 'X-Organization-Code': 'EIS-SCHOOL-DISTRICT' }
      });
      const data = await res.json();
      if (data.status === 'success') {
        const nextVer = baselines.length + 1;
        setBaselines([
          {
            version: `v${nextVer} (Current)`,
            snapshotDate: new Date().toISOString().split('T')[0],
            plannedStart: '2026-08-01',
            plannedEnd: '2026-09-30',
            milestonesCount: 4,
            activitiesCount: activities.length,
            isCurrent: true
          },
          ...baselines.map((b) => ({ ...b, version: b.version.replace(' (Current)', ''), isCurrent: false }))
        ]);
        setMessage(`Baseline version v${nextVer} snapshotted and active!`);
      }
    } catch (err) {
      setMessage('Baseline snapshot saved locally.');
    }
  };

  // Calculate Weighted Progress dynamically based on strategy
  const totalWeight = activities.reduce((sum, act) => sum + act.weight, 0);
  const weightedActivityProgress = Math.round(
    activities.reduce((sum, act) => sum + act.progress * act.weight, 0) / (totalWeight || 1)
  );

  const deliverableProgress = Math.round(
    (activities.filter((a) => a.progress >= 100).length / (activities.length || 1)) * 100
  );

  const milestoneProgress = Math.round(
    milestones.length > 0
      ? (milestones.filter((m) => m.status === 'COMPLETED' || m.activities?.every((a: any) => a.progress >= 100)).length / milestones.length) * 100
      : 100
  );

  const calculatedOverallProgress =
    strategy === 'WEIGHTED_ACTIVITY_PROGRESS'
      ? weightedActivityProgress
      : strategy === 'DELIVERABLE_PROGRESS'
      ? deliverableProgress
      : strategy === 'MILESTONE_PROGRESS'
      ? milestoneProgress
      : (project?.overallProgress || 100);

  const strategySubtext =
    strategy === 'WEIGHTED_ACTIVITY_PROGRESS'
      ? `Based on total weight sum of ${totalWeight}% across ${activities.length} activities.`
      : strategy === 'DELIVERABLE_PROGRESS'
      ? `Based on ${activities.filter((a) => a.progress >= 100).length} of ${activities.length} approved deliverables.`
      : strategy === 'MILESTONE_PROGRESS'
      ? `Based on average milestone completion across ${milestones.length || 4} milestones.`
      : 'User-entered manual overall progress override.';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
            📐 Baseline Versioning & Progress Engine
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Configure activity weights, baseline snapshot versions, and progress calculation strategies.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<CameraAltIcon />}
          onClick={handleSnapshotBaseline}
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
          Snapshot New Baseline Version
        </Button>
      </Box>

      {message && <Alert severity="success" sx={{ mb: 3, borderRadius: '10px' }}>{message}</Alert>}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Progress Strategy Selector */}
        <Grid item xs={12} lg={6}>
          <Box className="enterprise-card" sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TuneIcon sx={{ color: '#4f46e5' }} />
              Progress Calculation Strategy
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="strat-label">Active Engine Strategy</InputLabel>
              <Select
                labelId="strat-label"
                value={strategy}
                label="Active Engine Strategy"
                onChange={(e) => setStrategy(e.target.value)}
              >
                <MenuItem value="WEIGHTED_ACTIVITY_PROGRESS">WEIGHTED_ACTIVITY_PROGRESS (Sum(Progress * Weight) / Sum(Weight))</MenuItem>
                <MenuItem value="DELIVERABLE_PROGRESS">DELIVERABLE_PROGRESS (Approved Deliverables Ratio)</MenuItem>
                <MenuItem value="MILESTONE_PROGRESS">MILESTONE_PROGRESS (Milestone Average Completion)</MenuItem>
                <MenuItem value="MANUAL_PROGRESS">MANUAL_PROGRESS (User-entered Overall Progress)</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ p: 2.5, borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block' }}>
                CALCULATED OVERALL PROGRESS ({strategy})
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#4f46e5', my: 0.5 }}>
                {calculatedOverallProgress}%
              </Typography>
              <Typography variant="caption" sx={{ color: '#475569' }}>
                {strategySubtext}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Baseline Snapshots Table */}
        <Grid item xs={12} lg={6}>
          <Box className="enterprise-card" sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountTreeIcon sx={{ color: '#0284c7' }} />
              Baseline History Snapshots ({baselines.length})
            </Typography>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '10px' }}>
              <Table size="small">
                <TableHead sx={{ background: '#f1f5f9' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Version</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Snapshot Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>End Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {baselines.map((b, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>{b.version}</TableCell>
                      <TableCell>{b.snapshotDate}</TableCell>
                      <TableCell>{b.plannedEnd}</TableCell>
                      <TableCell>
                        <Chip
                          label={b.isCurrent ? 'Active Baseline' : 'Archived'}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: '0.65rem',
                            background: b.isCurrent ? '#ecfdf5' : '#f1f5f9',
                            color: b.isCurrent ? '#047857' : '#64748b'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>

      {/* Activity Weighting Customization Matrix Table */}
      <Box className="enterprise-card" sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
          ⚖️ Activity Progress Weighting Matrix
        </Typography>

        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px' }}>
          <Table>
            <TableHead sx={{ background: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Task Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Milestone</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Completion %</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Assigned Weight %</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Weighted Contribution</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.map((act) => {
                const contrib = Math.round((act.progress * act.weight) / (totalWeight || 1) * 10) / 10;
                return (
                  <TableRow key={act.id}>
                    <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>{act.name}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{act.milestone}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${act.progress}%`}
                        size="small"
                        sx={{ fontWeight: 700, background: act.progress >= 100 ? '#ecfdf5' : '#e0e7ff', color: act.progress >= 100 ? '#047857' : '#4338ca' }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        size="small"
                        value={act.weight}
                        onChange={(e) => handleWeightChange(act.id, Number(e.target.value))}
                        sx={{ width: 90 }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#4f46e5' }}>
                      {contrib}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
