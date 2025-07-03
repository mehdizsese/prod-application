import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, IconButton, Stack, Tooltip, Menu, MenuItem, 
  TextField, InputAdornment, TablePagination, TableSortLabel, Avatar
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

const statusColors = {
  uploaded: { bg: '#065f46', color: '#d1fae5' },
  splitted: { bg: '#92400e', color: '#fde68a' },
  processing: { bg: '#1e40af', color: '#dbeafe' },
  published: { bg: '#4c1d95', color: '#ede9fe' },
  new: { bg: '#334155', color: '#e2e8f0' }
};

const VideosPage = ({ videos }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('title');
  const [order, setOrder] = useState('asc');
  const [anchorEl, setAnchorEl] = useState(null);

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

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  console.log('VIDEOS PAGE - vidéos reçues :', videos);

  // Adapté à la nouvelle structure
  const filteredVideos = videos.filter(video =>
    video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.link?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (video.languages && video.languages.some(lang => lang.language?.toLowerCase().includes(searchTerm.toLowerCase())))
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
    <Box sx={{ width: '100%', minHeight: '100%', height: '100%', bgcolor: '#0f172a', p: { xs: 3, md: 4, lg: 6 }, overflowY: 'auto' }}>
      {/* Affichage brut pour debug UTF-8/arabe */}
      <Box sx={{ mb: 2, bgcolor: '#1e293b', color: '#fbbf24', p: 2, borderRadius: 2, fontSize: 13, fontFamily: 'monospace', overflowX: 'auto' }}>
        <strong>Debug vidéos (JSON):</strong>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', direction: 'rtl' }}>{JSON.stringify(videos, null, 2)}</pre>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color="#ffffff" mb={2}>
          Bibliothèque de vidéos
        </Typography>
        <Typography variant="body1" color="#94a3b8" mb={4}>
          Gestion et suivi de vos vidéos sur différentes plateformes
        </Typography>
        <TextField
          placeholder="Rechercher des vidéos..."
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 4, '& .MuiOutlinedInput-root': { bgcolor: '#1e293b', borderRadius: 3, '& fieldset': { borderColor: '#334155' }, '&:hover fieldset': { borderColor: '#475569' }, '&.Mui-focused fieldset': { borderColor: '#3b82f6' } }, '& .MuiOutlinedInput-input': { color: '#e2e8f0', py: 1.5, px: 2 } }}
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: '#64748b' }} /></InputAdornment>) }}
        />
      </Box>
      <TableContainer component={Paper} sx={{ bgcolor: '#1e293b', borderRadius: 4, boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: '#0f172a' }}>
            <TableRow>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, borderBottom: '1px solid #334155', py: 2 }}>
                <TableSortLabel
                  active={orderBy === 'title'}
                  direction={orderBy === 'title' ? order : 'asc'}
                  onClick={() => handleSort('title')}
                  sx={{ '&.MuiTableSortLabel-root': { color: '#94a3b8' }, '&.MuiTableSortLabel-root:hover': { color: '#e2e8f0' }, '&.Mui-active': { color: '#3b82f6' }, '& .MuiTableSortLabel-icon': { color: '#3b82f6' } }}
                >
                  Titre
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, borderBottom: '1px solid #334155', py: 2 }}>Lien</TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, borderBottom: '1px solid #334155', py: 2 }}>Statut</TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, borderBottom: '1px solid #334155', py: 2 }}>Langues</TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, borderBottom: '1px solid #334155', py: 2 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedVideos.length > 0 ? (
              paginatedVideos.map((video) => (
                <TableRow key={video._id || video.title} sx={{ '&:hover': { bgcolor: '#0f172a' } }}>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 600, borderBottom: '1px solid #334155', py: 2.5 }}>{video.title}</TableCell>
                  <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid #334155', py: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{video.link}</Typography>
                      <Tooltip title="Ouvrir le lien"><IconButton size="small" sx={{ ml: 1, color: '#64748b' }} href={video.link} target="_blank"><OpenInNewIcon sx={{ fontSize: 18 }} /></IconButton></Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #334155', py: 2.5 }}>
                    <Chip label={video.status} size="small" sx={{ bgcolor: statusColors[video.status]?.bg || '#334155', color: statusColors[video.status]?.color || '#e2e8f0', fontWeight: 700, textTransform: 'capitalize', fontSize: '0.85rem' }} />
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #334155', py: 2.5 }}>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                      {video.languages?.map(lang => (
                        <Tooltip key={lang.language} title={lang.language} arrow>
                          <Chip label={lang.language.toUpperCase()} size="small" sx={{ bgcolor: '#334155', color: '#e2e8f0', mb: 1 }} />
                        </Tooltip>
                      ))}
                      {!video.languages?.length && (
                        <Typography variant="body2" color="#64748b" fontStyle="italic">Aucune langue</Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #334155', py: 2.5 }}>
                    <IconButton aria-label="more actions" size="small" sx={{ color: '#94a3b8' }} onClick={(e) => handleMenuOpen(e, video)}>
                      <MoreVertIcon />
                    </IconButton>
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
          sx={{ color: '#94a3b8', borderTop: '1px solid #334155', '.MuiTablePagination-toolbar': { px: 3 }, '.MuiTablePagination-select': { color: '#e2e8f0' }, '.MuiTablePagination-selectIcon': { color: '#94a3b8' }, '.MuiButtonBase-root': { color: '#3b82f6' } }}
        />
      </TableContainer>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { bgcolor: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' } }}>
        <MenuItem onClick={handleMenuClose} sx={{ gap: 2 }}><EditIcon sx={{ fontSize: 18 }} /> Modifier</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ gap: 2 }}><SubtitlesIcon sx={{ fontSize: 18 }} /> Gérer les sous-titres</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ gap: 2, color: '#ef4444' }}><DeleteIcon sx={{ fontSize: 18 }} /> Supprimer</MenuItem>
      </Menu>
    </Box>
  );
};

export default VideosPage;
