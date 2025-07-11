import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, FormControl, InputLabel, Select, Typography, Box, DialogContentText } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import MovieIcon from '@mui/icons-material/Movie'; // Pour Shorts
import MusicNoteIcon from '@mui/icons-material/MusicNote'; // Pour TikTok
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'; // Pour Snapchat

const PLATFORMS = [
  { value: 'facebook', label: 'Facebook', icon: <FacebookIcon /> },
  { value: 'instagram', label: 'Instagram', icon: <InstagramIcon /> },
  { value: 'tiktok', label: 'TikTok', icon: <MusicNoteIcon /> },
  { value: 'snapchat', label: 'Snapchat', icon: <PhotoCameraIcon /> },
  { value: 'shorts', label: 'YouTube Shorts', icon: <MovieIcon /> }
];

const LANGUAGES = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'Anglais' },
  { value: 'es', label: 'Espagnol' },
  { value: 'ar', label: 'Arabe' },
  { value: 'zh', label: 'Chinois' }
];

const PLATFORM_FIELDS = {
  facebook: [
    { name: 'appId', label: 'App ID', required: true },
    { name: 'accessToken', label: 'Access Token', required: true },
    { name: 'pageId', label: 'Page ID', required: false },
  ],
  instagram: [
    { name: 'accessToken', label: 'Access Token', required: true },
    { name: 'instagramId', label: 'Instagram Business ID', required: false },
  ],
  tiktok: [
    { name: 'accessToken', label: 'Access Token', required: true },
    { name: 'openId', label: 'Open ID', required: false },
  ],
  snapchat: [
    { name: 'clientId', label: 'Client ID', required: true },
    { name: 'clientSecret', label: 'Client Secret', required: true },
  ],
  shorts: [
    { name: 'apiKey', label: 'API Key', required: true },
    { name: 'channelId', label: 'Channel ID', required: false },
  ],
};

const AccountDialog = ({ open, onClose, account, onSave, onDelete }) => {
  const [localAccount, setLocalAccount] = React.useState(account);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  React.useEffect(() => { setLocalAccount(account); }, [account, open]);
  const handleChange = (field, value) => {
    setLocalAccount({ ...localAccount, [field]: value });
  };
  const getToken = () => localStorage.getItem('token') || '';
  const handleSubmit = async (e) => {
    e.preventDefault();
    const platformFields = PLATFORM_FIELDS[localAccount.platform] || [];
    const keepFields = ['platform', 'name', 'username', 'description', 'language', ...platformFields.map(f => f.name)];
    const cleaned = Object.fromEntries(Object.entries(localAccount).filter(([k]) => keepFields.includes(k)));
    const missing = platformFields.filter(f => f.required && !cleaned[f.name]);
    if (!cleaned.platform || !cleaned.name || !cleaned.language || missing.length > 0) return;
    if (account && account._id) {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/social-accounts/${account._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(cleaned)
      });
      onSave && onSave(cleaned);
    } else {
      onSave(cleaned);
    }
    onClose();
  };
  const handleDelete = () => {
    setConfirmOpen(true);
  };
  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    if (onDelete && account && account._id) {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/social-accounts/${account._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        }
      });
      onDelete(account);
    }
  };
  const handleCancelDelete = () => {
    setConfirmOpen(false);
  };
  const platformFields = PLATFORM_FIELDS[localAccount.platform] || [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#fff', borderRadius: 4, boxShadow: '0 2px 12px 0 #f1f5f9' } }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 700, color: '#18181b', bgcolor: '#fff', borderBottom: '1px solid #e5e7eb' }}>Ajouter un compte réseau social</DialogTitle>
        <DialogContent sx={{ bgcolor: '#fff' }}>
          <Box sx={{ mb: 2, mt: 1 }}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="platform-select-label">Plateforme</InputLabel>
              <Select
                labelId="platform-select-label"
                id="platform-select"
                value={localAccount.platform || ''}
                label="Plateforme"
                onChange={e => handleChange('platform', e.target.value)}
              >
                {PLATFORMS.map((platform) => (
                  <MenuItem key={platform.value} value={platform.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {platform.icon}
                      <Typography sx={{ ml: 1 }}>{platform.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <TextField 
            label="Nom" 
            fullWidth 
            margin="dense" 
            value={localAccount.name || ''} 
            onChange={e => handleChange('name', e.target.value)} 
          />
          <TextField 
            label="Username" 
            fullWidth 
            margin="dense" 
            value={localAccount.username || ''} 
            onChange={e => handleChange('username', e.target.value)} 
          />
          <TextField 
            label="Description" 
            fullWidth 
            margin="dense" 
            multiline
            rows={2}
            value={localAccount.description || ''} 
            onChange={e => handleChange('description', e.target.value)} 
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="language-select-label">Langue</InputLabel>
            <Select
              labelId="language-select-label"
              id="language-select"
              value={localAccount.language || ''}
              label="Langue"
              onChange={e => handleChange('language', e.target.value)}
            >
              {LANGUAGES.map((language) => (
                <MenuItem key={language.value} value={language.value}>
                  {language.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Champs dynamiques selon la plateforme */}
          {platformFields.map(field => (
            <TextField
              key={field.name}
              label={field.label}
              fullWidth
              margin="dense"
              required={field.required}
              value={localAccount[field.name] || ''}
              onChange={e => handleChange(field.name, e.target.value)}
            />
          ))}
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#fff', borderTop: '1px solid #e5e7eb' }}>
          <Button onClick={onClose} sx={{ color: '#64748b', fontWeight: 600 }}>Annuler</Button>
          {account && account._id && (
            <Button onClick={handleDelete} sx={{ color: '#ef4444', borderColor: '#ef4444', fontWeight: 600 }} variant="outlined">Supprimer</Button>
          )}
          <Button 
            type="submit"
            variant="contained" 
            sx={{ bgcolor: '#e5e7eb', color: '#18181b', fontWeight: 700, '&:hover': { bgcolor: '#f3f4f6' } }}
            disabled={!localAccount.platform || !localAccount.name || !localAccount.language}
          >
            {account && account._id ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </DialogActions>
      </form>
      {/* Dialog de confirmation suppression */}
      <Dialog open={confirmOpen} onClose={handleCancelDelete} PaperProps={{ sx: { bgcolor: '#fff', borderRadius: 4 } }}>
        <DialogTitle sx={{ color: '#18181b', fontWeight: 700 }}>Confirmer la suppression</DialogTitle>
        <DialogContent sx={{ bgcolor: '#fff' }}>
          <DialogContentText sx={{ color: '#64748b' }}>
            Voulez-vous vraiment supprimer ce compte ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#fff', borderTop: '1px solid #e5e7eb' }}>
          <Button onClick={handleCancelDelete} color="inherit" variant="outlined" sx={{ color: '#64748b', fontWeight: 600 }}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" sx={{ fontWeight: 700 }}>Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default AccountDialog;
