import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { SystemPrefsProvider } from './contexts/SystemPrefs.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SystemPrefsProvider>
      <App />
    </SystemPrefsProvider>
  </StrictMode>
)
