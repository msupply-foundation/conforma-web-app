import React, { createContext, useContext, useEffect, useState } from 'react'
import config from '../config'
import strings from '../utils/constants'
import { getRequest } from '../utils/helpers/fetchMethods'

const initialLanguageCode = localStorage.getItem('language') ?? config.defaultLanguageCode

type LanguageProviderProps = { children: React.ReactNode }

type LanguageOption = {
  languageName: string
  description: string
  code: string
  flag: string // To-do: limit to flag emojis
}

type LanguageStrings = { [Property in keyof typeof strings]?: string }

interface LanguageState {
  languageOptions: LanguageOption[]
  selectedLanguage: LanguageOption | null
  strings: LanguageStrings
  loading: boolean
  error: any
}

const initialContext: {
  strings: LanguageStrings
  selectedLanguage: LanguageOption | null
  languageOptions: LanguageOption[]
  loading: boolean
  error: any
  setLanguage: Function
} = {
  strings: {},
  selectedLanguage: null,
  languageOptions: [],
  loading: true,
  error: null,
  setLanguage: () => {},
}

const LanguageProviderContext = createContext(initialContext)

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [languageState, setLanguageState] = useState<LanguageState>({
    languageOptions: [],
    selectedLanguage: null,
    strings: {},
    loading: true,
    error: null,
  })
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<string>(initialLanguageCode)

  // Load initial language and fetch options list
  const updateLanguageState = async (languageCode: string) => {
    setLanguageState({ ...languageState, loading: true })
    const { languageOptions } = languageState
    try {
      // Only fetch options the first time
      const options = languageOptions.length === 0 ? await getLanguageOptions() : languageOptions
      const selectedLanguage =
        options.find((lang: LanguageOption) => lang.code === languageCode) ?? null
      const strings = await getLanguageStrings(languageCode)
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
      }}
    >
      {children}
    </LanguageProviderContext.Provider>
  )
}

export const useLanguageProvider = () => useContext(LanguageProviderContext)

const getLanguageStrings = async (code: string) => {
  // If code is default, then load English strings locally and return
  if (code === config.defaultLanguageCode) return strings
  // Else fetch language file from server
  try {
    const strings = await getRequest(config.serverREST + '/language/' + code)
    if (strings?.error) throw new Error(`Language code: ${code}, ${strings?.message}`)
    return await getRequest(config.serverREST + '/language/' + code)
  } catch (err) {
    throw err
  }

  //   TO - DO
  // Parse JSON and merge keys
  // return language object or error
}

const getLanguageOptions = async () => {
  try {
    const options = await getRequest(config.serverREST + '/localisations')
    if (options?.error) throw new Error('Unable to fetch languages list')
    return options
  } catch (err) {
    throw err
  }
}
