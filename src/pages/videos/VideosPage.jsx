import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, IconButton, Stack, Tooltip, Menu, MenuItem, 
  TextField, InputAdornment, TablePagination, TableSortLabel, Avatar, Button
} from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import MusicNoteIcon from '@mui/icons-material/MusicNote'; 
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MovieIcon from '@mui/icons-material/Movie';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import VideoDialog from '../../components/VideoDialog';
import SubtitlesDialog from '../../components/SubtitlesDialog';

const statusColors = {
  uploaded: { bg: '#065f46', color: '#d1fae5' },
  splitted: { bg: '#92400e', color: '#fde68a' },
  processing: { bg: '#1e40af', color: '#dbeafe' },
  published: { bg: '#4c1d95', color: '#ede9fe' },
  new: { bg: '#334155', color: '#e2e8f0' },
  pending: { bg: '#4b5563', color: '#f9fafb' },
  generated: { bg: '#0369a1', color: '#e0f2fe' }
};

// Fonction supprimée car non utilisée dans le composant

const VideosPage = ({ videos, fetchAll }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('title');
  const [order, setOrder] = useState('asc');
  // anchorEl stocke l'élément ET la vidéo sélectionnée
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openSubtitles, setOpenSubtitles] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, video) => {
    setAnchorEl({ anchor: event.currentTarget, video });
    setSelectedVideo(video);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  // Ouvre la modale édition
  const handleEdit = () => {
    setOpenEdit(true);
    handleMenuClose();
  };
  const getToken = () => localStorage.getItem('token') || '';
  const handleDelete = async () => {
    if (!selectedVideo?._id) return;
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos/${selectedVideo._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
    });
    setConfirmDeleteOpen(false);
    setSelectedVideo(null);
    fetchAll();
  };
  // Ouvre la confirmation suppression
  const handleConfirmDelete = () => {
    setConfirmDeleteOpen(true);
    handleMenuClose();
  };
  const handleSubtitles = () => {
    setOpenSubtitles(true);
    handleMenuClose();
  };

  console.log('VIDEOS PAGE - vidéos reçues :', videos);

  // Filtrage adapté au nouveau modèle de données
  const filteredVideos = videos.filter(video =>
    video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.link?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (video.languages && Array.isArray(video.languages) && video.languages.some(lang => 
      lang.language?.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  const sortedVideos = filteredVideos.sort((a, b) => {
    let valueA = a[orderBy];
    let valueB = b[orderBy];
    if (typeof valueA === 'string') valueA = valueA.toLowerCase();
    if (typeof valueB === 'string') valueB = valueB.toLowerCase();
    if (valueA < valueB) return order === 'asc' ? -1 : 1;
    if (valueA > valueB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedVideos = sortedVideos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ width: '100%', minHeight: '100%', height: '100%', bgcolor: '#fff', p: { xs: 3, md: 4, lg: 6 }, overflowY: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} color="#18181b" mb={2} letterSpacing={1}>
          Bibliothèque de vidéos
        </Typography>
        <Typography variant="body1" color="#64748b" mb={4}>
          Gestion et suivi de vos vidéos sur différentes plateformes
        </Typography>
        <TextField
          placeholder="Rechercher des vidéos..."
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ bgcolor: '#f3f4f6', borderRadius: 2, mb: 2 }}
        />
      </Box>
      <TableContainer component={Paper} sx={{ bgcolor: '#fff', border: '1px solid #e5e7eb', borderRadius: 4, boxShadow: '0 2px 12px 0 #f1f5f9', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: '#fff' }}>
            <TableRow>
              <TableCell sx={{ color: '#18181b', fontWeight: 700, borderBottom: '1px solid #e5e7eb', py: 2 }}>
                <TableSortLabel
                  active={orderBy === 'title'}
                  direction={orderBy === 'title' ? order : 'asc'}
                  onClick={() => handleSort('title')}
                  sx={{ '&.MuiTableSortLabel-root': { color: '#18181b' }, '&.MuiTableSortLabel-root:hover': { color: '#374151' }, '&.Mui-active': { color: '#111827' }, '& .MuiTableSortLabel-icon': { color: '#111827' } }}
                >
                  Titre
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: '#18181b', fontWeight: 700, borderBottom: '1px solid #e5e7eb', py: 2 }}>Lien</TableCell>
              <TableCell sx={{ color: '#18181b', fontWeight: 700, borderBottom: '1px solid #e5e7eb', py: 2 }}>Statut</TableCell>
              <TableCell sx={{ color: '#18181b', fontWeight: 700, borderBottom: '1px solid #e5e7eb', py: 2 }}>Langues et Sous-titres</TableCell>
              <TableCell sx={{ color: '#18181b', fontWeight: 700, borderBottom: '1px solid #e5e7eb', py: 2 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedVideos.length > 0 ? (
              paginatedVideos.map((video) => (
                <TableRow key={video._id || video.title} sx={{ '&:hover': { bgcolor: '#f3f4f6' } }}>
                  <TableCell sx={{ color: '#18181b', fontWeight: 600, borderBottom: '1px solid #e5e7eb', py: 2.5 }}>
                    <Button 
                      component={Link}
                      to={`/videos/${video._id}`}
                      sx={{ 
                        textTransform: 'none', 
                        color: '#18181b', 
                        fontWeight: 600,
                        textAlign: 'left',
                        justifyContent: 'flex-start',
                        '&:hover': { color: '#3b82f6' }
                      }}
                    >
                      {video.title}
                    </Button>
                  </TableCell>
                  <TableCell sx={{ color: '#64748b', borderBottom: '1px solid #e5e7eb', py: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{video.link}</Typography>
                      <Tooltip title="Ouvrir le lien"><IconButton size="small" sx={{ ml: 1, color: '#64748b' }} href={video.link} target="_blank"><OpenInNewIcon sx={{ fontSize: 18 }} /></IconButton></Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e5e7eb', py: 2.5 }}>
                    <Chip label={video.status} size="small" sx={{ bgcolor: statusColors[video.status]?.bg || '#334155', color: statusColors[video.status]?.color || '#e2e8f0', fontWeight: 700, textTransform: 'capitalize', fontSize: '0.85rem' }} />
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #e5e7eb', py: 2.5 }}>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                      {video.languages && Array.isArray(video.languages) && video.languages.length > 0 ? (
                        video.languages.map(lang => {
                          const segmentCount = lang.items?.length || 0;
                          return (
                            <Tooltip key={lang.language} title={`${lang.language} (${segmentCount} segments)`} arrow>
                              <Chip 
                                label={`${lang.language.toUpperCase()} (${segmentCount})`} 
                                size="small" 
                                sx={{ 
                                  bgcolor: '#f3f4f6', 
                                  color: '#18181b', 
                                  mb: 1, 
                                  fontWeight: 700,
                                  border: '1px solid #e5e7eb'
                                }}
                                icon={<SubtitlesIcon sx={{ fontSize: '0.9rem' }} />}
                              />
                            </Tooltip>
                          );
                        })
                      ) : (
                        <Typography variant="body2" color="#64748b" fontStyle="italic">Aucune langue</Typography>
                      )}
                    </Stack>
                  </TableCell>                  <TableCell sx={{ borderBottom: '1px solid #e5e7eb', py: 2.5 }}>
                    <Stack direction="row" spacing={1}>
                      <IconButton 
                        aria-label="voir détails" 
                        size="small" 
                        sx={{ color: '#3b82f6' }}
                        component={Link}
                        to={`/videos/${video._id}`}
                      >
                        <PlayCircleIcon />
                      </IconButton>
                      <IconButton 
                        aria-label="supprimer" 
                        size="small" 
                        sx={{ color: '#ef4444' }}
                        onClick={() => {
                          setSelectedVideo(video);
                          setConfirmDeleteOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton aria-label="more actions" size="small" sx={{ color: '#94a3b8' }} onClick={(e) => handleMenuOpen(e, video)}>
                        <MoreVertIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: '#94a3b8', borderBottom: 'none' }}>
                  Aucune vidéo trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredVideos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ color: '#94a3b8', borderTop: '1px solid #e5e7eb', '.MuiTablePagination-toolbar': { px: 3 }, '.MuiTablePagination-select': { color: '#18181b' }, '.MuiTablePagination-selectIcon': { color: '#94a3b8' }, '.MuiButtonBase-root': { color: '#3b82f6' } }}
        />
      </TableContainer>
      {/* Menu contextuel actions vidéo */}
      <Menu anchorEl={anchorEl?.anchor} open={Boolean(anchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { bgcolor: '#fff', color: '#18181b', border: '1px solid #e5e7eb' } }}>
        <MenuItem onClick={handleEdit} sx={{ gap: 2 }}><EditIcon sx={{ fontSize: 18 }} /> Modifier</MenuItem>
        <MenuItem onClick={handleSubtitles} sx={{ gap: 2 }}><SubtitlesIcon sx={{ fontSize: 18 }} /> Gérer les sous-titres</MenuItem>
        <MenuItem onClick={handleConfirmDelete} sx={{ gap: 2, color: '#ef4444' }}><DeleteIcon sx={{ fontSize: 18 }} /> Supprimer</MenuItem>
      </Menu>
      {/* Dialog de confirmation suppression vidéo */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Voulez-vous vraiment supprimer cette vidéo ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="inherit" variant="outlined">Annuler</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Supprimer</Button>
        </DialogActions>
      </Dialog>
      {/* Dialog édition vidéo */}
      {openEdit && (
        <VideoDialog open={openEdit} onClose={() => setOpenEdit(false)} video={selectedVideo} onSave={fetchAll} onDelete={fetchAll} />
      )}
      {/* Dialog sous-titres */}
      {openSubtitles && (
        <SubtitlesDialog open={openSubtitles} onClose={() => setOpenSubtitles(false)} video={selectedVideo} onSave={fetchAll} />
      )}
    </Box>
  );
};

export default VideosPage;
