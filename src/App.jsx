import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, AppBar, Typography, IconButton, Button } from '@mui/material';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import InsightsIcon from '@mui/icons-material/Insights';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';

// Importation des pages
import VideosPage from './pages/videos/VideosPage';
import AccountsPage from './pages/accounts/AccountsPage';
import SettingsPage from './pages/settings/SettingsPage';
import InsightsPage from './pages/insights/InsightsPage';
import LoginPage from './pages/LoginPage';

// Importation des composants de dialogue
import VideoDialog from './components/VideoDialog';
import AccountDialog from './components/AccountDialog';

const drawerWidth = 240;

const TABS = [
  { label: 'Insights', icon: <InsightsIcon /> },
  { label: 'Vidéos', icon: <VideoLibraryIcon /> },
  { label: 'Comptes', icon: <AccountCircleIcon /> },
  { label: 'Paramètres', icon: <SettingsIcon /> },
];

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = 'https://social-media-manager-t3yg.onrender.com';

function App() {
  const [tab, setTab] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [workInfo, setWorkInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openAddAccount, setOpenAddAccount] = useState(false);
  const [openAddVideo, setOpenAddVideo] = useState(false);
  const [newAccount, setNewAccount] = useState({ platform: '', name: '', username: '', description: '', language: '', appId: '', accessToken: '' });
  const [newVideo, setNewVideo] = useState({ title: '', link: '', status: '', platforms_uploaded: [] });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    fetchAll();
  }, []);

  async function login(username, password) {
    setLoginError('');
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('Identifiants invalides');
      const data = await res.json();
      setToken(data.token);
    } catch (e) {
      setLoginError(e.message || 'Erreur de connexion');
    }
  }

  // Ajout du token dans les requêtes API protégées
  async function fetchAll() {
    setLoading(true);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const [accRes, vidRes, infoRes] = await Promise.all([
      fetch(`${API_URL}/api/social-accounts`, { headers }),
      fetch(`${API_URL}/api/videos`, { headers }),
      fetch(`${API_URL}/api/work-info`, { headers }),
    ]);
    const accountsData = await accRes.json();
    const videosData = await vidRes.json();
    const workInfoData = await infoRes.json();
    console.log('FRONT - Comptes récupérés :', accountsData);
    console.log('FRONT - Vidéos récupérées :', videosData);
    console.log('FRONT - WorkInfo récupéré :', workInfoData);
    setAccounts(accountsData);
    setVideos(videosData);
    setWorkInfo(workInfoData);
    setLoading(false);
  }

  async function handleAddAccount() {
    await fetch(`${API_URL}/api/social-accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAccount)
    });
    setOpenAddAccount(false);
    setNewAccount({ platform: '', name: '', username: '', description: '', language: '', appId: '', accessToken: '' });
    fetchAll();
  }
  async function handleAddVideo() {
    await fetch(`${API_URL}/api/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVideo)
    });
    setOpenAddVideo(false);
    setNewVideo({ title: '', link: '', status: '', platforms_uploaded: [] });
    fetchAll();
  }

  // Rendu du contenu en fonction de l'onglet sélectionné
  const renderTabContent = () => {
    if (loading) {
      return (
        <Box className="loading-container">
          <Typography variant="h6" color="#94a3b8">Loading...</Typography>
        </Box>
      );
    }

    switch (tab) {
      case 0:
        return <InsightsPage info={workInfo} />;
      case 1:
        return <VideosPage videos={videos} />;
      case 2:
        return <AccountsPage accounts={accounts} />;
      case 3:
        return <SettingsPage />;
      default:
        return <InsightsPage info={workInfo} />;
    }
  };

  if (!token) {
    return <LoginPage onLogin={login} error={loginError} />;
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      bgcolor: '#0f172a', 
      minHeight: '100vh', 
      width: '100%', 
      position: 'absolute', 
      top: 0, 
      bottom: 0, 
      left: 0, 
      right: 0,
      overflow: 'hidden' 
    }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#1e293b', boxShadow: 'none', borderBottom: '1px solid #334155' }}>
        <Toolbar sx={{ px: 4 }}>
          <IconButton color="inherit" edge="start" sx={{ mr: 2, color: '#e2e8f0' }}><MenuIcon /></IconButton>
          <Typography variant="h5" noWrap sx={{ flexGrow: 1, color: '#ffffff', fontWeight: 800 }}>Social Video Manager</Typography>
          {token && (
            <Button onClick={() => setToken('')} sx={{ ml: 2, bgcolor: '#334155', color: '#fff', borderRadius: 3, px: 3, py: 1, fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: '#3b82f6' } }}>
              Se déconnecter
            </Button>
          )}
          {tab === 1 && (
            <Button variant="contained" sx={{ bgcolor: '#3b82f6', color: 'white', textTransform: 'none', fontWeight: 600, borderRadius: 3, px: 4, py: 1.5 }} startIcon={<AddIcon />} onClick={() => setOpenAddVideo(true)}>Ajouter une vidéo</Button>
          )}
          {tab === 2 && (
            <Button variant="contained" sx={{ bgcolor: '#3b82f6', color: 'white', textTransform: 'none', fontWeight: 600, borderRadius: 3, px: 4, py: 1.5 }} startIcon={<AddIcon />} onClick={() => setOpenAddAccount(true)}>Ajouter un compte</Button>
          )}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#1e293b', borderRight: '1px solid #334155' } }}>
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 3, bgcolor: '#1e293b', height: '100%' }}>
          <List sx={{ '& .MuiListItem-root': { mb: 2 } }}>
            {TABS.map((tabItem, idx) => (
              <ListItem 
                button 
                key={tabItem.label} 
                selected={tab === idx} 
                onClick={() => setTab(idx)} 
                sx={{ 
                  borderRadius: 4, 
                  bgcolor: tab === idx ? '#3b82f6' : 'transparent', 
                  color: tab === idx ? '#ffffff' : '#94a3b8',
                  '&:hover': { bgcolor: tab === idx ? '#3b82f6' : '#334155' },
                  '&.Mui-selected': { bgcolor: '#3b82f6' },
                  py: 2,
                  px: 3
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{tabItem.icon}</ListItemIcon>
                <ListItemText primary={tabItem.label} sx={{ '& .MuiTypography-root': { fontWeight: tab === idx ? 700 : 600, fontSize: '1rem' } }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ 
        flexGrow: 1, 
        bgcolor: '#0f172a', 
        minHeight: '100vh', 
        height: '100vh', 
        overflow: 'auto', 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%',
      }}>
        <Toolbar />
        <Box sx={{ 
          flexGrow: 1, 
          width: '100%', 
          minHeight: 'calc(100vh - 64px)', 
          p: 0, 
          maxWidth: '100%', 
          overflowX: 'hidden',
          overflowY: 'auto',
          bgcolor: '#0f172a',
        }}>
          {renderTabContent()}
        </Box>
      </Box>

      {/* Dialogues modaux pour l'ajout de vidéos et de comptes */}
      <VideoDialog 
        open={openAddVideo}
        onClose={() => setOpenAddVideo(false)}
        video={newVideo}
        onSave={async (video) => {
          setOpenAddVideo(false);
          setNewVideo({ title: '', link: '', status: '', platforms_uploaded: [] });
          await fetch(`${API_URL}/api/videos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(video)
          });
          fetchAll();
        }}
      />

      <AccountDialog 
        open={openAddAccount}
        onClose={() => setOpenAddAccount(false)}
        account={newAccount}
        onSave={async (account) => {
          setOpenAddAccount(false);
          setNewAccount({ platform: '', name: '', username: '', description: '', language: '', appId: '', accessToken: '' });
          await fetch(`${API_URL}/api/social-accounts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(account)
          });
          fetchAll();
        }}
      />
    </Box>
  );
}

export default App;
