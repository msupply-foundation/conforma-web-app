import React, { createContext, useContext, useEffect, useState } from 'react'
import { LanguageOption } from './Localisation'
import { getRequest } from '../utils/helpers/fetchMethods'
import getServerUrl from '../utils/helpers/endpoints/endpointUrlBuilder'
// @ts-ignore -- no types declarations available
import Css from 'json-to-css'

interface PrefsState {
  preferences?: {
    paginationPresets?: number[]
    paginationDefault?: number
    defaultLanguageCode: string
    brandLogoFileId?: string
    brandLogoOnDarkFileId?: string
    defaultListFilters?: string[]
    googleAnalyticsId?: string
    siteHost?: string
    style?: { headerBgColor?: string }
  }
  languageOptions?: LanguageOption[]
  latestSnapshot?: string
  loading: boolean
  error?: Error
}

interface PrefsContext extends PrefsState {
  refetchPrefs: () => void
}

const SystemPrefsContext = createContext<PrefsContext>({ loading: true, refetchPrefs: () => {} })

export const SystemPrefsProvider = ({ children }: { children: React.ReactNode }) => {
  const [prefsState, setPrefsState] = useState<PrefsState>({
    loading: true,
  })

  useEffect(() => {
    fetchPrefs()
  }, [])

  const fetchPrefs = async () => {
    getRequest(getServerUrl('prefs'))
      .then((result) => {
        const { languageOptions, preferences, latestSnapshot } = result
        setPrefsState({
          languageOptions,
          preferences,
          latestSnapshot,
          loading: false,
        })

        // Install custom CSS into document head
        if (preferences.style) {
          const cssString = Css.of(preferences.style)
          document.head.appendChild(document.createElement('style')).innerHTML = cssString
        }
      })
      .catch((err) => {
        setPrefsState({ loading: false, error: err })
      })
  }

  return (
    <SystemPrefsContext.Provider value={{ ...prefsState, refetchPrefs: fetchPrefs }}>
      {children}
    </SystemPrefsContext.Provider>
  )
}

export const usePrefs = () => useContext(SystemPrefsContext)
