import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Stack,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import LanguageIcon from '@mui/icons-material/Language';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import VideoDialog from '../../components/VideoDialog';
import SubtitlesDialog from '../../components/SubtitlesDialog';

// Constantes pour les statuts des vidéos (copié de VideosPage pour cohérence)
const statusColors = {
  uploaded: { bg: '#065f46', color: '#d1fae5' },
  splitted: { bg: '#92400e', color: '#fde68a' },
  processing: { bg: '#1e40af', color: '#dbeafe' },
  published: { bg: '#4c1d95', color: '#ede9fe' },
  new: { bg: '#334155', color: '#e2e8f0' },
  pending: { bg: '#4b5563', color: '#f9fafb' },
  generated: { bg: '#0369a1', color: '#e0f2fe' }
};

function VideoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [openSubtitles, setOpenSubtitles] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Fonction pour obtenir le token d'authentification
  const getToken = () => localStorage.getItem('token') || '';

  // Récupérer les données de la vidéo
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos/${id}`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données vidéo');
        }

        const data = await response.json();
        setVideo(data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchVideoData();
    }
  }, [id]);

  // Gestionnaire pour changement d'onglet
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Gestionnaire pour la suppression
  const handleDelete = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
      });
      // Rediriger vers la liste des vidéos après suppression
      navigate('/videos');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
    setConfirmDeleteOpen(false);
  };

  // Gestionnaire pour après l'édition
  const handleAfterSave = async () => {
    // Actualiser les données vidéo
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos/${id}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVideo(data);
      }
    } catch (error) {
      console.error('Erreur lors de l\'actualisation:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!video) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">Vidéo non trouvée</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/videos')}
          sx={{ mt: 2 }}
        >
          Retour à la liste des vidéos
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', bgcolor: '#fff', p: { xs: 3, md: 4, lg: 6 }, overflowY: 'auto' }}>
      {/* En-tête avec actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/videos')} sx={{ mr: 2, bgcolor: '#f3f4f6' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight={800} color="#18181b" letterSpacing={1}>
              {video.title}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" mt={1}>
              <Chip 
                label={video.status} 
                size="small" 
                sx={{ 
                  bgcolor: statusColors[video.status]?.bg || '#334155', 
                  color: statusColors[video.status]?.color || '#e2e8f0', 
                  fontWeight: 700, 
                  textTransform: 'capitalize' 
                }} 
              />
              <Typography variant="body2" color="#64748b">
                {new Date(video.createdAt).toLocaleDateString('fr-FR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
            </Stack>
          </Box>
        </Box>
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<SubtitlesIcon />}
            onClick={() => setOpenSubtitles(true)}
            sx={{ mr: 2 }}
          >
            Gérer les sous-titres
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />}
            onClick={() => setOpenEdit(true)}
            sx={{ mr: 2 }}
          >
            Modifier
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={() => setConfirmDeleteOpen(true)}
          >
            Supprimer
          </Button>
        </Box>
      </Box>

      {/* Informations principales */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 4, border: '1px solid #e5e7eb', boxShadow: '0 2px 12px 0 #f1f5f9', borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Informations vidéo
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List sx={{ p: 0 }}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="Titre" 
                    secondary={video.title}
                    primaryTypographyProps={{ color: '#64748b', fontSize: '0.875rem' }}
                    secondaryTypographyProps={{ color: '#18181b', fontWeight: 600 }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="Statut" 
                    secondary={
                      <Chip 
                        label={video.status} 
                        size="small" 
                        sx={{ 
                          bgcolor: statusColors[video.status]?.bg || '#334155', 
                          color: statusColors[video.status]?.color || '#e2e8f0', 
                          fontWeight: 700, 
                          textTransform: 'capitalize',
                          fontSize: '0.75rem' 
                        }} 
                      />
                    }
                    primaryTypographyProps={{ color: '#64748b', fontSize: '0.875rem' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="Lien" 
                    secondary={
                      <Button 
                        href={video.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        startIcon={<PlayCircleIcon />}
                        variant="text" 
                        sx={{ p: 0, textTransform: 'none' }}
                      >
                        Ouvrir la vidéo
                      </Button>
                    }
                    primaryTypographyProps={{ color: '#64748b', fontSize: '0.875rem' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="Date de création" 
                    secondary={new Date(video.createdAt).toLocaleDateString('fr-FR', { 
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                    primaryTypographyProps={{ color: '#64748b', fontSize: '0.875rem' }}
                    secondaryTypographyProps={{ color: '#18181b' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="Dernière mise à jour" 
                    secondary={new Date(video.updatedAt).toLocaleDateString('fr-FR', { 
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                    primaryTypographyProps={{ color: '#64748b', fontSize: '0.875rem' }}
                    secondaryTypographyProps={{ color: '#18181b' }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mb: 4, border: '1px solid #e5e7eb', boxShadow: '0 2px 12px 0 #f1f5f9', borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Statistiques des sous-titres
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      bgcolor: '#f3f4f6', 
                      borderRadius: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="h5" color="primary" fontWeight={700}>
                      {video.languages?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="#64748b">
                      Langues
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      bgcolor: '#f3f4f6', 
                      borderRadius: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="h5" color="primary" fontWeight={700}>
                      {video.languages?.reduce((total, lang) => total + (lang.items?.length || 0), 0) || 0}
                    </Typography>
                    <Typography variant="body2" color="#64748b">
                      Segments
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ mb: 4, border: '1px solid #e5e7eb', boxShadow: '0 2px 12px 0 #f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                aria-label="sous-titres par langue"
                sx={{
                  '.MuiTab-root': { 
                    textTransform: 'none', 
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    px: 3
                  },
                  '.Mui-selected': { 
                    color: '#3b82f6',
                    fontWeight: 700
                  }
                }}
              >
                {video.languages?.map((lang, index) => (
                  <Tab 
                    key={index} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LanguageIcon sx={{ fontSize: '1rem' }} />
                        {lang.language.toUpperCase()} 
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
                  />
                ))}
                {(!video.languages || video.languages.length === 0) && (
                  <Tab label="Aucune langue disponible" disabled />
                )}
              </Tabs>
            </Box>

            <Box sx={{ p: 3, maxHeight: '600px', overflowY: 'auto' }}>
              {video.languages && video.languages[activeTab] ? (
                <List sx={{ width: '100%', p: 0 }}>
                  {video.languages[activeTab].items?.map((segment, idx) => (
                    <Paper 
                      key={idx} 
                      elevation={0}
                      sx={{ 
                        mb: 2, 
                        p: 2, 
                        bgcolor: idx % 2 === 0 ? '#f8fafc' : '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" color="primary" fontWeight={700}>
                          {segment.title || `Segment ${idx + 1}`}
                        </Typography>
                        <Typography variant="body2" color="#64748b">
                          {segment.startTime ? `${segment.startTime.toFixed(2)}s - ${segment.endTime.toFixed(2)}s` : ''}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {segment.caption}
                      </Typography>
                    </Paper>
                  ))}
                  {(!video.languages[activeTab].items || video.languages[activeTab].items.length === 0) && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="#64748b">
                        Aucun segment de sous-titre disponible pour cette langue
                      </Typography>
                    </Box>
                  )}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="#64748b">
                    Aucune langue disponible
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<SubtitlesIcon />}
                    onClick={() => setOpenSubtitles(true)}
                    sx={{ mt: 2 }}
                  >
                    Ajouter des sous-titres
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog de confirmation suppression */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Voulez-vous vraiment supprimer cette vidéo ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="inherit" variant="outlined">
            Annuler
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog édition vidéo */}
      {openEdit && (
        <VideoDialog 
          open={openEdit} 
          onClose={() => setOpenEdit(false)} 
          video={video} 
          onSave={handleAfterSave} 
        />
      )}

      {/* Dialog sous-titres */}
      {openSubtitles && (
        <SubtitlesDialog 
          open={openSubtitles} 
          onClose={() => setOpenSubtitles(false)} 
          video={video} 
          onSave={handleAfterSave} 
        />
      )}
    </Box>
  );
}

export default VideoDetailPage;
