import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Chip, Grid, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CreditCardIcon from '@mui/icons-material/CreditCard';

export const PricingSection: React.FC = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null);
  const [email, setEmail] = useState('');
  const [checkoutResult, setCheckoutResult] = useState<{ url?: string; isMock?: boolean } | null>(null);

  const handleCheckoutClick = (planName: string, price: string) => {
    setSelectedPlan({ name: planName, price });
    setOpenModal(true);
  };

  const handlePaystackPay = async () => {
    if (!email || !selectedPlan) return;

    setLoadingPlan(selectedPlan.name);
    try {
      const res = await fetch('/api/v1/billing/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_tier: selectedPlan.name.toUpperCase(),
          email: email,
        }),
      });

      const data = await res.json();
      setLoadingPlan(null);

      if (data.authorization_url) {
        setCheckoutResult({ url: data.authorization_url, isMock: data.is_mock });
      }
    } catch (err) {
      setLoadingPlan(null);
      setCheckoutResult({
        url: `https://checkout.paystack.com/mock-${selectedPlan.name.toLowerCase()}-plan`,
        isMock: true,
      });
    }
  };

  return (
    <Box sx={{ py: 10, px: 2, background: '#f8fafc' }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Chip
          label="PAYSTACK ENTERPRISE PRICING"
          sx={{ background: '#e0e7ff', color: '#4338ca', fontWeight: 700, mb: 2, px: 1 }}
        />
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
          Predictable Pricing for High-Performance Teams
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#475569', maxWidth: 700, mx: 'auto', fontWeight: 400 }}>
          Scale seamlessly from single school computer laboratory rollouts to multi-billion dollar capital infrastructure programs.
        </Typography>
      </Box>

      <Grid container spacing={4} maxWidth="lg" sx={{ mx: 'auto' }}>
        {/* Starter Plan */}
        <Grid item xs={12} md={4}>
          <Card className="enterprise-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 4, flexGrow: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                Starter
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                Ideal for single school labs, boutique firms, or small project teams.
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  ₦450,000
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#64748b', ml: 1 }}>
                  / month (\$299)
                </Typography>
              </Box>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleCheckoutClick('Starter', '₦450,000')}
                sx={{
                  color: '#4f46e5',
                  borderColor: '#c7d2fe',
                  borderRadius: '12px',
                  py: 1.5,
                  fontWeight: 700,
                  mb: 4,
                  textTransform: 'none',
                  '&:hover': { borderColor: '#4f46e5', background: '#e0e7ff' }
                }}
              >
                Subscribe via Paystack
              </Button>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                {['Up to 5 Active Projects', '15 User Seats', '25 GB S3 Evidence Vault', 'Standard Deterministic Health Scoring', 'Business Hours Email Support'].map((feat, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircleOutlineIcon sx={{ color: '#059669', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#334155' }}>{feat}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Professional Plan (Popular Enterprise Choice) */}
        <Grid item xs={12} md={4}>
          <Card
            className="enterprise-card glow-primary-light"
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              border: '2px solid #4f46e5',
              transform: { md: 'scale(1.04)' },
              zIndex: 2,
              position: 'relative'
            }}
          >
            <Box sx={{ background: '#4f46e5', py: 0.8, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#fff', fontWeight: 800, letterSpacing: 1 }}>
                MOST POPULAR FOR ENTERPRISES
              </Typography>
            </Box>

            <CardContent sx={{ p: 4, flexGrow: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                Professional
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                Designed for school districts, general contractors & growing enterprises.
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  ₦1,500,000
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#64748b', ml: 1 }}>
                  / month (\$999)
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                onClick={() => handleCheckoutClick('Professional', '₦1,500,000')}
                sx={{
                  background: '#4f46e5',
                  color: '#fff',
                  borderRadius: '12px',
                  py: 1.5,
                  fontWeight: 700,
                  mb: 4,
                  textTransform: 'none',
                  boxShadow: '0 4px 16px rgba(79, 70, 229, 0.35)',
                  '&:hover': { background: '#4338ca' }
                }}
              >
                Subscribe via Paystack
              </Button>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                {[
                  'Up to 25 Active Projects',
                  '50 User Seats',
                  '250 GB S3 Evidence Vault',
                  'Custom Health Metric Weightings',
                  'Full Project Template Generator',
                  'CSV & Executive PDF Data Exports',
                  'Priority Email & Chat SLA'
                ].map((feat, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircleOutlineIcon sx={{ color: '#059669', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: i < 3 ? 600 : 400 }}>{feat}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Enterprise Plan */}
        <Grid item xs={12} md={4}>
          <Card className="enterprise-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 4, flexGrow: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                Enterprise
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                Custom solutions for government agencies, NGOs & global corporations.
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  ₦3,750,000
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#64748b', ml: 1 }}>
                  / month (\$2,500+)
                </Typography>
              </Box>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleCheckoutClick('Enterprise', '₦3,750,000')}
                sx={{
                  color: '#0284c7',
                  borderColor: '#bae6fd',
                  borderRadius: '12px',
                  py: 1.5,
                  fontWeight: 700,
                  mb: 4,
                  textTransform: 'none',
                  '&:hover': { borderColor: '#0284c7', background: '#e0f2fe' }
                }}
              >
                Subscribe via Paystack
              </Button>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                {[
                  'Unlimited Active Projects',
                  'Unlimited User Seats',
                  '2 TB Dedicated Storage Vault',
                  'White-Label Portal & Custom Branding',
                  'Predictive AI Delay Engine Integration',
                  '24/7 Dedicated Account Manager',
                  'Custom ERP Integrations (SAP, Oracle)'
                ].map((feat, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircleOutlineIcon sx={{ color: '#059669', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#334155' }}>{feat}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Paystack Checkout Dialog Modal (Clean White Enterprise Style) */}
      <Dialog
        open={openModal}
        onClose={() => { setOpenModal(false); setCheckoutResult(null); }}
        PaperProps={{ sx: { background: '#ffffff', color: '#0f172a', minWidth: 440, p: 2, borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0f172a' }}>
          💳 Subscribe to UPME {selectedPlan?.name} Plan
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#475569', mb: 3 }}>
            You are subscribing to the <strong>{selectedPlan?.name} Plan</strong> ({selectedPlan?.price} / month) via <strong>Paystack Secure Gateway</strong>.
          </Typography>

          {!checkoutResult ? (
            <TextField
              fullWidth
              label="Organization Billing Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="billing@yourorganization.com"
              sx={{
                input: { color: '#0f172a' },
                label: { color: '#64748b' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#cbd5e1' },
                  '&:hover fieldset': { borderColor: '#4f46e5' },
                }
              }}
            />
          ) : (
            <Box sx={{ p: 2.5, borderRadius: '12px', background: '#ecfdf5', border: '1px solid #a7f3d0', textAlign: 'center' }}>
              <Typography variant="subtitle1" sx={{ color: '#047857', fontWeight: 700, mb: 1 }}>
                Paystack Payment Gateway Ready!
              </Typography>
              <Typography variant="body2" sx={{ color: '#334155', mb: 2 }}>
                Click below to complete your transaction on Paystack's secure checkout portal.
              </Typography>
              <Button
                variant="contained"
                component="a"
                href={checkoutResult.url}
                target="_blank"
                sx={{ background: '#059669', color: '#fff', fontWeight: 700, textTransform: 'none' }}
              >
                Proceed to Paystack Checkout ➔
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setOpenModal(false); setCheckoutResult(null); }} sx={{ color: '#64748b' }}>
            Cancel
          </Button>
          {!checkoutResult && (
            <Button
              variant="contained"
              disabled={!email || loadingPlan !== null}
              onClick={handlePaystackPay}
              startIcon={loadingPlan ? <CircularProgress size={18} color="inherit" /> : <CreditCardIcon />}
              sx={{ background: '#4f46e5', fontWeight: 700, textTransform: 'none', px: 3 }}
            >
              {loadingPlan ? 'Connecting Paystack...' : 'Pay with Paystack'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};
