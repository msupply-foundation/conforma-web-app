import path from 'path'
import React, { createContext, useContext, useEffect, useReducer, useState } from 'react'
import config from '../config'
import strings from '../utils/constants'
import { getRequest } from '../utils/helpers/fetchMethods'

const initialLanguageCode = localStorage.getItem('language') ?? config.defaultLanguageCode

type LanguageProviderProps = { languagePref?: string; children: React.ReactNode }

type LanguageOption = {
  languageName: string
  description: string
  code: string
  flag: string // To-do: limit to flag emojis
}

type LanguageStrings = { [key: string]: string }

interface LanguageState {
  languageOptions: LanguageOption[]
  selectedLanguageCode: string | null
  selectedLanguage: LanguageOption | null
  strings: LanguageStrings
}

export type UpdateAction =
  | {
      type: 'setLanuageOptions'
      value: LanguageOption[]
    }
  | {
      type: 'setSelectedLanguage'
      value: string // code
    }
  | {
      type: 'setLanguageStrings'
      value: LanguageStrings
    }
  | {
      type: 'setState'
      value: {
        languageOptions: LanguageOption[]
        selectedLanguageCode: string
        strings: LanguageStrings
      }
    }

type Reducer = (state: LanguageState, action: UpdateAction) => LanguageState

const reducer: Reducer = (state, action) => {
  switch (action.type) {
    case 'setLanuageOptions':
      return { ...state, languageOptions: action.value }
    case 'setSelectedLanguage':
      const selectedLanguageCode = action.value
      let selectedLanguage =
        state.languageOptions.find((element) => element.code === selectedLanguageCode) ?? null
      localStorage.setItem('language', selectedLanguageCode)
      return { ...state, selectedLanguageCode, selectedLanguage }
    case 'setLanguageStrings':
      return { ...state, strings: action.value }
    case 'setState':
      const { languageOptions, selectedLanguageCode: code, strings } = action.value
      selectedLanguage = languageOptions.find((element) => element.code === code) ?? null
      localStorage.setItem('language', code)
      return { languageOptions, selectedLanguageCode: code, selectedLanguage, strings }
  }
}
const initialState = {
  languageOptions: [],
  selectedLanguageCode: initialLanguageCode,
  selectedLanguage: null,
  strings: {},
}
const initialContext: {
  languageState: LanguageState
  loading: boolean
  error: boolean
  setLanguageState: React.Dispatch<UpdateAction>
} = {
  languageState: initialState,
  loading: true,
  error: false,
  setLanguageState: () => {},
}

const LanguageProviderContext = createContext(initialContext)

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [languageState, dispatch] = useReducer(reducer, initialState)
  const setLanguageState = dispatch
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Load initial language and fetch options list
  const setInitialState = async () => {
    try {
      const strings = await getLanguageStrings(initialLanguageCode)
      if (strings?.error) {
        setError(true)
        console.log(strings.message)
        return
      }
      const languageOptions = await getLanguageOptions()
      if (languageOptions?.error) {
        setError(true)
        console.log(strings.message)
        return
      }
      setLanguageState({
        type: 'setState',
        value: {
          languageOptions,
          selectedLanguageCode: initialLanguageCode,
          strings,
        },
      })
      setLoading(false)
      setError(false)
    } catch (err) {
      setLoading(false)
      setError(true)
      console.log(err.message)
    }
  }
  useEffect(() => {
    setInitialState()
  }, [])

  return (
    <LanguageProviderContext.Provider value={{ languageState, loading, error, setLanguageState }}>
      {children}
    </LanguageProviderContext.Provider>
  )
}

export const useLanguageProvider = () => useContext(LanguageProviderContext)

const getLanguageStrings = async (code: string) => {
  // If code is default, then load English strings locally and return
  if (code === config.defaultLanguageCode) return strings
  // Else fetch static file from server
  try {
    return await getRequest(config.serverREST + '/language/' + code)
  } catch (err) {
    return { error: true, message: err.message }
  }

  //   TO - DO
  // Parse JSON and merge keys
  // return language object or error
}

const getLanguageOptions = async () => {
  try {
    return await getRequest(config.serverREST + '/localisations')
  } catch (err) {
    return { error: true, message: err.message }
  }
}
