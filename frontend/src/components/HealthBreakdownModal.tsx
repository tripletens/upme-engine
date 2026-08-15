import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Grid,
  Slider,
  Chip,
  Divider,
  Paper
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import TuneIcon from '@mui/icons-material/Tune';

interface HealthBreakdownModalProps {
  open: boolean;
  onClose: () => void;
  overallScore: number;
  healthStatus: string;
}

export const HealthBreakdownModal: React.FC<HealthBreakdownModalProps> = ({
  open,
  onClose,
  overallScore,
  healthStatus
}) => {
  // Configurable Metric Weights
  const [scheduleWeight, setScheduleWeight] = useState(30);
  const [progressWeight, setProgressWeight] = useState(25);
  const [issueWeight, setIssueWeight] = useState(20);
  const [riskWeight, setRiskWeight] = useState(15);
  const [deliverableWeight, setDeliverableWeight] = useState(10);

  // Sub-scores (Base factor performance)
  const scheduleScore = 100; // 0 Days Variance
  const progressScore = 100; // 68% actual vs 65% baseline
  const issueScore = 100;    // 0 Open Critical Issues
  const riskScore = 63;      // 2 Mitigated Minor Risks
  const deliverableScore = 100; // All Evidences Approved

  // Calculate total weight sum
  const totalWeight = scheduleWeight + progressWeight + issueWeight + riskWeight + deliverableWeight;

  // Calculate live weighted score
  const liveScore = Math.round(
    (
      (scheduleScore * scheduleWeight) +
      (progressScore * progressWeight) +
      (issueScore * issueWeight) +
      (riskScore * riskWeight) +
      (deliverableScore * deliverableWeight)
    ) / (totalWeight || 1) * 10
  ) / 10;

  const liveStatus = liveScore >= 90 ? 'ON_TRACK' : liveScore >= 75 ? 'WARNING' : liveScore >= 50 ? 'AT_RISK' : 'CRITICAL';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: '#ffffff',
          color: '#0f172a',
          minWidth: { xs: '90%', md: 680 },
          borderRadius: '16px',
          p: 2
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 38, height: 38, borderRadius: '10px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CalculateIcon sx={{ color: '#4f46e5' }} />
        </Box>
        UPME Health Score Calculator & Weighting Engine
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
          Health score is calculated mathematically using 5 weighted factor sub-scores. Adjust the sliders below to customize metric weightings for your organization.
        </Typography>

        {/* Live Score Summary Banner */}
        <Paper elevation={0} sx={{ p: 3, mb: 4, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                CALCULATED HEALTH SCORE
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: liveStatus === 'ON_TRACK' ? '#059669' : '#d97706' }}>
                {liveScore} <span style={{ fontSize: '1.2rem', color: '#64748b', fontWeight: 500 }}>/ 100</span>
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} sx={{ textAlign: { sm: 'right' } }}>
              <Chip
                label={`STATUS: ${liveStatus}`}
                sx={{
                  fontWeight: 800,
                  px: 1.5,
                  py: 2,
                  background: liveStatus === 'ON_TRACK' ? '#ecfdf5' : '#fff7ed',
                  color: liveStatus === 'ON_TRACK' ? '#047857' : '#c2410c',
                  border: liveStatus === 'ON_TRACK' ? '1px solid #a7f3d0' : '1px solid #ffedd5'
                }}
              />
              <Typography variant="caption" sx={{ display: 'block', color: '#64748b', mt: 1 }}>
                Weight Total: <strong>{totalWeight}%</strong> {totalWeight !== 100 && '(Normalizing to 100%)'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TuneIcon sx={{ fontSize: 18, color: '#4f46e5' }} />
          Customize Metric Factor Weightings
        </Typography>

        <Grid container spacing={3}>
          {/* Factor 1: Schedule Variance */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: '10px', background: '#fff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  1. Schedule Variance ({scheduleWeight}%)
                </Typography>
                <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700 }}>
                  Score: 100/100
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1 }}>
                Evaluates schedule lag vs baseline (0 Days Variance)
              </Typography>
              <Slider
                value={scheduleWeight}
                onChange={(_, val) => setScheduleWeight(val as number)}
                min={0}
                max={50}
                sx={{ color: '#4f46e5' }}
              />
            </Box>
          </Grid>

          {/* Factor 2: Progress Performance */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: '10px', background: '#fff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  2. Progress Performance ({progressWeight}%)
                </Typography>
                <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700 }}>
                  Score: 100/100
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1 }}>
                Actual completion (68%) vs planned baseline (65%)
              </Typography>
              <Slider
                value={progressWeight}
                onChange={(_, val) => setProgressWeight(val as number)}
                min={0}
                max={50}
                sx={{ color: '#4f46e5' }}
              />
            </Box>
          </Grid>

          {/* Factor 3: Issue Severity */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: '10px', background: '#fff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  3. Issue Severity ({issueWeight}%)
                </Typography>
                <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700 }}>
                  Score: 100/100
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1 }}>
                Deducts for open critical issues (0 Open Issues)
              </Typography>
              <Slider
                value={issueWeight}
                onChange={(_, val) => setIssueWeight(val as number)}
                min={0}
                max={50}
                sx={{ color: '#4f46e5' }}
              />
            </Box>
          </Grid>

          {/* Factor 4: Risk Register */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: '10px', background: '#fff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  4. Risk Register ({riskWeight}%)
                </Typography>
                <Typography variant="caption" sx={{ color: '#d97706', fontWeight: 700 }}>
                  Score: 63/100
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1 }}>
                Evaluates probability & impact of identified risks
              </Typography>
              <Slider
                value={riskWeight}
                onChange={(_, val) => setRiskWeight(val as number)}
                min={0}
                max={50}
                sx={{ color: '#4f46e5' }}
              />
            </Box>
          </Grid>

          {/* Factor 5: Deliverable Evidence */}
          <Grid item xs={12} md={12}>
            <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: '10px', background: '#fff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  5. Deliverable Evidence Sign-off ({deliverableWeight}%)
                </Typography>
                <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700 }}>
                  Score: 100/100
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1 }}>
                Ratio of approved evidence uploads vs required deliverables
              </Typography>
              <Slider
                value={deliverableWeight}
                onChange={(_, val) => setDeliverableWeight(val as number)}
                min={0}
                max={50}
                sx={{ color: '#4f46e5' }}
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
        <Button
          onClick={() => {
            setScheduleWeight(30);
            setProgressWeight(25);
            setIssueWeight(20);
            setRiskWeight(15);
            setDeliverableWeight(10);
          }}
          sx={{ color: '#64748b' }}
        >
          Reset Default Weights
        </Button>

        <Button
          variant="contained"
          onClick={onClose}
          sx={{ background: '#4f46e5', fontWeight: 700, px: 3, borderRadius: '10px' }}
        >
          Save Tenant Weights
        </Button>
      </DialogActions>
    </Dialog>
  );
};
