import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, 
  FormControl, InputLabel, Select, MenuItem, Box, Typography, Chip,
  OutlinedInput, Checkbox, ListItemText } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import MusicNoteIcon from '@mui/icons-material/MusicNote'; 
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MovieIcon from '@mui/icons-material/Movie';
import YouTubeIcon from '@mui/icons-material/YouTube';

const PLATFORMS = [
  { value: 'facebook', label: 'Facebook', icon: <FacebookIcon /> },
  { value: 'instagram', label: 'Instagram', icon: <InstagramIcon /> },
  { value: 'tiktok', label: 'TikTok', icon: <MusicNoteIcon /> },
  { value: 'snapchat', label: 'Snapchat', icon: <PhotoCameraIcon /> },
  { value: 'shorts', label: 'YouTube Shorts', icon: <MovieIcon /> },
  { value: 'youtube', label: 'YouTube', icon: <YouTubeIcon /> }
];

// Ajout du status 'pending' si besoin
const STATUSES = [
  { value: 'new', label: 'Nouveau' },
  { value: 'splitted', label: 'Découpé' },
  { value: 'uploaded', label: 'Téléchargé' },
  { value: 'processing', label: 'En traitement' },
  { value: 'published', label: 'Publié' },
  { value: 'pending', label: 'En attente' }
];

const LANGUAGES = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'Anglais' },
  { value: 'ar', label: 'Arabe' },
  { value: 'zh', label: 'Chinois' },
  { value: 'es', label: 'Espagnol' }
];

const VideoDialog = ({ open, onClose, video, onSave, onDelete }) => {
  const [localVideo, setLocalVideo] = React.useState(video || {});
  React.useEffect(() => { setLocalVideo(video || {}); }, [video, open]);

  const handleChange = (field, value) => {
    setLocalVideo((prev) => ({ ...prev, [field]: value }));
  };

  const getToken = () => localStorage.getItem('token') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localVideo.title || !localVideo.link || !localVideo.status) return;
    if (video && video._id) {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos/${video._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(localVideo)
      });
      onSave && onSave(localVideo);
    } else {
      onSave(localVideo);
    }
    onClose();
  };
  const handleDelete = async () => {
    if (!video?._id) return;
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos/${video._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    });
    onDelete && onDelete(video);
    onClose();
  };

  // Gestionnaire pour la sélection multiple des plateformes
  const handlePlatformsChange = (event) => {
    const { value } = event.target;
    handleChange('platforms_uploaded', value);
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ 
      sx: { 
        bgcolor: '#ffffff',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)'
      } 
    }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 600, color: '#18181b', borderBottom: '1px solid #e5e7eb' }}>
          {video && video._id ? 'Modifier la vidéo' : 'Ajouter une vidéo'}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#ffffff', pt: 3 }}>
          <TextField 
            label="Titre" 
            fullWidth 
            margin="dense" 
            value={localVideo?.title || ''} 
            onChange={e => handleChange('title', e.target.value)}
          />
          <TextField 
            label="Lien"
            fullWidth 
            margin="dense" 
            value={localVideo?.link || ''} 
            onChange={e => handleChange('link', e.target.value)} 
          />
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, my: 1 }}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="status-select-label">Statut</InputLabel>
              <Select
                labelId="status-select-label"
                id="status-select"
                value={localVideo?.status || ''}
                label="Statut"
                onChange={e => handleChange('status', e.target.value)}
              >
                {STATUSES.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="dense">
              <InputLabel id="language-select-label">Langue</InputLabel>
              <Select
                labelId="language-select-label"
                id="language-select"
                value={localVideo?.language || 'fr'}
                label="Langue"
                onChange={e => handleChange('language', e.target.value)}
              >
                {LANGUAGES.map((lang) => (
                  <MenuItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, my: 1 }}>
            <TextField 
              label="Nom de fichier original" 
              fullWidth 
              margin="dense" 
              value={localVideo?.originalFilename || ''} 
              onChange={e => handleChange('originalFilename', e.target.value)}
            />
            <TextField 
              label="Durée (secondes)" 
              fullWidth 
              margin="dense" 
              type="number"
              value={localVideo?.duration || ''} 
              onChange={e => handleChange('duration', e.target.value)} 
            />
          </Box>
          
          <FormControl fullWidth margin="dense">
            <InputLabel id="platform-select-label">Plateformes</InputLabel>
            <Select
              labelId="platform-select-label"
              id="platform-select"
              multiple
              value={localVideo?.platforms_uploaded || []}
              onChange={handlePlatformsChange}
              input={<OutlinedInput label="Plateformes" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const platform = PLATFORMS.find(p => p.value === value);
                    return (
                      <Chip 
                        key={value} 
                        label={platform ? platform.label : value}
                        icon={platform ? platform.icon : null}
                        size="small"
                      />
                    );
                  })}
                </Box>
              )}
            >
              {PLATFORMS.map((platform) => (
                <MenuItem key={platform.value} value={platform.value}>
                  <Checkbox checked={(localVideo?.platforms_uploaded || []).indexOf(platform.value) > -1} />
                  {platform.icon}
                  <ListItemText primary={platform.label} sx={{ ml: 2 }} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, borderTop: '1px solid #f3f4f6' }}>
          <Button 
            onClick={onClose} 
            sx={{ color: '#64748b', borderColor: '#e5e7eb' }} 
            variant="outlined"
          >
            Annuler
          </Button>
          {video && video._id && (
            <Button 
              onClick={handleDelete} 
              color="error" 
              variant="outlined"
              sx={{ borderColor: '#f87171' }}
            >
              Supprimer
            </Button>
          )}
          <Button 
            type="submit" 
            sx={{ 
              bgcolor: '#e5e7eb', 
              color: '#18181b',
              '&:hover': { bgcolor: '#d1d5db' }
            }} 
            variant="contained"
          >
            Enregistrer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VideoDialog;
