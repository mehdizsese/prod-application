import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar, Stack, Chip, Button } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import MusicNoteIcon from '@mui/icons-material/MusicNote'; 
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MovieIcon from '@mui/icons-material/Movie';
import WorkIcon from '@mui/icons-material/Work';
import AccountDialog from '../../components/AccountDialog';

const platformIcons = {
  facebook: <FacebookIcon sx={{ color: '#1877f3' }} />,
  instagram: <InstagramIcon sx={{ color: '#e1306c' }} />,
  tiktok: <MusicNoteIcon sx={{ color: '#00f2ea' }} />,
  snapchat: <PhotoCameraIcon sx={{ color: '#fffc00' }} />,
  shorts: <MovieIcon sx={{ color: '#ff0000' }} />
};

const AccountsPage = ({ accounts, fetchAll }) => {
  const [selectedAccount, setSelectedAccount] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleEdit = (acc) => {
    setSelectedAccount(acc);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAccount(null);
  };
  const getToken = () => localStorage.getItem('token') || '';
  const handleDelete = async (acc) => {
    if (!acc?._id) return;
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/social-accounts/${acc._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
    });
    setOpenDialog(false);
    setSelectedAccount(null);
    if (fetchAll) fetchAll();
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100%', height: '100%', bgcolor: '#fff', p: { xs: 3, md: 4, lg: 6 }, overflowY: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} color="#18181b" mb={2} letterSpacing={1}>
          Comptes réseaux sociaux
        </Typography>
        <Typography variant="body1" color="#64748b" mb={4}>
          Gérez vos comptes connectés à vos plateformes sociales
        </Typography>
      </Box>
      
      <Grid container spacing={{ xs: 3, sm: 4, md: 5, lg: 6 }}>
        {accounts.map(acc => (
          <Grid item xs={12} sm={6} lg={4} xl={3} key={acc._id}>
            <Card sx={{ 
              height: '280px',
              borderRadius: 6, 
              boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', 
              bgcolor: '#0f172a', 
              border: '1px solid #334155',
              transition: 'all 0.3s ease-in-out', 
              '&:hover': { 
                boxShadow: '0 25px 50px -12px rgb(59 130 246 / 0.5)', 
                transform: 'translateY(-8px) scale(1.05)',
                borderColor: '#3b82f6'
              } 
            }}>
              <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" alignItems="flex-start" spacing={3} mb={4}>                  <Avatar sx={{ 
                    bgcolor: 
                      acc.platform === 'facebook' ? '#1877f2' : 
                      acc.platform === 'instagram' ? '#e1306c' : 
                      acc.platform === 'tiktok' ? '#000000' : 
                      acc.platform === 'snapchat' ? '#fffc00' :
                      acc.platform === 'shorts' ? '#ff0000' : '#4b5563', 
                    width: 64, 
                    height: 64,
                    boxShadow: '0 8px 32px 0 rgb(0 0 0 / 0.3)'
                  }}>
                    {platformIcons[acc.platform] || <WorkIcon sx={{ color: 'white', fontSize: 32 }} />}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h5" fontWeight={800} color="#ffffff" mb={2} noWrap>
                      {acc.name || acc.username}
                    </Typography>
                    <Typography variant="body1" color="#94a3b8" sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {acc.description}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={3} mt="auto">
                  <Chip 
                    label={acc.platform} 
                    size="medium" 
                    sx={{ 
                      bgcolor: '#334155', 
                      color: '#e2e8f0', 
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      fontSize: '0.9rem',
                      height: 40,
                      px: 2
                    }} 
                  />                  <Chip 
                    label={
                      acc.language === 'fr' ? 'Français' : 
                      acc.language === 'en' ? 'Anglais' :
                      acc.language === 'es' ? 'Espagnol' :
                      acc.language === 'ar' ? 'Arabe' :
                      acc.language === 'zh' ? 'Chinois' :
                      acc.language?.toUpperCase() || 'N/A'
                    } 
                    size="medium" 
                    sx={{ 
                      bgcolor: '#065f46', 
                      color: '#d1fae5', 
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      height: 40,
                      px: 2
                    }} 
                  />
                </Stack>
                <Button onClick={() => handleEdit(acc)} color="primary" variant="outlined" sx={{ mt: 2 }}>Modifier / Supprimer</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}      </Grid>
      {/* Dialog édition/suppression compte */}
      {openDialog && (
        <AccountDialog open={openDialog} onClose={handleCloseDialog} account={selectedAccount} onSave={handleCloseDialog} onDelete={handleDelete} />
      )}
    </Box>
  );
};

export default AccountsPage;
