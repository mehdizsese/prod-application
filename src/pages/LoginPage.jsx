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
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={8} sx={{ p: 5, borderRadius: 5, minWidth: 350, bgcolor: '#1e293b' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <LockIcon sx={{ fontSize: 48, color: '#3b82f6', mb: 1 }} />
          <Typography variant="h5" fontWeight={700} color="#fff">Connexion sécurisée</Typography>
          <Typography variant="body2" color="#94a3b8">Veuillez vous authentifier pour accéder à l'application</Typography>
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
                  <AccountCircle sx={{ color: '#3b82f6' }} />
                </InputAdornment>
              )
            }}
            autoFocus
            autoComplete="username"
            sx={{ input: { color: '#fff' } }}
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
                  <LockIcon sx={{ color: '#3b82f6' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(v => !v)} edge="end" tabIndex={-1}>
                    {showPassword ? <VisibilityOff sx={{ color: '#3b82f6' }} /> : <Visibility sx={{ color: '#3b82f6' }} />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            autoComplete="current-password"
            sx={{ input: { color: '#fff' } }}
          />
          {error && <Typography color="error" sx={{ mt: 1, mb: 1 }}>{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, bgcolor: '#3b82f6', fontWeight: 700, borderRadius: 3, py: 1.5 }}
          >
            Se connecter
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
