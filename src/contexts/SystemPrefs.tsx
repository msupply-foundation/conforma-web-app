import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { LanguageOption } from './Localisation'
import { getRequest } from '../utils/helpers/fetchMethods'
import config from '../config'

interface PrefsState {
  preferences?: {
    paginationPresets: number[]
    defaultLanguageCode: string
    brandLogoFileId?: string
    brandLogoOnDarkFileId?: string
  }
  languageOptions?: LanguageOption[]
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
    getRequest(`${config.serverREST}/public/get-prefs`)
      .then((result) => {
        const { languageOptions, preferences } = result
        setPrefsState({
          languageOptions,
          preferences,
          loading: false,
        })
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
