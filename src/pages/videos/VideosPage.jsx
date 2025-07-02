import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar, Stack, Chip, Tooltip } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import MusicNoteIcon from '@mui/icons-material/MusicNote'; 
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MovieIcon from '@mui/icons-material/Movie';
import WorkIcon from '@mui/icons-material/Work';

const platformIcons = {
  facebook: <FacebookIcon sx={{ fontSize: 16 }} />,
  instagram: <InstagramIcon sx={{ fontSize: 16 }} />,
  tiktok: <MusicNoteIcon sx={{ fontSize: 16 }} />,
  snapchat: <PhotoCameraIcon sx={{ fontSize: 16 }} />,
  shorts: <MovieIcon sx={{ fontSize: 16 }} />
};

const VideosPage = ({ videos }) => {
  return (
    <Box sx={{ width: '100%', minHeight: '100%', height: '100%', bgcolor: '#0f172a', p: { xs: 3, md: 4, lg: 6 }, overflowY: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color="#ffffff" mb={2}>
          Video Library
        </Typography>
        <Typography variant="body1" color="#94a3b8">
          Manage and track your video content across platforms
        </Typography>
      </Box>
      
      <Grid container spacing={{ xs: 3, sm: 4, md: 5, lg: 6 }}>
        {videos.map(video => (
          <Grid item xs={12} sm={6} lg={4} xl={3} key={video._id}>
            <Card sx={{ 
              height: '320px',
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
                <Stack direction="row" alignItems="flex-start" spacing={3} mb={4}>
                  <Avatar sx={{ 
                    bgcolor: '#1e40af', 
                    width: 64, 
                    height: 64,
                    boxShadow: '0 8px 32px 0 rgb(0 0 0 / 0.3)'
                  }}>
                    <Tooltip title="View video">
                      <a href={video.link} target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', textDecoration: 'none' }}>
                        <PlayCircleIcon sx={{ fontSize: 32 }} />
                      </a>
                    </Tooltip>
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h5" fontWeight={800} color="#ffffff" mb={2} noWrap>
                      {video.title}
                    </Typography>
                    <Typography variant="body1" color="#94a3b8" sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      wordBreak: 'break-all'
                    }}>
                      {video.link}
                    </Typography>
                  </Box>
                </Stack>
                  <Stack direction="row" spacing={2} mb={4} sx={{ flexWrap: 'wrap', gap: 2 }}>
                  {video.platforms_uploaded?.map(p => {
                    let icon;
                    switch(p) {
                      case 'facebook': icon = <FacebookIcon sx={{ fontSize: 16, mr: 0.5 }} />; break;
                      case 'instagram': icon = <InstagramIcon sx={{ fontSize: 16, mr: 0.5 }} />; break;
                      case 'tiktok': icon = <MusicNoteIcon sx={{ fontSize: 16, mr: 0.5 }} />; break;
                      case 'snapchat': icon = <PhotoCameraIcon sx={{ fontSize: 16, mr: 0.5 }} />; break;
                      case 'shorts': icon = <MovieIcon sx={{ fontSize: 16, mr: 0.5 }} />; break;
                      default: icon = null;
                    }
                    
                    return (
                      <Chip 
                        key={p}
                        icon={icon} 
                        label={p} 
                        size="medium" 
                        sx={{ 
                          bgcolor: '#334155', 
                          color: '#e2e8f0', 
                          fontWeight: 700,
                          textTransform: 'capitalize',
                          fontSize: '0.85rem',
                          height: 36,
                          px: icon ? 1 : 2
                        }} 
                      />
                    );
                  })}
                </Stack>
                
                <Box sx={{ mt: 'auto' }}>
                  <Chip 
                    label={video.status} 
                    size="medium" 
                    sx={{ 
                      bgcolor: video.status === 'uploaded' ? '#065f46' : video.status === 'splitted' ? '#92400e' : '#334155', 
                      color: video.status === 'uploaded' ? '#d1fae5' : video.status === 'splitted' ? '#fde68a' : '#e2e8f0', 
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      fontSize: '0.9rem',
                      height: 40,
                      px: 3,
                      width: '100%'
                    }} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}      </Grid>
    </Box>
  );
};

export default VideosPage;
