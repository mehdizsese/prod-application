import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar, Stack, Chip, LinearProgress } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import MusicNoteIcon from '@mui/icons-material/MusicNote'; // Pour TikTok
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'; // Pour Snapchat
import MovieIcon from '@mui/icons-material/Movie'; // Pour YouTube

const InsightsPage = ({ info }) => {
  if (!info) {
    return (
      <Box sx={{ width: '100%', minHeight: '100%', height: '100%', bgcolor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="#64748b">Chargement des statistiques...</Typography>
      </Box>
    );
  }
  
  // Cards pour les comptes sociaux
  const accountCards = [
    {
      title: 'Instagram',
      value: info.instagramAccounts || 0,
      subtitle: 'Comptes connectés',
      icon: 'instagram',
      color: '#e1306c'
    },
    {
      title: 'Facebook',
      value: info.facebookAccounts || 0,
      subtitle: 'Comptes connectés',
      icon: 'facebook',
      color: '#1877f2'
    },
    {
      title: 'YouTube',
      value: info.youtubeAccounts || 0,
      subtitle: 'Comptes connectés',
      icon: 'youtube',
      color: '#ff0000'
    },
    {
      title: 'TikTok',
      value: info.tiktokAccounts || 0,
      subtitle: 'Comptes connectés',
      icon: 'tiktok',
      color: '#000000'
    },
    {
      title: 'Snapchat',
      value: info.snapchatAccounts || 0,
      subtitle: 'Comptes connectés',
      icon: 'snapchat',
      color: '#fffc00'
    }
  ];
  
  // Cards pour les statistiques vidéo
  const videoCards = [
    {
      title: 'Total Vidéos',
      value: typeof info.totalVideos === 'number' ? info.totalVideos : '-',
      subtitle: 'Toutes les vidéos',
      bgcolor: '#64748b',
      change: info.videosChangePercent ? `${info.videosChangePercent}%` : '+0%',
      positive: info.videosChangePercent > 0
    },
    {
      title: 'Vidéos traitées',
      value: typeof info.processedVideos === 'number' ? info.processedVideos : '-',
      subtitle: 'Vidéos déjà uploadées',
      bgcolor: '#059669',
      change: '+2%',
      positive: true
    },
    {
      title: 'Sous-titres générés',
      value: typeof info.subtitlesCount === 'number' ? info.subtitlesCount : '-',
      subtitle: 'Nombre de sous-titres',
      bgcolor: '#0891b2',
      change: '+8%',
      positive: true
    },
    {
      title: 'Langues disponibles',
      value: typeof info.languagesCount === 'number' ? info.languagesCount : '-',
      subtitle: 'Nombre de langues',
      bgcolor: '#7c3aed',
      change: '+5%',
      positive: true
    }
  ];

  return (
    <Box sx={{ width: '100%', minHeight: '100%', height: '100%', bgcolor: '#fff', p: { xs: 3, md: 4, lg: 6 }, overflowY: 'auto' }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <InsightsIcon sx={{ fontSize: 36, color: '#18181b' }} />
        <Typography variant="h4" fontWeight={800} color="#18181b" letterSpacing={1}>
          Dashboard
        </Typography>
      </Box>
      <Typography variant="body1" color="#64748b" mb={4}>
        Vue d'ensemble de l'activité de vos vidéos et comptes sociaux
      </Typography>
      
      {/* Statistiques vidéos */}
      <Typography variant="h5" fontWeight={700} color="#18181b" mb={3}>
        Statistiques des Vidéos
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 5 }}>
        {videoCards.map((card, idx) => (
          <Box key={idx} sx={{
            flex: '1 1 220px',
            minWidth: 220,
            bgcolor: '#fff',
            borderRadius: 4,
            boxShadow: '0 2px 12px 0 #f1f5f9',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 1,
            border: '1px solid #e5e7eb',
          }}>
            <Typography variant="h6" fontWeight={700} color="#18181b">{card.title}</Typography>
            <Typography variant="h4" fontWeight={800} color="#18181b">{card.value}</Typography>
            <Typography variant="body2" color="#64748b">{card.subtitle}</Typography>
          </Box>
        ))}
      </Box>

      {/* Statistiques comptes sociaux */}
      <Typography variant="h5" fontWeight={700} color="#18181b" mb={3}>
        Comptes Réseaux Sociaux
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 5 }}>
        {accountCards.map((card, idx) => (
          <Box key={idx} sx={{
            flex: '1 1 200px',
            minWidth: 180,
            maxWidth: 220,
            bgcolor: '#fff',
            borderRadius: 4,
            boxShadow: '0 2px 12px 0 #f1f5f9',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 1,
            border: '1px solid #e5e7eb',
          }}>
            <Avatar sx={{ bgcolor: card.color + '15', color: card.color, mb: 2 }}>
              {card.icon === 'instagram' && <InstagramIcon />}
              {card.icon === 'facebook' && <FacebookIcon />}
              {card.icon === 'youtube' && <MovieIcon />}
              {card.icon === 'tiktok' && <MusicNoteIcon />}
              {card.icon === 'snapchat' && <PhotoCameraIcon />}
            </Avatar>
            <Typography variant="h6" fontWeight={700} color="#18181b">{card.title}</Typography>
            <Typography variant="h4" fontWeight={800} color="#18181b">{card.value}</Typography>
            <Typography variant="body2" color="#64748b">{card.subtitle}</Typography>
          </Box>
        ))}
      </Box>

      {/* Progress Section */}
      <Grid container spacing={{ xs: 3, sm: 4, md: 5, lg: 6 }} mb={4}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ 
            height: '300px',
            borderRadius: 6, 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)', 
            bgcolor: '#ffffff', 
            border: '1px solid #e5e7eb'
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 }, height: '100%' }}>
              <Typography variant="h5" fontWeight={700} color="#18181b" mb={3}>
                Progression Mensuelle
              </Typography>
              <Stack spacing={6}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" mb={3}>
                    <Typography variant="body1" color="#64748b" fontWeight={600}>Vidéos Traitées</Typography>
                    <Typography variant="body1" color="#18181b" fontWeight={700}>75%</Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={75} 
                    sx={{ 
                      height: 16, 
                      borderRadius: 8,
                      bgcolor: 'rgba(100,116,139,0.1)',
                      '.MuiLinearProgress-bar': {
                        bgcolor: '#64748b',
                        borderRadius: 8
                      }
                    }}
                  />
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" mb={3}>
                    <Typography variant="body1" color="#64748b" fontWeight={600}>Sous-titres Générés</Typography>
                    <Typography variant="body1" color="#18181b" fontWeight={700}>68%</Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={68} 
                    sx={{ 
                      height: 16, 
                      borderRadius: 8,
                      bgcolor: 'rgba(100,116,139,0.1)',
                      '.MuiLinearProgress-bar': {
                        bgcolor: '#0891b2',
                        borderRadius: 8
                      }
                    }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Activité Récente */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ 
            height: '300px',
            borderRadius: 6, 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)', 
            bgcolor: '#ffffff', 
            border: '1px solid #e5e7eb'
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 }, height: '100%' }}>
              <Typography variant="h5" fontWeight={700} color="#18181b" mb={3}>
                Activité Récente
              </Typography>
              <Box sx={{ p: { xs: 3, sm: 4 }, bgcolor: '#f8fafc', borderRadius: 4, border: '1px solid #e5e7eb', height: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6" fontWeight={700} color="#18181b" mb={2}>
                  {info.lastVideo?.title || 'Aucune vidéo récente'}
                </Typography>
                <Typography variant="body1" color="#64748b">
                  Publiée sur {info.lastVideo?.platforms_uploaded?.join(', ') || 'aucune plateforme'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InsightsPage;
