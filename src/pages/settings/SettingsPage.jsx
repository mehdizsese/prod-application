import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

const SettingsPage = () => {
  return (
    <Box sx={{ width: '100%', minHeight: '100%', height: '100%', bgcolor: '#0f172a', p: { xs: 3, md: 4, lg: 6 }, overflowY: 'auto' }}>
      <Paper sx={{ p: { xs: 3, sm: 4, md: 6 }, borderRadius: 4, boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', border: '1px solid #334155', bgcolor: '#0f172a' }}>
        <Typography variant="h4" fontWeight={700} color="#ffffff" mb={3}>Settings</Typography>
        <Divider sx={{ mb: 6, borderColor: '#334155' }} />
        <Typography variant="h6" color="#94a3b8">Configuration panel coming soon...</Typography>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
