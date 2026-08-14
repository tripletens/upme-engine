import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Chip, Grid, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StarIcon from '@mui/icons-material/Star';

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
      // Initiate subscription checkout via Paystack backend API
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
      // Fallback checkout link for demo UI
      setCheckoutResult({
        url: `https://checkout.paystack.com/mock-${selectedPlan.name.toLowerCase()}-plan`,
        isMock: true,
      });
    }
  };

  return (
    <Box sx={{ py: 10, px: 2 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Chip label="PAYSTACK INTEGRATED B2B SAAS PRICING" sx={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontWeight: 700, mb: 2 }} />
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#f8fafc', mb: 2 }}>
          Predictable Pricing for Enterprise Project Control
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#94a3b8', maxWidth: 700, mx: 'auto' }}>
          Choose a plan tailored to your organization. Scale seamlessly from single lab rollouts to multi-million dollar capital infrastructure programs.
        </Typography>
      </Box>

      <Grid container spacing={4} maxWidth="lg" sx={{ mx: 'auto' }}>
        {/* Starter Plan */}
        <Grid item xs={12} md={4}>
          <Card className="glass-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <CardContent sx={{ p: 4, flexGrow: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#f8fafc', mb: 1 }}>
                Starter
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
                Ideal for single school labs, boutique firms, or small project teams.
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                  ₦450,000
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#94a3b8', ml: 1 }}>
                  / month (\$299)
                </Typography>
              </Box>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleCheckoutClick('Starter', '₦450,000')}
                sx={{
                  color: '#818cf8',
                  borderColor: 'rgba(99, 102, 241, 0.4)',
                  borderRadius: '12px',
                  py: 1.5,
                  fontWeight: 700,
                  mb: 4,
                  '&:hover': { borderColor: '#6366f1', background: 'rgba(99, 102, 241, 0.1)' }
                }}
              >
                Subscribe via Paystack
              </Button>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {['Up to 5 Active Projects', '15 User Seats', '25 GB S3 Evidence Vault', 'Standard Deterministic Health Scoring', 'Business Hours Email Support'].map((feat, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircleOutlineIcon sx={{ color: '#10b981', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#cbd5e1' }}>{feat}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Professional Plan (Popular) */}
        <Grid item xs={12} md={4}>
          <Card
            className="glass-card glow-primary"
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              border: '2px solid #6366f1',
              transform: { md: 'scale(1.05)' },
              zIndex: 2
            }}
          >
            <Box sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', py: 0.8, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#fff', fontWeight: 800, letterSpacing: 1 }}>
                MOST POPULAR FOR ENTERPRISES
              </Typography>
            </Box>

            <CardContent sx={{ p: 4, flexGrow: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#f8fafc', mb: 1 }}>
                Professional
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
                Designed for school districts, general contractors & growing enterprises.
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                  ₦1,500,000
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#94a3b8', ml: 1 }}>
                  / month (\$999)
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                onClick={() => handleCheckoutClick('Professional', '₦1,500,000')}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  borderRadius: '12px',
                  py: 1.5,
                  fontWeight: 700,
                  mb: 4,
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)'
                }}
              >
                Subscribe via Paystack
              </Button>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
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
                    <CheckCircleOutlineIcon sx={{ color: '#10b981', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: i < 3 ? 600 : 400 }}>{feat}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Enterprise Plan */}
        <Grid item xs={12} md={4}>
          <Card className="glass-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 4, flexGrow: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#f8fafc', mb: 1 }}>
                Enterprise
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
                Custom solutions for government agencies, NGOs & global corporations.
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                  ₦3,750,000
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#94a3b8', ml: 1 }}>
                  / month (\$2,500+)
                </Typography>
              </Box>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleCheckoutClick('Enterprise', '₦3,750,000')}
                sx={{
                  color: '#38bdf8',
                  borderColor: 'rgba(56, 189, 248, 0.4)',
                  borderRadius: '12px',
                  py: 1.5,
                  fontWeight: 700,
                  mb: 4,
                  '&:hover': { borderColor: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)' }
                }}
              >
                Subscribe via Paystack
              </Button>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
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
                    <CheckCircleOutlineIcon sx={{ color: '#10b981', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#cbd5e1' }}>{feat}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Paystack Checkout Dialog Modal */}
      <Dialog
        open={openModal}
        onClose={() => { setOpenModal(false); setCheckoutResult(null); }}
        PaperProps={{ className: 'glass-card', sx: { background: '#1e293b', color: '#fff', minWidth: 420, p: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#fff' }}>
          💳 Subscribe to UPME {selectedPlan?.name} Plan
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
            You are subscribing to the <strong>{selectedPlan?.name} Plan</strong> ({selectedPlan?.price} / month) via <strong>Paystack Secure Checkout</strong>.
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
                input: { color: '#fff' },
                label: { color: '#94a3b8' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: '#6366f1' },
                }
              }}
            />
          ) : (
            <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center' }}>
              <Typography variant="subtitle1" sx={{ color: '#34d399', fontWeight: 700, mb: 1 }}>
                Paystack Payment Gateway Ready!
              </Typography>
              <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 2 }}>
                Click below to complete your transaction on Paystack's secure checkout page.
              </Typography>
              <Button
                variant="contained"
                component="a"
                href={checkoutResult.url}
                target="_blank"
                sx={{ background: '#10b981', color: '#fff', fontWeight: 700 }}
              >
                Proceed to Paystack Checkout ➔
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setOpenModal(false); setCheckoutResult(null); }} sx={{ color: '#94a3b8' }}>
            Cancel
          </Button>
          {!checkoutResult && (
            <Button
              variant="contained"
              disabled={!email || loadingPlan !== null}
              onClick={handlePaystackPay}
              startIcon={loadingPlan ? <CircularProgress size={18} color="inherit" /> : <CreditCardIcon />}
              sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', fontWeight: 700 }}
            >
              {loadingPlan ? 'Connecting Paystack...' : 'Pay with Paystack'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};
