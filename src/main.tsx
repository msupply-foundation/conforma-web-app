import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill'
import countryFlagsFontUrl from 'country-flag-emoji-polyfill/dist/TwemojiCountryFlags.woff2'
import App from './App.tsx'
import { SystemPrefsProvider } from './contexts/SystemPrefs.tsx'

// Windows has no glyphs for country flag emojis, so Chromium browsers there
// render them as letter pairs (e.g. "TO" for 🇹🇴). On such browsers this loads a
// flags-only web font, referenced as "Twemoji Country Flags" at the front of
// the Semantic UI font stacks (see semantic/src/site/globals/site.variables).
// The font is served from our own bundle rather than the package's default CDN.
polyfillCountryFlagEmojis('Twemoji Country Flags', countryFlagsFontUrl)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SystemPrefsProvider>
      <App />
    </SystemPrefsProvider>
  </StrictMode>
)
