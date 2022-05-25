import React, { createContext, useContext, useEffect, useState } from 'react'
import config from '../config'
import strings from '../utils/defaultLanguageStrings'
import { getRequest } from '../utils/helpers/fetchMethods'
import { mapValues } from 'lodash'

const { pluginsFolder } = config

const savedLanguageCode = localStorage.getItem('language')

const initSelectedLanguage: LanguageOption = {
  code: savedLanguageCode ?? '',
  languageName: '',
  description: '',
  flag: '',
  enabled: true,
}

type LanguageProviderProps = {
  children: React.ReactNode
  languageOptions: LanguageOption[]
  defaultLanguageCode: string
  refetchPrefs: () => void
}

export type LanguageOption = {
  languageName: string
  description: string
  code: string
  flag: string // To-do: limit to flag emojis
  enabled: boolean
}

export type LanguageStrings = { [Property in keyof typeof strings]: string }

interface LanguageState {
  languageOptions: LanguageOption[]
  selectedLanguage: LanguageOption
  strings: LanguageStrings
  loading: boolean
  error: any
}

const initialContext: {
  strings: LanguageStrings
  selectedLanguage: LanguageOption
  languageOptions: LanguageOption[]
  languageOptionsFull: LanguageOption[]
  loading: boolean
  error: any
  setLanguage: Function
  getPluginStrings: Function
  refetchLanguages: Function
} = {
  strings: {} as LanguageStrings,
  selectedLanguage: initSelectedLanguage,
  languageOptions: [],
  languageOptionsFull: [],
  loading: true,
  error: null,
  setLanguage: () => {},
  getPluginStrings: () => {},
  refetchLanguages: () => {},
}

const LanguageProviderContext = createContext(initialContext)

export function LanguageProvider({
  children,
  languageOptions,
  defaultLanguageCode,
  refetchPrefs,
}: LanguageProviderProps) {
  const [languageState, setLanguageState] = useState<LanguageState>({
    languageOptions,
    selectedLanguage: initSelectedLanguage,
    strings: {} as LanguageStrings,
    loading: true,
    error: null,
  })
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<string>(
    savedLanguageCode ?? defaultLanguageCode
  )
  const [shouldRefetchStrings, setShouldRefetchStrings] = useState(false)

  // Helper function provided to plugins to determine where to read their
  // language strings from
  const getPluginStrings = (plugin: string) => {
    const defaultPluginStrings = require(`../${pluginsFolder}/${plugin}/localisation/default/strings.json`)
    if (selectedLanguageCode === 'default') return defaultPluginStrings
    try {
      const localisedPluginStrings = require(`../${pluginsFolder}/${plugin}/localisation/${selectedLanguageCode}/strings.json`)
      return consolidateStrings(defaultPluginStrings, localisedPluginStrings)
    } catch {
      return defaultPluginStrings
    }
  }

  // Load initial language and fetch options list
  const updateLanguageState = async (languageCode: string) => {
    setLanguageState({ ...languageState, loading: true })
    const { languageOptions } = languageState
    try {
      const selectedLanguage =
        languageOptions.find((lang: LanguageOption) => lang.code === languageCode) ??
        languageOptions[0]
      // Safety in case stored language code is no longer available on server
      setSelectedLanguageCode(selectedLanguage.code)
      const strings = (await getLanguageStrings(languageCode)) as LanguageStrings
      setLanguageState({
        ...languageState,
        languageOptions,
        selectedLanguage,
        strings,
        loading: false,
      })
      localStorage.setItem('language', languageCode)
    } catch (err) {
      setLanguageState({
        ...languageState,
        loading: false,
        error: err,
      })
      localStorage.removeItem('language')
    }
  }

  // If the selected language is no longer valid (either disabled or uninstalled), then try default, or fallback to first available
  const getValidLanguageCode = () => {
    if (languageOptions.some((lang) => lang.enabled && lang.code === selectedLanguageCode))
      return selectedLanguageCode
    if (languageOptions.some((lang) => lang.enabled && lang.code === defaultLanguageCode))
      return defaultLanguageCode
    else {
      const firstAvailableLanguageCode = languageOptions.filter(({ enabled }) => enabled)[0].code
      console.log(
        `Invalid language code, falling back to first available: ${firstAvailableLanguageCode}`
      )
      return firstAvailableLanguageCode
    }
  }

  // Reload language options from prefs, and (optionally) refresh the current
  // strings
  const refetchLanguages = async (reloadStrings = false) => {
    if (reloadStrings) setShouldRefetchStrings(true)
    refetchPrefs()
  }

  // Fetch new language when language code changes
  useEffect(() => {
    updateLanguageState(selectedLanguageCode)
  }, [selectedLanguageCode])

  // Update language state whenever Options refetched from Prefs
  useEffect(() => {
    setLanguageState((state) => ({ ...state, languageOptions }))
    const validCode = getValidLanguageCode()
    if (validCode !== selectedLanguageCode) setSelectedLanguageCode(validCode)
    else if (shouldRefetchStrings) updateLanguageState(validCode)
    setShouldRefetchStrings(false)
  }, [languageOptions])

  return (
    <LanguageProviderContext.Provider
      value={{
        strings: languageState.strings,
        selectedLanguage: languageState.selectedLanguage,
        languageOptions: languageState.languageOptions.filter(
          (lang: LanguageOption) => lang?.enabled
        ),
        languageOptionsFull: languageState.languageOptions,
        loading: languageState.loading,
        error: languageState.error,
        setLanguage: setSelectedLanguageCode,
        getPluginStrings,
        refetchLanguages,
      }}
    >
      {children}
    </LanguageProviderContext.Provider>
  )
}

export const useLanguageProvider = () => useContext(LanguageProviderContext)

const getLanguageStrings = async (code: string) => {
  // If default language code not available on server, just use local defaults
  if (code === 'default') return strings
  // Else fetch language file from server
  try {
    const fetchedStrings = await getRequest(config.serverREST + '/public/language/' + code)
    if (fetchedStrings?.error) throw new Error(`Language code: ${code}, ${fetchedStrings?.message}`)
    return consolidateStrings(strings, fetchedStrings)
  } catch (err) {
    throw err
  }
}

// Checks all keys from English master list in remoteStrings, and provide
// English fallback if missing or empty string.
const consolidateStrings = (refStrings: LanguageStrings, remoteStrings: LanguageStrings) =>
  mapValues(refStrings, (englishString, key: keyof LanguageStrings) =>
    remoteStrings?.[key] ? remoteStrings?.[key] : englishString
  )
