import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  DialogContentText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  CardActions,
  Grid,
  Tooltip,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TranslateIcon from '@mui/icons-material/Translate';
import VideocamIcon from '@mui/icons-material/Videocam';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import LanguageIcon from '@mui/icons-material/Language';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Snackbar from '@mui/material/Snackbar';

// Fonction utilitaire pour formater le temps en secondes vers format MM:SS.mmm
const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const milliseconds = Math.floor((timeInSeconds % 1) * 1000);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
};

// Fonction robuste pour parser le temps (accepte HH:MM:SS,mmm ou MM:SS.mmm ou nombre)
function parseAnyTime(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  // Format SRT : HH:MM:SS,mmm
  if (val.includes(':') && val.includes(',')) {
    const [hms, ms] = val.split(',');
    const [h, m, s] = hms.split(':').map(Number);
    return h * 3600 + m * 60 + Number(s) + (ms ? Number(ms) / 1000 : 0);
  }
  // Format MM:SS.mmm
  if (val.includes(':') && val.includes('.')) {
    const [ms, milli] = val.split('.');
    const [m, s] = ms.split(':').map(Number);
    return m * 60 + Number(s) + (milli ? Number(milli) / 1000 : 0);
  }
  // Format nombre
  const n = Number(val);
  return isNaN(n) ? 0 : n;
}

// Liste des langues disponibles
const LANGUAGES = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'Anglais' },
  { value: 'es', label: 'Espagnol' },
  { value: 'de', label: 'Allemand' },
  { value: 'it', label: 'Italien' },
  { value: 'pt', label: 'Portugais' },
  { value: 'ar', label: 'Arabe' },
  { value: 'zh', label: 'Chinois' }
];

// Générer un ID aléatoire
const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 12);
};

