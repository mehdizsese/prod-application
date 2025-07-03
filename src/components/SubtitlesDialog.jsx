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
  DialogContentText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Snackbar from '@mui/material/Snackbar';
import TablePagination from '@mui/material/TablePagination';

// Fonction utilitaire pour formater le temps en secondes vers format MM:SS.mmm
const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const milliseconds = Math.floor((timeInSeconds % 1) * 1000);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
};

// Nouvelle fonction robuste pour parser le temps (accepte HH:MM:SS,mmm ou MM:SS.mmm ou nombre)
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

// Fonction pour parser un fichier SRT en objets sous-titres
function parseSRT(srtText, language) {
  const blocks = srtText.split(/\r?\n\r?\n/);
  const subtitles = [];
  for (const block of blocks) {
    const lines = block.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) continue;
    // Ignore l'index (première ligne)
    const timeLine = lines[1].includes('-->') ? lines[1] : lines[0];
    const textLines = lines[1].includes('-->') ? lines.slice(2) : lines.slice(1);
    const match = timeLine.match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
    if (!match) continue;
    const [ , start, end ] = match;
    subtitles.push({
      startTime: parseAnyTime(start),
      endTime: parseAnyTime(end),
      text: textLines.join(' '),
      language: language
    });
  }
  return subtitles;
}

const SubtitlesDialog = ({ open, onClose, video, onSave }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [originalSubtitles, setOriginalSubtitles] = useState(video?.original_subtitles || []);
  const [newSubtitles, setNewSubtitles] = useState(video?.new_subtitles || []);
  const [editingSubtitle, setEditingSubtitle] = useState(null);
  const [editIndex, setEditIndex] = useState(-1);
  const [language, setLanguage] = useState('fr');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  // Reset state when dialog opens
  useEffect(() => {
    if (open && video) {
      setOriginalSubtitles(video.original_subtitles || []);
      setNewSubtitles(video.new_subtitles || []);
      setEditingSubtitle(null);
      setEditIndex(-1);
      setActiveTab(0);
      setPage(0);
    }
  }, [open, video]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const startEditSubtitle = (subtitle, index) => {
    setEditingSubtitle({
      startTime: typeof subtitle.startTime === 'number' && !isNaN(subtitle.startTime) ? subtitle.startTime : 0,
      endTime: typeof subtitle.endTime === 'number' && !isNaN(subtitle.endTime) ? subtitle.endTime : 0,
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

  const askDeleteSubtitle = (index) => {
    setPendingDeleteIndex(index);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteIndex !== null) {
      if (activeTab === 0) {
        setOriginalSubtitles(originalSubtitles.filter((_, i) => i !== pendingDeleteIndex));
      } else {
        setNewSubtitles(newSubtitles.filter((_, i) => i !== pendingDeleteIndex));
      }
    }
    setConfirmOpen(false);
    setPendingDeleteIndex(null);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setPendingDeleteIndex(null);
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

  const getToken = () => localStorage.getItem('token') || '';

  const handleSaveAll = async () => {
    if (!video?._id) return;
    const type = activeTab === 0 ? 'original_subtitles' : 'new_subtitles';
    const subtitles = activeTab === 0 ? originalSubtitles : newSubtitles;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos/${video._id}/subtitles`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ subtitles, type })
      });
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde');
      setSnackbar({ open: true, message: 'Sous-titres enregistrés !' });
      onSave && onSave();
    } catch (e) {
      setSnackbar({ open: true, message: 'Erreur lors de la sauvegarde' });
    }
    onClose();
  };

  const handleTimeChange = (field, value) => {
    handleChange(field, parseAnyTime(value));
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

  // Ajout : import JSON ou SRT de sous-titres (robuste)
  const handleImportFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (ext === 'json') {
          const imported = JSON.parse(e.target.result);
          if (Array.isArray(imported)) {
            const mapped = imported.map(s => {
              const st = parseAnyTime(s.startTime);
              const et = parseAnyTime(s.endTime);
              if (isNaN(st) || isNaN(et)) return null;
              return {
                startTime: st,
                endTime: et,
                text: s.title || s.text || '',
                durationSeconds: s.durationSeconds,
                language: s.language || language
              };
            }).filter(Boolean);
            if (activeTab === 0) setOriginalSubtitles(mapped);
            else setNewSubtitles(mapped);
          }
        } else if (ext === 'srt') {
          const parsed = parseSRT(e.target.result, language);
          if (activeTab === 0) setOriginalSubtitles(parsed);
          else setNewSubtitles(parsed);
        } else {
          alert('Format non supporté. Utilisez un fichier .json ou .srt');
        }
      } catch (err) {
        alert('Erreur lors de l\'import : ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const currentSubtitles = activeTab === 0 ? originalSubtitles : newSubtitles;
  const paginatedSubtitles = currentSubtitles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
              Importer JSON/SRT
              <input type="file" accept=".json,.srt,application/json,text/srt" hidden onChange={handleImportFile} />
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
          <>
          <Paper variant="outlined" sx={{ maxHeight: 400, overflow: 'auto' }}>
            <List disablePadding>
              {paginatedSubtitles.map((subtitle, index) => (
                <React.Fragment key={page * rowsPerPage + index}>
                  {index > 0 && <Divider />}
                  <ListItem 
                    sx={{ py: 1, bgcolor: (page * rowsPerPage + index) % 2 === 0 ? 'transparent' : '#f8fafc' }}
                    secondaryAction={
                      <Box>
                        <IconButton edge="end" aria-label="edit" onClick={() => startEditSubtitle(subtitle, page * rowsPerPage + index)} disabled={!!editingSubtitle}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => askDeleteSubtitle(page * rowsPerPage + index)} disabled={!!editingSubtitle}>
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
          <TablePagination
            rowsPerPageOptions={[25, 50, 100, 200]}
            component="div"
            count={currentSubtitles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            sx={{ color: '#94a3b8', borderTop: '1px solid #334155', '.MuiTablePagination-toolbar': { px: 3 }, '.MuiTablePagination-select': { color: '#e2e8f0' }, '.MuiTablePagination-selectIcon': { color: '#94a3b8' }, '.MuiButtonBase-root': { color: '#3b82f6' } }}
          />
          </>
        )}
        
        {/* Dialog de confirmation suppression */}
        <Dialog open={confirmOpen} onClose={handleCancelDelete}>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Voulez-vous vraiment supprimer ce sous-titre ? Cette action est irréversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} color="inherit" variant="outlined">Annuler</Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">Supprimer</Button>
          </DialogActions>
        </Dialog>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit" variant="outlined">
          Annuler
        </Button>
        <Button onClick={handleSaveAll} variant="contained" color="primary">
          Enregistrer les modifications
        </Button>
      </DialogActions>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ open: false, message: '' })} message={snackbar.message} />
    </Dialog>
  );
};

export default SubtitlesDialog;
