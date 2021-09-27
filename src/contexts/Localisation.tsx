import React, { createContext, useContext, useEffect, useState } from 'react'
import config from '../config'
import strings from '../utils/defaultLanguageStrings'
import { getRequest } from '../utils/helpers/fetchMethods'
import { mapValues } from 'lodash'

const { defaultLanguageCode, pluginsFolder } = config

const initialLanguageCode = localStorage.getItem('language') ?? defaultLanguageCode

const initSelectedLanguage: LanguageOption = {
  code: initialLanguageCode,
  languageName: '',
  description: '',
  flag: '',
  enabled: true,
}

type LanguageProviderProps = { children: React.ReactNode }

type LanguageOption = {
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
  loading: boolean
  error: any
  setLanguage: Function
  getPluginStrings: Function
} = {
  strings: {} as LanguageStrings,
  selectedLanguage: initSelectedLanguage,
  languageOptions: [],
  loading: true,
  error: null,
  setLanguage: () => {},
  getPluginStrings: () => {},
}

const LanguageProviderContext = createContext(initialContext)

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [languageState, setLanguageState] = useState<LanguageState>({
    languageOptions: [],
    selectedLanguage: initSelectedLanguage,
    strings: {} as LanguageStrings,
    loading: true,
    error: null,
  })
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<string>(initialLanguageCode)

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
      // Only fetch options the first time
      const options = languageOptions.length === 0 ? await getLanguageOptions() : languageOptions
      const selectedLanguage =
        options.find((lang: LanguageOption) => lang.code === languageCode) ?? options[0]
      // Safety in case stored language code is no longer available on server
      setSelectedLanguageCode(selectedLanguage.code)
      const strings = (await getLanguageStrings(languageCode)) as LanguageStrings
      setLanguageState({
        ...languageState,
        languageOptions: options,
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

  // Fetch new language when language code changes
  useEffect(() => {
    updateLanguageState(selectedLanguageCode)
  }, [selectedLanguageCode])

  return (
    <LanguageProviderContext.Provider
      value={{
        strings: languageState.strings,
        selectedLanguage: languageState.selectedLanguage,
        languageOptions: languageState.languageOptions,
        loading: languageState.loading,
        error: languageState.error,
        setLanguage: setSelectedLanguageCode,
        getPluginStrings,
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
    const fetchedStrings = await getRequest(config.serverREST + '/language/' + code)
    if (fetchedStrings?.error) throw new Error(`Language code: ${code}, ${fetchedStrings?.message}`)
    return consolidateStrings(strings, fetchedStrings)
  } catch (err) {
    throw err
  }
}

const getLanguageOptions = async () => {
  try {
    const options = await getRequest(config.serverREST + '/localisations')
    if (options?.error) throw new Error('Unable to fetch languages list')
    return options.filter((lang: LanguageOption) => lang?.enabled)
  } catch (err) {
    throw err
  }
}

// Checks all keys from English master list in remoteStrings, and provide
// English fallback if missing.
const consolidateStrings = (refStrings: LanguageStrings, remoteStrings: LanguageStrings) =>
  mapValues(
    refStrings,
    (englishString, key: keyof LanguageStrings) => remoteStrings?.[key] ?? englishString
  )
