import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline } from '@mui/material'
import './styles/global.css'
import './index.css'
import './App.css'
import App from './App.jsx'
import { AppThemeProvider } from './theme/AppThemeProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppThemeProvider>
      <CssBaseline />
      <App />
    </AppThemeProvider>
  </StrictMode>,
)
