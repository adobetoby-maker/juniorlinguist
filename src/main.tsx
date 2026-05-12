import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './state/AppState.tsx'
import { SpeechProvider } from './state/SpeechProvider.tsx'
import XPPopLayer from './components/learn/XPPopLayer.tsx'
import LevelUpModal from './components/learn/LevelUpModal.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <SpeechProvider>
          <App />
          <XPPopLayer />
          <LevelUpModal />
        </SpeechProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)
