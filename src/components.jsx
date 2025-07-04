import React from 'react';
import { Card, CardContent, Typography, Grid, Avatar, Chip, Box, Stack, Tooltip, Button, Divider, Paper, LinearProgress } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WorkIcon from '@mui/icons-material/Work';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const platformIcons = {
  facebook: <FacebookIcon sx={{ color: '#1877f3' }} />,
  instagram: <InstagramIcon sx={{ color: '#e1306c' }} />
};

export function SocialAccounts({ accounts }) {
  return (
    <Box sx={{ width: '100%', height: '100%', bgcolor: '#ffffff', p: { xs: 3, md: 4, lg: 6 }, overflow: 'hidden' }}><Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color="#18181b" mb={2}>
          Social Accounts
        </Typography>
        <Typography variant="body1" color="#64748b">
          Manage your connected social media platforms
        </Typography>
      </Box>
        <Grid container spacing={{ xs: 3, sm: 4, md: 5, lg: 6 }}>
        {accounts.map(acc => (          <Grid item xs={12} sm={6} lg={4} xl={3} key={acc._id}>            <Card sx={{ 
              height: '280px',
              borderRadius: 6, 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)', 
              bgcolor: '#ffffff', 
              border: '1px solid #e5e7eb',
              transition: 'all 0.3s ease-in-out', 
              '&:hover': { 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)', 
                transform: 'translateY(-8px) scale(1.05)',
                borderColor: '#d1d5db'
              } 
            }}>
              <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" alignItems="flex-start" spacing={3} mb={4}>
                  <Avatar sx={{ 
                    bgcolor: acc.platform === 'facebook' ? '#1877f2' : '#e1306c', 
                    width: 64, 
                    height: 64,
                    boxShadow: '0 8px 32px 0 rgb(0 0 0 / 0.3)'
                  }}>
                    {platformIcons[acc.platform] || <WorkIcon sx={{ color: 'white', fontSize: 32 }} />}
                  </Avatar>                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h5" fontWeight={800} color="#18181b" mb={2} noWrap>
                      {acc.name || acc.username}
                    </Typography>
                    <Typography variant="body1" color="#64748b" sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {acc.description}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={3} mt="auto">                  <Chip 
                    label={acc.platform} 
                    size="medium" 
                    sx={{ 
                      bgcolor: '#f3f4f6', 
                      color: '#18181b', 
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      fontSize: '0.9rem',
                      height: 40,
                      px: 2
                    }} 
                  />
                  <Chip 
                    label={acc.language?.toUpperCase() || 'N/A'} 
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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export function VideosList({ videos }) {
  return (
    <Box sx={{ width: '100%', height: '100%', bgcolor: '#1e293b', p: { xs: 3, md: 4, lg: 6 }, overflow: 'hidden' }}><Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color="#ffffff" mb={2}>
          Video Library
        </Typography>
        <Typography variant="body1" color="#94a3b8">
          Manage and track your video content across platforms
        </Typography>
      </Box>
        <Grid container spacing={{ xs: 3, sm: 4, md: 5, lg: 6 }}>
        {videos.map(video => (
          <Grid item xs={12} sm={6} lg={4} xl={3} key={video._id}>            <Card sx={{ 
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
                  {video.platforms_uploaded?.map(p => (
                    <Chip 
                      key={p} 
                      label={p} 
                      size="medium" 
                      sx={{ 
                        bgcolor: '#334155', 
                        color: '#e2e8f0', 
                        fontWeight: 700,
                        textTransform: 'capitalize',
                        fontSize: '0.85rem',
                        height: 36,
                        px: 2
                      }} 
                    />
                  ))}
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
        ))}
      </Grid>
    </Box>
  );
}

export function WorkInfo({ info }) {
  const stats = [
    {
      title: 'Total Videos',
      value: (info.toSplit || 0) + (info.toUpload || 0),
      icon: <PlayCircleIcon sx={{ color: '#ffffff', fontSize: 32 }} />,
      bgcolor: '#1e40af',
      change: '+12%',
      positive: true
    },
    {
      title: 'To Process',
      value: info.toSplit || 0,
      icon: <CloudUploadIcon sx={{ color: '#ffffff', fontSize: 32 }} />,
      bgcolor: '#059669',
      change: '+2%',
      positive: true
    },
    {
      title: 'Pending Upload',
      value: info.toUpload || 0,
      icon: <TrendingUpIcon sx={{ color: '#ffffff', fontSize: 32 }} />,
      bgcolor: '#dc2626',
      change: '-5%',
      positive: false
    }
  ];

  return (
    <Box sx={{ width: '100%', height: '100%', bgcolor: '#1e293b', p: { xs: 3, md: 4, lg: 6 }, overflow: 'hidden' }}><Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color="#ffffff" mb={2}>
          Analytics & Insights
        </Typography>
        <Typography variant="body1" color="#94a3b8">
          Track your video performance and workflow metrics
        </Typography>
      </Box>
      
      {/* Stats Cards */}      <Grid container spacing={{ xs: 3, sm: 4, md: 5, lg: 6 }} mb={4}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card sx={{ 
              height: '200px',
              borderRadius: 6, 
              boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', 
              bgcolor: '#0f172a', 
              border: '1px solid #334155',
              transition: 'all 0.3s ease-in-out',
              '&:hover': { 
                boxShadow: '0 25px 50px -12px rgb(59 130 246 / 0.5)', 
                transform: 'translateY(-8px) scale(1.05)'
              }
            }}>
              <CardContent sx={{ p: 5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={4}>
                  <Avatar sx={{ bgcolor: stat.bgcolor, width: 72, height: 72, boxShadow: '0 8px 32px 0 rgb(0 0 0 / 0.3)' }}>
                    {stat.icon}
                  </Avatar>
                  <Chip 
                    label={stat.change} 
                    size="medium" 
                    sx={{ 
                      bgcolor: stat.positive ? '#065f46' : '#7f1d1d',
                      color: stat.positive ? '#d1fae5' : '#fecaca',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      height: 36,
                      px: 2
                    }} 
                  />
                </Stack>
                <Box sx={{ mt: 'auto' }}>                  <Typography variant="h3" fontWeight={700} color="#ffffff" mb={2}>
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" color="#94a3b8" fontWeight={700}>
                    {stat.title}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Progress Section */}
      <Grid container spacing={{ xs: 3, sm: 4, md: 5, lg: 6 }} mb={4}>
        <Grid item xs={12} lg={6}>          <Card sx={{ 
            height: '300px',
            borderRadius: 6, 
            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', 
            bgcolor: '#0f172a', 
            border: '1px solid #334155'
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 }, height: '100%' }}>
              <Typography variant="h5" fontWeight={700} color="#ffffff" mb={3}>
                Monthly Progress
              </Typography>
              <Stack spacing={6}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" mb={3}>
                    <Typography variant="h6" color="#94a3b8" fontWeight={700}>Videos Processed</Typography>
                    <Typography variant="h6" color="#ffffff" fontWeight={800}>75%</Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={75} 
                    sx={{ 
                      height: 16, 
                      borderRadius: 8, 
                      bgcolor: '#334155', 
                      '& .MuiLinearProgress-bar': { 
                        bgcolor: '#3b82f6',
                        borderRadius: 8
                      } 
                    }} 
                  />
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" mb={3}>
                    <Typography variant="h6" color="#94a3b8" fontWeight={700}>Active Accounts</Typography>
                    <Typography variant="h6" color="#ffffff" fontWeight={800}>90%</Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinated" 
                    value={90} 
                    sx={{ 
                      height: 16, 
                      borderRadius: 8, 
                      bgcolor: '#334155', 
                      '& .MuiLinearProgress-bar': { 
                        bgcolor: '#10b981',
                        borderRadius: 8
                      } 
                    }} 
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={6}>          <Card sx={{ 
            height: '300px',
            borderRadius: 6, 
            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', 
            bgcolor: '#0f172a', 
            border: '1px solid #334155'
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 }, height: '100%' }}>
              <Typography variant="h5" fontWeight={700} color="#ffffff" mb={3}>
                Recent Activity
              </Typography>                <Box sx={{ p: { xs: 3, sm: 4 }, bgcolor: '#1e293b', borderRadius: 4, border: '1px solid #334155', height: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6" fontWeight={700} color="#ffffff" mb={2}>
                  {info.lastVideo?.title || 'No recent videos'}
                </Typography>
                <Typography variant="body1" color="#94a3b8">
                  Published on {info.lastVideo?.platforms_uploaded?.join(', ') || 'no platforms'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
