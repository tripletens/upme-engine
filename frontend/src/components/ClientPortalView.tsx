import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  LinearProgress,
  Stack,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VerifiedIcon from '@mui/icons-material/Verified';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface ClientPortalViewProps {
  project: any;
  milestones: any[];
  currentOrganization: any;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  project,
  milestones,
  currentOrganization
}) => {
  const [approvedEvidences, setApprovedEvidences] = useState<{ [key: number]: boolean }>({
    1: true,
    2: true
  });

  const handleApproveEvidence = (id: number) => {
    setApprovedEvidences((prev) => ({ ...prev, [id]: true }));
  };

  const handleExportPdf = () => {
    window.open('http://127.0.0.1:8000/api/v1/projects/proj-cs-lab-001/report/pdf', '_blank');
  };

  const handleExportCsv = () => {
    window.open('http://127.0.0.1:8000/api/v1/projects/proj-cs-lab-001/report/export', '_blank');
  };

  return (
    <Box>
      {/* Client Welcome Banner */}
      <Box className="enterprise-card" sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Chip
              icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
              label="CLIENT EXECUTIVE PORTAL"
              sx={{ background: '#e0e7ff', color: '#4338ca', fontWeight: 800, mb: 1.5 }}
            />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
              {project.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Organization: <strong>{currentOrganization?.name || 'Example International School'}</strong> | Code: <strong>{project.code}</strong>
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportCsv}
              sx={{ color: '#334155', borderColor: '#cbd5e1', textTransform: 'none', fontWeight: 700 }}
            >
              Export CSV Log
            </Button>

            <Button
              variant="contained"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleExportPdf}
              sx={{
                background: '#4f46e5',
                color: '#ffffff',
                borderRadius: '10px',
                px: 3,
                py: 1.2,
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                '&:hover': { background: '#4338ca' }
              }}
            >
              Download Board PDF Report
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Executive Key Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="enterprise-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>PROJECT HEALTH SCORE</Typography>
                <DashboardIcon sx={{ color: '#059669' }} />
              </Box>
              <Typography variant="h3" sx={{ color: '#059669', fontWeight: 800 }}>
                {project.overallHealthScore} <span style={{ fontSize: '1.2rem', color: '#64748b' }}>/ 100</span>
              </Typography>
              <Chip label="STATUS: ON_TRACK" size="small" sx={{ mt: 1, background: '#ecfdf5', color: '#047857', fontWeight: 800 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card className="enterprise-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>COMPLETION PROGRESS</Typography>
                <AssignmentTurnedInIcon sx={{ color: '#4f46e5' }} />
              </Box>
              <Typography variant="h3" sx={{ color: '#4f46e5', fontWeight: 800 }}>
                {project.overallProgress}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={project.overallProgress}
                sx={{ height: 8, borderRadius: 4, mt: 1.5, background: '#e2e8f0', '& .MuiLinearProgress-bar': { background: '#4f46e5' } }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card className="enterprise-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>VERIFIED DELIVERABLES</Typography>
                <CheckCircleIcon sx={{ color: '#059669' }} />
              </Box>
              <Typography variant="h3" sx={{ color: '#059669', fontWeight: 800 }}>
                2 / 3 <span style={{ fontSize: '1.2rem', color: '#64748b' }}>Approved</span>
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 1 }}>
                All required inspection certificates signed off
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Deliverables & Evidence Sign-off Table */}
      <Box className="enterprise-card" sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 3 }}>
          📜 Client Deliverable Evidence & Sign-off Vault
        </Typography>

        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px' }}>
          <Table>
            <TableHead sx={{ background: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Deliverable Item</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Phase / Milestone</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Inspection Certificate</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Verification Status</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Client Approval</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>Lab Budget & Specifications Approval</TableCell>
                <TableCell sx={{ color: '#64748b' }}>1. Planning & Budget</TableCell>
                <TableCell>
                  <Chip
                    icon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                    label="budget_approval_cert.pdf"
                    size="small"
                    component="a"
                    href="#"
                    clickable
                    sx={{ background: '#e0e7ff', color: '#4338ca', fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell>
                  <Chip label="VERIFIED" size="small" sx={{ background: '#ecfdf5', color: '#047857', fontWeight: 800 }} />
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  <Button size="small" variant="contained" disabled sx={{ background: '#059669', color: '#fff', textTransform: 'none' }}>
                    ✓ Approved
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>Workstation PCs Delivery (40 Units)</TableCell>
                <TableCell sx={{ color: '#64748b' }}>2. Procurement Phase</TableCell>
                <TableCell>
                  <Chip
                    icon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                    label="vendor_waybill_receipt.pdf"
                    size="small"
                    component="a"
                    href="#"
                    clickable
                    sx={{ background: '#e0e7ff', color: '#4338ca', fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell>
                  <Chip label="VERIFIED" size="small" sx={{ background: '#ecfdf5', color: '#047857', fontWeight: 800 }} />
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  <Button size="small" variant="contained" disabled sx={{ background: '#059669', color: '#fff', textTransform: 'none' }}>
                    ✓ Approved
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>Workstation Unpacking & Desk Mounting</TableCell>
                <TableCell sx={{ color: '#64748b' }}>4. Equipment Installation</TableCell>
                <TableCell>
                  <Chip
                    icon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                    label="mounting_inspection_photo.jpg"
                    size="small"
                    component="a"
                    href="#"
                    clickable
                    sx={{ background: '#fef3c7', color: '#b45309', fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell>
                  <Chip label="PENDING APPROVAL" size="small" sx={{ background: '#fff7ed', color: '#c2410c', fontWeight: 800 }} />
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  {approvedEvidences[3] ? (
                    <Button size="small" variant="contained" disabled sx={{ background: '#059669', color: '#fff', textTransform: 'none' }}>
                      ✓ Approved
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleApproveEvidence(3)}
                      sx={{ background: '#4f46e5', fontWeight: 700, textTransform: 'none', borderRadius: '8px' }}
                    >
                      Approve Evidence
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
