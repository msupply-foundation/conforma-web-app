import React, { createContext, useContext, useEffect, useReducer, useState } from 'react'
import config from '../config'
import strings from '../utils/constants'

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

type Reducer = (state: LanguageState, action: UpdateAction) => LanguageState

const reducer: Reducer = (state, action) => {
  switch (action.type) {
    case 'setLanuageOptions':
      return { ...state, languageOptions: action.value }
    case 'setSelectedLanguage':
      const selectedLanguageCode = action.value
      const selectedLanguage =
        state.languageOptions.find((element) => element.code === selectedLanguageCode) ?? null
      return { ...state, selectedLanguageCode, selectedLanguage }
    case 'setLanguageStrings':
      return { ...state, strings: action.value }
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
  useEffect(() => {
    // Get initial language
    // .then SetLanguageState
    // .then GetOptionsList
    // .then:
    //      SetOptionsListState
    //      SetLoading(false)
    // .catch (Set error, loading false)
  }, [])

  return (
    <LanguageProviderContext.Provider value={{ languageState, loading, error, setLanguageState }}>
      {children}
    </LanguageProviderContext.Provider>
  )
}

export const useLanguageProvider = () => useContext(LanguageProviderContext)

const getInitialLanguage = async (code: string) => {
  // If code is default, then load English strings locally and return
  // Else fetch static file from server
  // Parse JSON and merge keys
  // return language object or error
}

const getLanguageOptions = async () => {
  // Fetch options from server
  // Return object or error
}
