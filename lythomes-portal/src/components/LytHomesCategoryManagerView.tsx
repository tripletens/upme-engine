import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  TextField,
  Chip,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Stack,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CategoryIcon from '@mui/icons-material/Category';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ApartmentIcon from '@mui/icons-material/Apartment';
import EngineeringIcon from '@mui/icons-material/Engineering';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import BrushIcon from '@mui/icons-material/Brush';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';

export interface CategoryItem {
  id: string;
  label: string;
  description: string;
  iconType: string;
  color: string;
  isCustom?: boolean;
}

interface LytHomesCategoryManagerViewProps {
  categories: CategoryItem[];
  projectCounts: Record<string, number>;
  onBack: () => void;
  onCreateCategory: (newCat: CategoryItem) => void;
  onUpdateCategory: (updatedCat: CategoryItem) => void;
  onDeleteCategory: (catId: string) => void;
}

export const LytHomesCategoryManagerView: React.FC<LytHomesCategoryManagerViewProps> = ({
  categories,
  projectCounts,
  onBack,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form State
  const [label, setLabel] = useState('');
  const [idCode, setIdCode] = useState('');
  const [description, setDescription] = useState('');
  const [iconType, setIconType] = useState('villa');
  const [color, setColor] = useState('#f59e0b');

  const [alertMsg, setAlertMsg] = useState('');

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setLabel('');
    setIdCode('');
    setDescription('');
    setIconType('villa');
    setColor('#f59e0b');
    setOpenModal(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setLabel(cat.label);
    setIdCode(cat.id);
    setDescription(cat.description || '');
    setIconType(cat.iconType || 'villa');
    setColor(cat.color || '#f59e0b');
    setOpenModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    const formattedId = idCode.trim()
      ? idCode.toUpperCase().replace(/\s+/g, '_')
      : label.toUpperCase().replace(/\s+/g, '_');

    const catObj: CategoryItem = {
      id: editingCategory ? editingCategory.id : formattedId,
      label: label.trim(),
      description: description.trim(),
      iconType,
      color,
      isCustom: true
    };

    if (editingCategory) {
      onUpdateCategory(catObj);
      setAlertMsg(`🎉 Portfolio Category "${catObj.label}" updated successfully!`);
    } else {
      onCreateCategory(catObj);
      setAlertMsg(`🎉 New Portfolio Category "${catObj.label}" created!`);
    }

    setOpenModal(false);
  };

  const renderIcon = (type: string, customColor?: string) => {
    const c = customColor || '#f59e0b';
    switch (type) {
      case 'tower': return <ApartmentIcon sx={{ color: c }} />;
      case 'road': return <EngineeringIcon sx={{ color: c }} />;
      case 'warehouse': return <WarehouseIcon sx={{ color: c }} />;
      case 'brush': return <BrushIcon sx={{ color: c }} />;
      case 'solar': return <SolarPowerIcon sx={{ color: c }} />;
      default: return <HomeWorkIcon sx={{ color: c }} />;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: 1100, mx: 'auto', boxSizing: 'border-box', overflowX: 'hidden' }}>
      {/* Top Back Navigation */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{ mb: 3, textTransform: 'none', fontWeight: 800, color: '#334155', borderColor: '#cbd5e1', borderRadius: '10px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
      >
        Back to Construction Portfolio
      </Button>

      {/* Header Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5, md: 4 },
          mb: 3,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.3)',
          border: '1px solid #334155'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
              <Chip
                icon={<FolderSpecialIcon sx={{ color: '#fff !important', fontSize: 14 }} />}
                label="ADMIN PORTFOLIO CRUD MANAGER"
                size="small"
                sx={{ background: '#f59e0b', color: '#fff', fontWeight: 800, fontSize: '0.68rem', height: 24 }}
              />
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -0.5, mb: 1, fontSize: { xs: '1.35rem', sm: '2.1rem' } }}>
              Construction Portfolio & Category Manager
            </Typography>

            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: { xs: '0.8rem', sm: '0.88rem' } }}>
              Create, edit, and manage custom project categories and portfolios across LytHomes Construction Co.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleOpenCreate}
            sx={{
              height: 42,
              whiteSpace: 'nowrap',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#ffffff',
              borderRadius: '10px',
              px: 3,
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
              '&:hover': { background: '#d97706' }
            }}
          >
            Create New Portfolio
          </Button>
        </Box>
      </Paper>

      {alertMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setAlertMsg('')}>
          {alertMsg}
        </Alert>
      )}

      {/* Grid of Categories / Portfolios */}
      <Grid container spacing={2.5}>
        {categories.map((cat) => {
          const count = projectCounts[cat.id] || 0;
          return (
            <Grid item xs={12} sm={6} md={4} key={cat.id}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  transition: 'all 0.2s ease',
                  '&:hover': { borderColor: '#f59e0b', boxShadow: '0 8px 20px rgba(245, 158, 11, 0.12)' }
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ width: 42, height: 42, borderRadius: '12px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {renderIcon(cat.iconType, cat.color)}
                    </Box>

                    <Chip
                      label={`${count} Projects`}
                      size="small"
                      sx={{ fontWeight: 800, fontSize: '0.68rem', height: 22, background: '#f1f5f9', color: '#475569' }}
                    />
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem', mb: 0.5 }}>
                    {cat.label}
                  </Typography>

                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block', mb: 2 }}>
                    Code ID: <strong>{cat.id}</strong>
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.8rem', lineHeight: 1.4 }}>
                    {cat.description || 'Custom construction portfolio category.'}
                  </Typography>
                </CardContent>

                <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end', gap: 1, borderTop: '1px dashed #cbd5e1' }}>
                  <IconButton size="small" onClick={() => handleOpenEdit(cat)} sx={{ color: '#6366f1' }}>
                    <EditIcon fontSize="small" />
                  </IconButton>

                  {cat.isCustom && (
                    <IconButton size="small" onClick={() => onDeleteCategory(cat.id)} sx={{ color: '#ef4444' }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Create / Edit Category Modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.2rem', color: '#0f172a' }}>
          {editingCategory ? `Edit Portfolio "${editingCategory.label}"` : 'Create New Construction Portfolio'}
        </DialogTitle>

        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Portfolio Category Name"
              placeholder="e.g. Solar Farms & Clean Energy"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />

            {!editingCategory && (
              <TextField
                fullWidth
                label="Category Identifier Code"
                placeholder="e.g. SOLAR_FARM"
                value={idCode}
                onChange={(e) => setIdCode(e.target.value)}
                helperText="Unique uppercase identifier key"
              />
            )}

            <TextField
              fullWidth
              select
              label="Portfolio Icon Type"
              value={iconType}
              onChange={(e) => setIconType(e.target.value)}
            >
              <MenuItem value="villa">Villa / Residential House</MenuItem>
              <MenuItem value="tower">Commercial Tower / High-rise</MenuItem>
              <MenuItem value="road">Civil Infrastructure & Roads</MenuItem>
              <MenuItem value="warehouse">Logistics Warehouse</MenuItem>
              <MenuItem value="brush">Interior Architecture</MenuItem>
              <MenuItem value="solar">Solar & Clean Energy</MenuItem>
            </TextField>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Portfolio Description"
              placeholder="Describe the construction scope for this portfolio category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setOpenModal(false)} sx={{ fontWeight: 800, color: '#64748b' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#ffffff',
                fontWeight: 800,
                borderRadius: '10px',
                px: 3
              }}
            >
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};
