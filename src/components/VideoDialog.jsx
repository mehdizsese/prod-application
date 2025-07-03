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
  { value: 'es', label: 'Espagnol' },
  { value: 'de', label: 'Allemand' }
];

const VideoDialog = ({ open, onClose, video, onSave }) => {
  const [localVideo, setLocalVideo] = React.useState(video);
  React.useEffect(() => { setLocalVideo(video); }, [video, open]);
  
  const handleChange = (field, value) => {
    setLocalVideo({ ...localVideo, [field]: value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // On garde tous les champs pour compatibilité
    onSave(localVideo);
    onClose();
  };

  // Gestionnaire pour la sélection multiple des plateformes
  const handlePlatformsChange = (event) => {
    const { value } = event.target;
    handleChange('platforms_uploaded', value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 600, color: '#111827' }}>
          {video && video._id ? 'Modifier la vidéo' : 'Ajouter une vidéo'}
        </DialogTitle>
        <DialogContent>
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
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit" variant="outlined">Annuler</Button>
          <Button type="submit" color="primary" variant="contained">Enregistrer</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VideoDialog;
