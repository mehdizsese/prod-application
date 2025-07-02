import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, 
  FormControl, InputLabel, Select, MenuItem, Box, Typography, Chip,
  OutlinedInput, Checkbox, ListItemText } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import MusicNoteIcon from '@mui/icons-material/MusicNote'; 
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MovieIcon from '@mui/icons-material/Movie';

const PLATFORMS = [
  { value: 'facebook', label: 'Facebook', icon: <FacebookIcon /> },
  { value: 'instagram', label: 'Instagram', icon: <InstagramIcon /> },
  { value: 'tiktok', label: 'TikTok', icon: <MusicNoteIcon /> },
  { value: 'snapchat', label: 'Snapchat', icon: <PhotoCameraIcon /> },
  { value: 'shorts', label: 'YouTube Shorts', icon: <MovieIcon /> }
];

const STATUSES = [
  { value: 'new', label: 'Nouveau' },
  { value: 'splitted', label: 'Découpé' },
  { value: 'uploaded', label: 'Téléchargé' }
];

const VideoDialog = ({ open, onClose, video, onSave }) => {
  const [localVideo, setLocalVideo] = React.useState(video);
  React.useEffect(() => { setLocalVideo(video); }, [video, open]);
  const handleChange = (field, value) => {
    setLocalVideo({ ...localVideo, [field]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Nettoyer les champs inutiles
    const keepFields = ['title', 'link', 'status', 'platforms_uploaded'];
    const cleaned = Object.fromEntries(Object.entries(localVideo).filter(([k]) => keepFields.includes(k)));
    // Validation: tous les champs obligatoires doivent être remplis
    if (!cleaned.title || !cleaned.link || !cleaned.status) return;
    onSave(cleaned);
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
        <DialogTitle sx={{ fontWeight: 600, color: '#111827' }}>Ajouter une vidéo</DialogTitle>
        <DialogContent>
          <TextField 
            label="Titre" 
            fullWidth 
            margin="dense" 
            value={localVideo.title || ''} 
            onChange={e => handleChange('title', e.target.value)}
          />
          <TextField 
            label="Lien" 
            fullWidth 
            margin="dense" 
            value={localVideo.link || ''} 
            onChange={e => handleChange('link', e.target.value)} 
          />
          
          <FormControl fullWidth margin="dense">
            <InputLabel id="status-select-label">Statut</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              value={localVideo.status || ''}
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
            <InputLabel id="platform-select-label">Plateformes</InputLabel>
            <Select
              labelId="platform-select-label"
              id="platform-select"
              multiple
              value={localVideo.platforms_uploaded || []}
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
                        avatar={platform ? <Box sx={{ ml: 1 }}>{platform.icon}</Box> : undefined}
                        size="small"
                      />
                    );
                  })}
                </Box>
              )}
            >
              {PLATFORMS.map((platform) => (
                <MenuItem key={platform.value} value={platform.value}>
                  <Checkbox checked={(localVideo.platforms_uploaded || []).indexOf(platform.value) > -1} />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {platform.icon}
                    <Typography sx={{ ml: 1 }}>{platform.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} sx={{ color: '#6b7280' }}>Annuler</Button>
          <Button 
            type="submit"
            variant="contained" 
            sx={{ bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' } }}
            disabled={!localVideo.title || !localVideo.link || !localVideo.status}
          >
            Ajouter
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VideoDialog;
