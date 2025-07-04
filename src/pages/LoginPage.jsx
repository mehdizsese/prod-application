import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, InputAdornment, IconButton } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function LoginPage({ onLogin, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 5, borderRadius: 3, minWidth: 350, bgcolor: '#ffffff', border: '1px solid #e5e7eb' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <LockIcon sx={{ fontSize: 48, color: '#64748b', mb: 1 }} />
          <Typography variant="h5" fontWeight={700} color="#18181b">Connexion sécurisée</Typography>
          <Typography variant="body2" color="#64748b">Veuillez vous authentifier pour accéder à l'application</Typography>
        </Box>
        <form onSubmit={e => { e.preventDefault(); onLogin(username, password); }}>
          <TextField
            label="Nom d'utilisateur"
            fullWidth
            margin="normal"
            value={username}
            onChange={e => setUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle sx={{ color: '#64748b' }} />
                </InputAdornment>
              )
            }}
            autoFocus
            autoComplete="username"
          />
          <TextField
            label="Mot de passe"
            fullWidth
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#64748b' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(v => !v)} edge="end" tabIndex={-1}>
                    {showPassword ? <VisibilityOff sx={{ color: '#64748b' }} /> : <Visibility sx={{ color: '#64748b' }} />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            autoComplete="current-password"
          />
          {error && <Typography color="error" sx={{ mt: 1, mb: 1 }}>{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 2, 
              bgcolor: '#e5e7eb', 
              color: '#18181b',
              fontWeight: 700, 
              borderRadius: 3, 
              py: 1.5,
              '&:hover': {
                bgcolor: '#d1d5db',
              } 
            }}
          >
            Se connecter
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
