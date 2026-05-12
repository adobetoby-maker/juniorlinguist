import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './state/AppState.tsx'
import { SpeechProvider } from './state/SpeechProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <SpeechProvider>
          <App />
        </SpeechProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)
