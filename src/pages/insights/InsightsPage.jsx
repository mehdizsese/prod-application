import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar, Stack, Chip, LinearProgress } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';

const InsightsPage = ({ info }) => {
  if (!info) {
    return (
      <Box sx={{ width: '100%', minHeight: '100%', height: '100%', bgcolor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="#94a3b8">Chargement des statistiques...</Typography>
      </Box>
    );
  }
  const cards = [
    {
      title: 'Comptes actifs',
      value: typeof info.accountsCount === 'number' ? info.accountsCount : '-',
      subtitle: 'Nombre de comptes connectés',
      bgcolor: '#1e40af',
      change: '+12%',
      positive: true
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
      title: 'Vidéos à traiter',
      value: typeof info.toSplit === 'number' ? info.toSplit : '-',
      subtitle: 'Vidéos à découper',
      bgcolor: '#dc2626',
      change: '-5%',
      positive: false
    },
    {
      title: 'En attente upload',
      value: typeof info.toUpload === 'number' ? info.toUpload : '-',
      subtitle: 'Vidéos prêtes à uploader',
      bgcolor: '#f97316',
      change: '-1%',
      positive: false
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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {cards.map((card, idx) => (
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

      {/* Progress Section */}
      <Grid container spacing={{ xs: 3, sm: 4, md: 5, lg: 6 }} mb={4}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ 
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
                    <Typography variant="body1" color="#94a3b8" fontWeight={600}>Videos Processed</Typography>
                    <Typography variant="body1" color="#ffffff" fontWeight={700}>75%</Typography>
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
                    <Typography variant="body1" color="#94a3b8" fontWeight={600}>Active Accounts</Typography>
                    <Typography variant="body1" color="#ffffff" fontWeight={700}>90%</Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
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
        <Grid item xs={12} lg={6}>
          <Card sx={{ 
            height: '300px',
            borderRadius: 6, 
            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', 
            bgcolor: '#0f172a', 
            border: '1px solid #334155'
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 }, height: '100%' }}>
              <Typography variant="h5" fontWeight={700} color="#ffffff" mb={3}>
                Recent Activity
              </Typography>
              <Box sx={{ p: { xs: 3, sm: 4 }, bgcolor: '#1e293b', borderRadius: 4, border: '1px solid #334155', height: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
};

export default InsightsPage;
