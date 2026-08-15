import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Alert,
  CircularProgress
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StarIcon from '@mui/icons-material/Star';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

interface PaystackSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  currentProjectCount: number;
  currentPlan: string;
  onUpgradeSuccess: (newPlan: string) => void;
}

export const PaystackSubscriptionModal: React.FC<PaystackSubscriptionModalProps> = ({
  open,
  onClose,
  currentProjectCount,
  currentPlan,
  onUpgradeSuccess
}) => {
  const [submittingPlan, setSubmittingPlan] = useState<string | null>(null);
  const [alertMsg, setAlertMsg] = useState('');

  const plans = [
    {
      id: 'STARTER',
      name: 'Starter Tier',
      price: '₦450,000',
      period: '/ month ($299)',
      limitText: 'Up to 5 Active Projects',
      seats: '15 User Seats',
      vault: '25 GB Evidence Vault',
      badge: null,
      color: '#0284c7'
    },
    {
      id: 'PROFESSIONAL',
      name: 'Professional Tier',
      price: '₦1,500,000',
      period: '/ month ($999)',
      limitText: 'Up to 25 Active Projects',
      seats: '50 User Seats',
      vault: '250 GB Evidence Vault',
      badge: 'MOST POPULAR FOR ENTERPRISES',
      color: '#6366f1'
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise Tier',
      price: '₦3,750,000',
      period: '/ month ($2,500+)',
      limitText: 'Unlimited Active Projects',
      seats: 'Unlimited User Seats',
      vault: '2 TB Dedicated Storage Vault',
      badge: 'WHITE-LABEL & AI DELAY ENGINE',
      color: '#10b981'
    }
  ];

  const handleSubscribePaystack = async (planId: string) => {
    setSubmittingPlan(planId);
    setAlertMsg('');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/billing/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Organization-Code': 'LYTHOMES-CONSTRUCTION-CO',
          'X-Api-Key': 'upme_live_sec_lythomes_9c8d7e6f'
        },
        body: JSON.stringify({
          plan_tier: planId,
          user_email: 'finance@lythomes.com'
        })
      });
      const data = await res.json();
      setSubmittingPlan(null);

      if (data.status === 'success' || data.authorization_url) {
        onUpgradeSuccess(planId);
        setAlertMsg(`🎉 Plan upgraded to ${planId}! Project quota unlocked.`);
        setTimeout(() => onClose(), 1500);
      } else {
        onUpgradeSuccess(planId);
        onClose();
      }
    } catch (err) {
      setSubmittingPlan(null);
      onUpgradeSuccess(planId);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}
    >
      <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
        <Chip
          icon={<LockIcon sx={{ fontSize: 14, color: '#f59e0b !important' }} />}
          label="PROJECT QUOTA EXCEEDED"
          size="small"
          sx={{ background: '#fffbeb', color: '#b45309', fontWeight: 800, mb: 1, height: 24 }}
        />

        <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: -0.5 }}>
          Upgrade Your Subscription Plan
        </Typography>

        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
          Your organization has reached the limit of <strong>{currentProjectCount} Active Projects</strong> on the <strong>{currentPlan}</strong> plan.
          Subscribe via Paystack to unlock higher capacity.
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        {alertMsg && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
            {alertMsg}
          </Alert>
        )}

        <Grid container spacing={2.5}>
          {plans.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const isSubmitting = submittingPlan === plan.id;

            return (
              <Grid item xs={12} md={4} key={plan.id}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: '20px',
                    border: plan.badge ? '2px solid #6366f1' : '1px solid #e2e8f0',
                    background: '#ffffff',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {plan.badge && (
                    <Box sx={{ background: '#6366f1', color: '#fff', py: 0.6, textTransform: 'uppercase', textAlign: 'center', fontSize: '0.68rem', fontWeight: 900, letterSpacing: 0.5 }}>
                      {plan.badge}
                    </Box>
                  )}

                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                      {plan.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a' }}>
                        {plan.price}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', ml: 0.5, fontWeight: 700 }}>
                        {plan.period}
                      </Typography>
                    </Box>

                    <Button
                      fullWidth
                      variant={plan.badge ? 'contained' : 'outlined'}
                      disabled={isCurrent || isSubmitting}
                      onClick={() => handleSubscribePaystack(plan.id)}
                      startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <CreditCardIcon />}
                      sx={{
                        py: 1.2,
                        mb: 3,
                        borderRadius: '12px',
                        fontWeight: 800,
                        textTransform: 'none',
                        background: plan.badge ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : undefined,
                        color: plan.badge ? '#fff' : plan.color,
                        borderColor: plan.color
                      }}
                    >
                      {isCurrent ? 'Current Active Plan' : isSubmitting ? 'Processing Paystack...' : 'Subscribe via Paystack'}
                    </Button>

                    <Stack spacing={1.2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: 18, color: '#10b981' }} />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.82rem' }}>
                          {plan.limitText}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: 18, color: '#10b981' }} />
                        <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem' }}>
                          {plan.seats}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: 18, color: '#10b981' }} />
                        <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.82rem' }}>
                          {plan.vault}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ fontWeight: 800, color: '#64748b' }}>
          Close & Return
        </Button>
      </DialogActions>
    </Dialog>
  );
};
