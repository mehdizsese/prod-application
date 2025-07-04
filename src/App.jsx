import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Toolbar, AppBar, Typography, IconButton, Button } from '@mui/material';
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
import DashboardPage from './pages/insights/InsightsPage'; // renommé
import LoginPage from './pages/LoginPage';

// Importation des composants de dialogue
import VideoDialog from './components/VideoDialog';
import AccountDialog from './components/AccountDialog';

const drawerWidth = 240;

const TABS = [
  { label: 'Dashboard', icon: <InsightsIcon /> },
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
          <Typography variant="h6" color="#64748b">Loading...</Typography>
        </Box>
      );
    }

    switch (tab) {
      case 0:
        return <DashboardPage info={workInfo} />;
      case 1:
        return <VideosPage videos={videos} />;
      case 2:
        return <AccountsPage accounts={accounts} />;
      case 3:
        return <SettingsPage />;
      default:
        return <DashboardPage info={workInfo} />;
    }
  };

  if (!token) {
    return <LoginPage onLogin={login} error={loginError} />;
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      bgcolor: '#ffffff', 
      minHeight: '100vh', 
      width: '100%', 
      position: 'absolute', 
      top: 0, 
      bottom: 0, 
      left: 0, 
      right: 0,
      overflow: 'hidden' 
    }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#ffffff', boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.05)', borderBottom: '1px solid #e5e7eb' }}>
        <Toolbar sx={{ px: 4, minHeight: 64 }}>
          <Typography variant="h5" noWrap sx={{ flexGrow: 0, color: '#22223b', fontWeight: 800, mr: 4, letterSpacing: 1 }}>Social Video Manager</Typography>
          {/* Navigation principale sous forme de Tabs horizontaux */}
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {TABS.map((tabItem, idx) => (
                <Button
                  key={tabItem.label}
                  onClick={() => setTab(idx)}
                  startIcon={tabItem.icon}
                  sx={{
                    color: tab === idx ? '#18181b' : '#64748b',
                    bgcolor: tab === idx ? '#f3f4f6' : 'transparent',
                    fontWeight: tab === idx ? 700 : 600,
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#f1f5f9', color: '#18181b' }
                  }}
                >
                  {tabItem.label}
                </Button>
              ))}
            </Box>
          </Box>
          {token && (
            <Button onClick={() => setToken('')} sx={{ ml: 2, bgcolor: '#f3f4f6', color: '#18181b', borderRadius: 3, px: 3, py: 1, fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: '#f87171', color: '#fff' } }}>
              Se déconnecter
            </Button>
          )}
          {tab === 1 && (
            <Button variant="contained" sx={{ bgcolor: '#e5e7eb', color: '#18181b', textTransform: 'none', fontWeight: 600, borderRadius: 3, px: 4, py: 1.5, ml: 2, boxShadow: 'none', '&:hover': { bgcolor: '#f1f5f9' } }} startIcon={<AddIcon />} onClick={() => setOpenAddVideo(true)}>Ajouter une vidéo</Button>
          )}
          {tab === 2 && (
            <Button variant="contained" sx={{ bgcolor: '#e5e7eb', color: '#18181b', textTransform: 'none', fontWeight: 600, borderRadius: 3, px: 4, py: 1.5, ml: 2, boxShadow: 'none', '&:hover': { bgcolor: '#f1f5f9' } }} startIcon={<AddIcon />} onClick={() => setOpenAddAccount(true)}>Ajouter un compte</Button>
          )}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ 
        flexGrow: 1, 
        bgcolor: '#ffffff', 
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
          bgcolor: '#fff',
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