const SubtitlesDialog = ({ open, onClose, video, onSave }) => {
  // Mode de vue (0 = langues/segments, 1 = sous-titres originaux, 2 = sous-titres modifiés)
  const [viewMode, setViewMode] = useState(0);
  
  // État des langues et segments
  const [languages, setLanguages] = useState(video?.languages || []);
  const [activeLanguageIndex, setActiveLanguageIndex] = useState(0);
  
  // État des sous-titres
  const [originalSubtitles, setOriginalSubtitles] = useState(video?.original_subtitles || []);
  const [newSubtitles, setNewSubtitles] = useState(video?.new_subtitles || []);
  
  // État d'édition
  const [editingSegment, setEditingSegment] = useState(null);
  const [editingSubtitle, setEditingSubtitle] = useState(null);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [selectedSegment, setSelectedSegment] = useState(null);
    // État pour l'interface
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  
  // État pour l'ajout de nouvelle langue
  const [newLanguageCode, setNewLanguageCode] = useState('');
  // Reset state when dialog opens
  useEffect(() => {
    if (open && video) {
      setLanguages(video.languages || []);
      setOriginalSubtitles(video.original_subtitles || []);
      setNewSubtitles(video.new_subtitles || []);
      setViewMode(0);
      setActiveLanguageIndex(0);
      resetEditingStates();
    }
  }, [open, video]);

  // Réinitialisation des états d'édition
  const resetEditingStates = () => {
    setEditingSegment(null);
    setEditingSubtitle(null);
    setEditingIndex(-1);
    setSelectedSegment(null);
  };

  // Gestionnaire pour le changement de mode de vue
  const handleViewModeChange = (event, newValue) => {
    resetEditingStates();
    setViewMode(newValue);
  };

  // Gestion de l'ajout d'une nouvelle langue
  const handleAddLanguage = () => {
    if (!newLanguageCode) return;
    
    const languageExists = languages.some(l => l.language === newLanguageCode);
    if (languageExists) {
      setSnackbar({ open: true, message: 'Cette langue existe déjà' });
      return;
    }
    
    const newLang = {
      language: newLanguageCode,
      items: []
    };
    
    setLanguages([...languages, newLang]);
    setActiveLanguageIndex(languages.length);
    setNewLanguageCode('');
    setSnackbar({ open: true, message: 'Langue ajoutée avec succès' });
  };

  // Gestion de la suppression d'une langue
  const handleDeleteLanguage = (index) => {
    setConfirmAction(() => () => {
      const updatedLanguages = languages.filter((_, i) => i !== index);
      setLanguages(updatedLanguages);
      if (activeLanguageIndex >= updatedLanguages.length) {
        setActiveLanguageIndex(Math.max(0, updatedLanguages.length - 1));
      }
      setConfirmOpen(false);
      setSnackbar({ open: true, message: 'Langue supprimée avec succès' });
    });
    setConfirmData({ type: 'langue' });
    setConfirmOpen(true);
  };

  // Gestion de l'ajout d'un segment
  const handleAddSegment = (languageIndex) => {
    setEditingSegment({
      randomId: generateRandomId(),
      startTime: 0,
      endTime: 0,
      subtitles: [],
      caption: '',
      status: 'pending',
      title: '',
      url: '',
      index: languages[languageIndex]?.items?.length || 0
    });
    setEditingIndex(-1);
  };

  // Gestion de la sauvegarde d'un segment
  const handleSaveSegment = () => {
    if (!editingSegment) return;
    
    const updatedLanguages = [...languages];
    const languageItems = [...(updatedLanguages[activeLanguageIndex]?.items || [])];
    
    if (editingIndex === -1) {
      // Ajout d'un nouveau segment
      languageItems.push(editingSegment);
    } else {
      // Modification d'un segment existant
      languageItems[editingIndex] = editingSegment;
    }
    
    updatedLanguages[activeLanguageIndex] = {
      ...updatedLanguages[activeLanguageIndex],
      items: languageItems
    };
    
    setLanguages(updatedLanguages);
    setEditingSegment(null);
    setEditingIndex(-1);
    setSnackbar({ open: true, message: 'Segment enregistré avec succès' });
  };

  // Gestion de la suppression d'un segment
  const handleDeleteSegment = (languageIndex, segmentIndex) => {
    setConfirmAction(() => () => {
      const updatedLanguages = [...languages];
      const languageItems = [...updatedLanguages[languageIndex].items];
      languageItems.splice(segmentIndex, 1);
      
      // Mettre à jour les indices des segments restants
      const updatedItems = languageItems.map((item, idx) => ({
        ...item,
        index: idx
      }));
      
      updatedLanguages[languageIndex] = {
        ...updatedLanguages[languageIndex],
        items: updatedItems
      };
      
      setLanguages(updatedLanguages);
      setConfirmOpen(false);
      setSnackbar({ open: true, message: 'Segment supprimé avec succès' });
    });
    setConfirmData({ type: 'segment' });
    setConfirmOpen(true);
  };

  // Gestion de l'édition d'un segment
  const handleEditSegment = (languageIndex, segmentIndex) => {
    const segment = languages[languageIndex].items[segmentIndex];
    setEditingSegment({ ...segment });
    setEditingIndex(segmentIndex);
    setActiveLanguageIndex(languageIndex);
  };

  // Gestion de l'annulation de l'édition d'un segment
  const handleCancelEditSegment = () => {
    setEditingSegment(null);
    setEditingIndex(-1);
  };

  // Afficher les sous-titres d'un segment
  const handleShowSegmentSubtitles = (languageIndex, segmentIndex) => {
    setSelectedSegment({
      languageIndex,
      segmentIndex,
      segment: languages[languageIndex].items[segmentIndex]
    });
  };

  // Gestion de l'ajout d'un sous-titre à un segment
  const handleAddSegmentSubtitle = () => {
    if (!selectedSegment) return;
    
    setEditingSubtitle({
      startTime: 0,
      endTime: 0,
      text: '',
      language: languages[selectedSegment.languageIndex].language
    });
    setEditingIndex(-1);
  };

  // Gestion de l'édition d'un sous-titre de segment
  const handleEditSegmentSubtitle = (subtitleIndex) => {
    if (!selectedSegment) return;
    
    const subtitle = selectedSegment.segment.subtitles[subtitleIndex];
    setEditingSubtitle({
      startTime: typeof subtitle.startTime === 'number' && !isNaN(subtitle.startTime) ? subtitle.startTime : 0,
      endTime: typeof subtitle.endTime === 'number' && !isNaN(subtitle.endTime) ? subtitle.endTime : 0,
      text: subtitle.text || '',
      language: subtitle.language || languages[selectedSegment.languageIndex].language
    });
    setEditingIndex(subtitleIndex);
  };

  // Gestion de la sauvegarde d'un sous-titre pour un segment
  const handleSaveSegmentSubtitle = () => {
    if (!selectedSegment || !editingSubtitle) return;
    
    const { languageIndex, segmentIndex } = selectedSegment;
    const updatedLanguages = [...languages];
    const segment = { ...updatedLanguages[languageIndex].items[segmentIndex] };
    const subtitles = [...(segment.subtitles || [])];
    
    if (editingIndex === -1) {
      // Ajout d'un nouveau sous-titre
      subtitles.push(editingSubtitle);
    } else {
      // Modification d'un sous-titre existant
      subtitles[editingIndex] = editingSubtitle;
    }
    
    // Trier les sous-titres par ordre de départ
    subtitles.sort((a, b) => a.startTime - b.startTime);
    
    segment.subtitles = subtitles;
    updatedLanguages[languageIndex].items[segmentIndex] = segment;
    
    setLanguages(updatedLanguages);
    setSelectedSegment({
      ...selectedSegment,
      segment: updatedLanguages[languageIndex].items[segmentIndex]
    });
    setEditingSubtitle(null);
    setEditingIndex(-1);
    setSnackbar({ open: true, message: 'Sous-titre enregistré avec succès' });
  };

  // Gestion de la suppression d'un sous-titre d'un segment
  const handleDeleteSegmentSubtitle = (subtitleIndex) => {
    if (!selectedSegment) return;
    
    setConfirmAction(() => () => {
      const { languageIndex, segmentIndex } = selectedSegment;
      const updatedLanguages = [...languages];
      const segment = { ...updatedLanguages[languageIndex].items[segmentIndex] };
      const subtitles = segment.subtitles.filter((_, i) => i !== subtitleIndex);
      
      segment.subtitles = subtitles;
      updatedLanguages[languageIndex].items[segmentIndex] = segment;
      
      setLanguages(updatedLanguages);
      setSelectedSegment({
        ...selectedSegment,
        segment: updatedLanguages[languageIndex].items[segmentIndex]
      });
      setConfirmOpen(false);
      setSnackbar({ open: true, message: 'Sous-titre supprimé avec succès' });
    });
    setConfirmData({ type: 'sous-titre' });
    setConfirmOpen(true);
  };

  // Annulation de l'édition d'un sous-titre
  const handleCancelEditSubtitle = () => {
    setEditingSubtitle(null);
    setEditingIndex(-1);
  };

  // Gestion du changement d'un champ d'édition
  const handleChange = (field, value) => {
    if (editingSegment) {
      setEditingSegment({ ...editingSegment, [field]: value });
    } else if (editingSubtitle) {
      setEditingSubtitle({ ...editingSubtitle, [field]: value });
    }
  };

  // Gestion du changement de temps
  const handleTimeChange = (field, value) => {
    handleChange(field, parseAnyTime(value));
  };

  // Fermer le panneau de sous-titres du segment
  const handleCloseSegmentSubtitles = () => {
    setSelectedSegment(null);
    setEditingSubtitle(null);
    setEditingIndex(-1);
  };

  // Obtenir le token d'authentification
  const getToken = () => localStorage.getItem('token') || '';

  // Gestion de la sauvegarde de toutes les modifications
  const handleSaveAll = async () => {
    if (!video?._id) return;
    
    try {
      // Sauvegarde des langues et segments
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos/${video._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ languages })
      });
      
      // Sauvegarde des sous-titres originaux si modifiés
      if (originalSubtitles.length > 0) {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos/${video._id}/subtitles`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          body: JSON.stringify({ subtitles: originalSubtitles, type: 'original_subtitles' })
        });
      }
      
      // Sauvegarde des sous-titres modifiés si présents
      if (newSubtitles.length > 0) {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos/${video._id}/subtitles`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          body: JSON.stringify({ subtitles: newSubtitles, type: 'new_subtitles' })
        });
      }
      
      setSnackbar({ open: true, message: 'Modifications enregistrées avec succès!' });
      onSave && onSave();
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
      setSnackbar({ open: true, message: 'Erreur lors de la sauvegarde' });
    }
  };

  // Rendu du composant
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth 
      PaperProps={{ 
        sx: { 
          bgcolor: '#ffffff',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)'
        } 
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, color: '#18181b', pb: 1, borderBottom: '1px solid #e5e7eb' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
          <span>Gestion des sous-titres - {video?.title}</span>
          <Tabs 
            value={viewMode} 
            onChange={handleViewModeChange} 
            sx={{ minHeight: 0, '.MuiTabs-flexContainer': { gap: 2 } }}
            TabIndicatorProps={{ style: { height: 3, background: '#64748b' } }}
          >
            <Tab 
              icon={<LanguageIcon sx={{ fontSize: '1.2rem', mr: 1 }} />}
              label="Langues & Segments" 
              iconPosition="start"
              sx={{ fontWeight: 600, minHeight: 0, py: 1 }} 
            />
          </Tabs>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 2, bgcolor: '#ffffff' }}>
        {/* Vue Langues et Segments */}
        {viewMode === 0 && !selectedSegment && (
          <>
            {/* Formulaire d'ajout de langue */}
            <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: '#f8fafc', border: '1px solid #e5e7eb' }}>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Ajouter une nouvelle langue
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Langue</InputLabel>
                  <Select
                    value={newLanguageCode}
                    label="Langue"
                    onChange={(e) => setNewLanguageCode(e.target.value)}
                  >
                    {LANGUAGES.map((lang) => (
                      <MenuItem key={lang.value} value={lang.value}>
                        {lang.label} ({lang.value.toUpperCase()})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  color="primary"
                  disabled={!newLanguageCode}
                  onClick={handleAddLanguage}
                >
                  Ajouter
                </Button>
              </Box>
            </Paper>

            {/* Liste des langues */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Langues disponibles ({languages.length})
              </Typography>
              
              {languages.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  Aucune langue disponible. Ajoutez une langue pour commencer.
                </Typography>
              ) : (
                <Tabs
                  value={activeLanguageIndex}
                  onChange={(e, newValue) => {
                    setActiveLanguageIndex(newValue);
                    resetEditingStates();
                  }}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    mb: 2,
                    '.MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.5,
                      px: 3
                    }
                  }}
                >
                  {languages.map((lang, index) => (
                    <Tab
                      key={index}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LanguageIcon sx={{ fontSize: '1rem' }} />
                          {LANGUAGES.find(l => l.value === lang.language)?.label || lang.language.toUpperCase()}
                          <Chip
                            label={lang.items?.length || 0}
                            size="small"
                            sx={{
                              ml: 1,
                              height: '20px',
                              fontSize: '0.7rem',
                              bgcolor: '#e0f2fe',
                              color: '#0369a1'
                            }}
                          />
                        </Box>
                      }
                      sx={{
                        minWidth: 'auto',
                        position: 'relative'
                      }}
                    />
                  ))}
                </Tabs>
              )}
              
              {/* Actions sur la langue sélectionnée */}
              {languages.length > 0 && (
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Segments pour {LANGUAGES.find(l => l.value === languages[activeLanguageIndex]?.language)?.label || languages[activeLanguageIndex]?.language.toUpperCase()}
                  </Typography>
                  <Box>
                    <Button
                      startIcon={<AddIcon />}
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleAddSegment(activeLanguageIndex)}
                      disabled={!!editingSegment}
                    >
                      Ajouter un segment
                    </Button>
                    <Button
                      startIcon={<DeleteIcon />}
                      variant="outlined"
                      color="error"
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={() => handleDeleteLanguage(activeLanguageIndex)}
                      disabled={!!editingSegment}
                    >
                      Supprimer cette langue
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
            
            {/* Formulaire d'édition de segment */}
            {editingSegment && (
              <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: '#f8fafc', border: '1px solid #e5e7eb' }}>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                  {editingIndex === -1 ? 'Ajouter un segment' : 'Modifier le segment'}
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Titre"
                      value={editingSegment.title || ''}
                      onChange={(e) => handleChange('title', e.target.value)}
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Légende"
                      value={editingSegment.caption || ''}
                      onChange={(e) => handleChange('caption', e.target.value)}
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="URL"
                      value={editingSegment.url || ''}
                      onChange={(e) => handleChange('url', e.target.value)}
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                      <InputLabel>Statut</InputLabel>
                      <Select
                        value={editingSegment.status || 'pending'}
                        label="Statut"
                        onChange={(e) => handleChange('status', e.target.value)}
                      >
                        <MenuItem value="pending">En attente</MenuItem>
                        <MenuItem value="processing">En cours de traitement</MenuItem>
                        <MenuItem value="completed">Terminé</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Temps de début (secondes)"
                      value={editingSegment.startTime || 0}
                      onChange={(e) => handleTimeChange('startTime', e.target.value)}
                      variant="outlined"
                      fullWidth
                      type="number"
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Temps de fin (secondes)"
                      value={editingSegment.endTime || 0}
                      onChange={(e) => handleTimeChange('endTime', e.target.value)}
                      variant="outlined"
                      fullWidth
                      type="number"
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                  <Button
                    startIcon={<CancelIcon />}
                    onClick={handleCancelEditSegment}
                    variant="outlined"
                    color="inherit"
                  >
                    Annuler
                  </Button>
                  <Button
                    startIcon={<SaveIcon />}
                    onClick={handleSaveSegment}
                    variant="contained"
                    color="primary"
                  >
                    Enregistrer
                  </Button>
                </Box>
              </Paper>
            )}
            
            {/* Liste des segments pour la langue sélectionnée */}
            {languages.length > 0 && !editingSegment && (
              <Box sx={{ mb: 3 }}>
                {languages[activeLanguageIndex]?.items?.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    Aucun segment disponible pour cette langue. Ajoutez un segment pour commencer.
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {languages[activeLanguageIndex]?.items?.map((segment, index) => (
                      <Grid item xs={12} md={6} key={segment.randomId || index}>
                        <Card sx={{ border: '1px solid #e5e7eb', boxShadow: 'none' }}>
                          <CardContent sx={{ pb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {segment.title || `Segment ${index + 1}`}
                            </Typography>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {segment.caption || 'Aucune légende'}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Chip
                                label={segment.status}
                                size="small"
                                sx={{
                                  bgcolor: segment.status === 'completed' ? '#dcfce7' : 
                                          segment.status === 'processing' ? '#e0f2fe' : '#f3f4f6',
                                  color: segment.status === 'completed' ? '#166534' : 
                                         segment.status === 'processing' ? '#0c4a6e' : '#4b5563'
                                }}
                              />
                              
                              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                {formatTime(segment.startTime || 0)} - {formatTime(segment.endTime || 0)}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Tooltip title="Sous-titres">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <SubtitlesIcon sx={{ fontSize: '0.9rem', color: '#64748b' }} />
                                  <Typography variant="caption">
                                    {segment.subtitles?.length || 0} sous-titres
                                  </Typography>
                                </Box>
                              </Tooltip>
                            </Box>
                          </CardContent>
                          
                          <CardActions sx={{ px: 2, pt: 0, pb: 2, justifyContent: 'space-between' }}>
                            <Box>
                              <Tooltip title="Gérer les sous-titres">
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => handleShowSegmentSubtitles(activeLanguageIndex, index)}
                                >
                                  <SubtitlesIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {segment.url && (
                                <Tooltip title="Voir la vidéo">
                                  <IconButton 
                                    size="small" 
                                    color="info"
                                    onClick={() => window.open(segment.url, '_blank')}
                                  >
                                    <VideocamIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                            <Box>
                              <Button
                                startIcon={<EditIcon />}
                                variant="outlined"
                                size="small"
                                onClick={() => handleEditSegment(activeLanguageIndex, index)}
                              >
                                Éditer
                              </Button>
                              <Button
                                startIcon={<DeleteIcon />}
                                variant="outlined"
                                color="error"
                                size="small"
                                sx={{ ml: 1 }}
                                onClick={() => handleDeleteSegment(activeLanguageIndex, index)}
                              >
                                Supprimer
                              </Button>
                            </Box>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}
          </>
        )}

        {/* Vue de gestion des sous-titres d'un segment */}
        {selectedSegment && (
          <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button 
                startIcon={<ArrowBackIcon />} 
                variant="outlined" 
                onClick={handleCloseSegmentSubtitles}
              >
                Retour aux segments
              </Button>
              <Typography variant="h6" fontWeight={600}>
                Sous-titres du segment: {selectedSegment.segment.title || `Segment ${selectedSegment.segmentIndex + 1}`}
              </Typography>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                color="primary"
                onClick={handleAddSegmentSubtitle}
                disabled={!!editingSubtitle}
              >
                Ajouter un sous-titre
              </Button>
            </Box>

            {/* Formulaire d'édition de sous-titre */}
            {editingSubtitle && (
              <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: '#f8fafc', border: '1px solid #e5e7eb' }}>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                  {editingIndex === -1 ? 'Ajouter un sous-titre' : 'Modifier le sous-titre'}
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Début (MM:SS.mmm)"
                      value={formatTime(editingSubtitle.startTime)}
                      onChange={(e) => handleTimeChange('startTime', e.target.value)}
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Fin (MM:SS.mmm)"
                      value={formatTime(editingSubtitle.endTime)}
                      onChange={(e) => handleTimeChange('endTime', e.target.value)}
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                      <InputLabel>Langue</InputLabel>
                      <Select
                        value={editingSubtitle.language || languages[selectedSegment.languageIndex].language}
                        label="Langue"
                        onChange={(e) => handleChange('language', e.target.value)}
                      >
                        {LANGUAGES.map((lang) => (
                          <MenuItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Texte du sous-titre"
                      value={editingSubtitle.text || ''}
                      onChange={(e) => handleChange('text', e.target.value)}
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                  <Button
                    startIcon={<CancelIcon />}
                    onClick={handleCancelEditSubtitle}
                    variant="outlined"
                    color="inherit"
                  >
                    Annuler
                  </Button>
                  <Button
                    startIcon={<SaveIcon />}
                    onClick={handleSaveSegmentSubtitle}
                    variant="contained"
                    color="primary"
                  >
                    Enregistrer
                  </Button>
                </Box>
              </Paper>
            )}

            {/* Liste des sous-titres du segment */}
            <Box>
              {selectedSegment.segment.subtitles?.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  Aucun sous-titre disponible pour ce segment. Ajoutez un sous-titre pour commencer.
                </Typography>
              ) : (
                <Paper variant="outlined" sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <List disablePadding>
                    {selectedSegment.segment.subtitles.map((subtitle, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <Divider />}
                        <ListItem 
                          sx={{ py: 1, bgcolor: index % 2 === 0 ? 'transparent' : '#f8fafc' }}
                          secondaryAction={
                            <Box>
                              <IconButton 
                                edge="end" 
                                aria-label="edit" 
                                onClick={() => handleEditSegmentSubtitle(index)} 
                                disabled={!!editingSubtitle}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                edge="end" 
                                aria-label="delete" 
                                onClick={() => handleDeleteSegmentSubtitle(index)} 
                                disabled={!!editingSubtitle}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          }
                        >
                          <ListItemText
                            primary={subtitle.text}
                            secondary={
                              <Box component="span" sx={{ display: 'flex', gap: 1, fontSize: '0.75rem' }}>
                                <Typography component="span" variant="caption">
                                  {formatTime(subtitle.startTime)} → {formatTime(subtitle.endTime)}
                                </Typography>
                                <Typography component="span" variant="caption" sx={{ fontWeight: 600 }}>
                                  {subtitle.language?.toUpperCase()}
                                </Typography>
                              </Box>
                            }
                            primaryTypographyProps={{
                              sx: {
                                fontWeight: 500,
                                fontSize: '0.9rem'
                              }
                            }}
                          />
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, pt: 1, borderTop: '1px solid #f3f4f6' }}>
        <Button 
          onClick={onClose} 
          sx={{ color: '#64748b', borderColor: '#e5e7eb' }} 
          variant="outlined"
        >
          Annuler
        </Button>
        <Button 
          onClick={handleSaveAll} 
          variant="contained" 
          color="primary"
          startIcon={<SaveIcon />}
        >
          Enregistrer les modifications
        </Button>
      </DialogActions>

      {/* Dialog de confirmation suppression */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} PaperProps={{ 
        sx: { 
          bgcolor: '#ffffff',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)'
        } 
      }}>
        <DialogTitle sx={{ color: '#18181b', borderBottom: '1px solid #e5e7eb' }}>Confirmer la suppression</DialogTitle>
        <DialogContent sx={{ bgcolor: '#ffffff', pt: 2 }}>
          <DialogContentText sx={{ color: '#18181b' }}>
            Voulez-vous vraiment supprimer {confirmData?.type === 'langue' ? 'cette langue' : confirmData?.type === 'segment' ? 'ce segment' : 'ce sous-titre'} ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #f3f4f6' }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ color: '#64748b', borderColor: '#e5e7eb' }} variant="outlined">Annuler</Button>
          <Button onClick={confirmAction} color="error" variant="contained">Supprimer</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ open: false, message: '' })} message={snackbar.message} />
    </Dialog>
  );
};

export default SubtitlesDialog;
