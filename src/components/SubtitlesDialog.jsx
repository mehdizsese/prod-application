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
  InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// Fonction utilitaire pour formater le temps en secondes vers format MM:SS.mmm
const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const milliseconds = Math.floor((timeInSeconds % 1) * 1000);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
};

// Fonction utilitaire pour convertir le format MM:SS.mmm en secondes
const parseTime = (timeString) => {
  if (!timeString) return 0;
  const [minutesSeconds, milliseconds] = timeString.split('.');
  const [minutes, seconds] = minutesSeconds.split(':').map(Number);
  return minutes * 60 + seconds + (milliseconds ? Number(milliseconds) / 1000 : 0);
};

const SubtitlesDialog = ({ open, onClose, video, onSave }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [originalSubtitles, setOriginalSubtitles] = useState(video?.original_subtitles || []);
  const [newSubtitles, setNewSubtitles] = useState(video?.new_subtitles || []);
  const [editingSubtitle, setEditingSubtitle] = useState(null);
  const [editIndex, setEditIndex] = useState(-1);
  const [language, setLanguage] = useState('fr');

  // Reset state when dialog opens
  useEffect(() => {
    if (open && video) {
      setOriginalSubtitles(video.original_subtitles || []);
      setNewSubtitles(video.new_subtitles || []);
      setEditingSubtitle(null);
      setEditIndex(-1);
      setActiveTab(0);
    }
  }, [open, video]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const startEditSubtitle = (subtitle, index) => {
    setEditingSubtitle({
      startTime: subtitle.startTime,
      endTime: subtitle.endTime,
      text: subtitle.text,
      language: subtitle.language || language
    });
    setEditIndex(index);
  };

  const cancelEdit = () => {
    setEditingSubtitle(null);
    setEditIndex(-1);
  };

  const saveEdit = () => {
    const currentSubtitles = activeTab === 0 ? originalSubtitles : newSubtitles;
    const updatedSubtitles = [...currentSubtitles];
    
    if (editIndex === -1) {
      // Ajout d'un nouveau sous-titre
      updatedSubtitles.push({
        ...editingSubtitle,
        language: editingSubtitle.language || language
      });
    } else {
      // Mise à jour d'un sous-titre existant
      updatedSubtitles[editIndex] = {
        ...editingSubtitle,
        language: editingSubtitle.language || language
      };
    }
    
    // Trier les sous-titres par ordre de départ
    updatedSubtitles.sort((a, b) => a.startTime - b.startTime);
    
    if (activeTab === 0) {
      setOriginalSubtitles(updatedSubtitles);
    } else {
      setNewSubtitles(updatedSubtitles);
    }
    
    setEditingSubtitle(null);
    setEditIndex(-1);
  };

  const deleteSubtitle = (index) => {
    if (activeTab === 0) {
      setOriginalSubtitles(originalSubtitles.filter((_, i) => i !== index));
    } else {
      setNewSubtitles(newSubtitles.filter((_, i) => i !== index));
    }
  };

  const handleChange = (field, value) => {
    setEditingSubtitle({ ...editingSubtitle, [field]: value });
  };

  const handleSaveAll = () => {
    onSave({
      original_subtitles: originalSubtitles,
      new_subtitles: newSubtitles
    });
    onClose();
  };

  const handleTimeChange = (field, value) => {
    handleChange(field, parseTime(value));
  };

  const addNewSubtitle = () => {
    setEditingSubtitle({
      startTime: 0,
      endTime: 0,
      text: '',
      language
    });
    setEditIndex(-1);
  };

  // Ajout : import JSON de sous-titres
  const handleImportJson = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          // On mappe le format fourni vers le format interne (text = title)
          const mapped = imported.map(s => ({
            startTime: s.startTime,
            endTime: s.endTime,
            text: s.title,
            durationSeconds: s.durationSeconds
          }));
          if (activeTab === 0) setOriginalSubtitles(mapped);
          else setNewSubtitles(mapped);
        }
      } catch (err) {
        alert('Erreur lors de l\'import du JSON : ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const currentSubtitles = activeTab === 0 ? originalSubtitles : newSubtitles;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, color: '#111827' }}>
        Gestion des sous-titres - {video?.title}
      </DialogTitle>
      
      <DialogContent sx={{ pb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          sx={{ mb: 3, borderBottom: '1px solid #e5e7eb' }}
        >
          <Tab label="Sous-titres originaux" />
          <Tab label="Sous-titres modifiés" />
        </Tabs>
        
        {/* Formulaire d'édition */}
        {editingSubtitle && (
          <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: '#f8fafc' }}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              {editIndex === -1 ? 'Ajouter un sous-titre' : 'Modifier le sous-titre'}
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
              <TextField
                label="Début (MM:SS.mmm)"
                value={formatTime(editingSubtitle.startTime)}
                onChange={(e) => handleTimeChange('startTime', e.target.value)}
                variant="outlined"
                fullWidth
                size="small"
              />
              <TextField
                label="Fin (MM:SS.mmm)"
                value={formatTime(editingSubtitle.endTime)}
                onChange={(e) => handleTimeChange('endTime', e.target.value)}
                variant="outlined"
                fullWidth
                size="small"
              />
              <FormControl fullWidth size="small">
                <InputLabel>Langue</InputLabel>
                <Select
                  value={editingSubtitle.language || language}
                  label="Langue"
                  onChange={(e) => handleChange('language', e.target.value)}
                >
                  <MenuItem value="fr">Français</MenuItem>
                  <MenuItem value="en">Anglais</MenuItem>
                  <MenuItem value="es">Espagnol</MenuItem>
                  <MenuItem value="de">Allemand</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <TextField
              label="Texte"
              value={editingSubtitle.text}
              onChange={(e) => handleChange('text', e.target.value)}
              variant="outlined"
              multiline
              rows={2}
              fullWidth
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button 
                startIcon={<CancelIcon />} 
                onClick={cancelEdit}
                variant="outlined"
                color="inherit"
              >
                Annuler
              </Button>
              <Button 
                startIcon={<SaveIcon />} 
                onClick={saveEdit}
                variant="contained"
                color="primary"
              >
                Enregistrer
              </Button>
            </Box>
          </Paper>
        )}
        
        {/* Liste des sous-titres */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {activeTab === 0 ? 'Sous-titres originaux' : 'Sous-titres modifiés'} ({currentSubtitles.length})
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<UploadFileIcon />}
              component="label"
              variant="outlined"
              color="secondary"
              size="small"
              disabled={!!editingSubtitle}
            >
              Importer JSON
              <input type="file" accept="application/json" hidden onChange={handleImportJson} />
            </Button>
            <Button 
              startIcon={<AddIcon />} 
              onClick={addNewSubtitle}
              variant="outlined"
              color="primary"
              size="small"
              disabled={!!editingSubtitle}
            >
              Ajouter
            </Button>
          </Box>
        </Box>
        
        {currentSubtitles.length === 0 && !editingSubtitle ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            Aucun sous-titre disponible
          </Typography>
        ) : (
          <Paper variant="outlined" sx={{ maxHeight: 400, overflow: 'auto' }}>
            <List disablePadding>
              {currentSubtitles.map((subtitle, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Divider />}
                  <ListItem 
                    sx={{ 
                      py: 1,
                      bgcolor: index % 2 === 0 ? 'transparent' : '#f8fafc'
                    }}
                    secondaryAction={
                      <Box>
                        <IconButton edge="end" aria-label="edit" onClick={() => startEditSubtitle(subtitle, index)} disabled={!!editingSubtitle}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteSubtitle(index)} disabled={!!editingSubtitle}>
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
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit" variant="outlined">
          Annuler
        </Button>
        <Button onClick={handleSaveAll} variant="contained" color="primary">
          Enregistrer les modifications
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubtitlesDialog;
