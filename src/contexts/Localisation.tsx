import React, { createContext, useContext, useEffect, useState } from 'react'
import defaultStrings from '../utils/defaultLanguageStrings'
import { getRequest } from '../utils/helpers/fetchMethods'
import { PluginProvider } from '../formElementPlugins/pluginProvider'
import getServerUrl from '../utils/helpers/endpoints/endpointUrlBuilder'
import { mapValues, mapKeys } from 'lodash-es'
import Markdown from '../utils/helpers/semanticReactMarkdown'

const savedLanguageCode = localStorage.getItem('language')

// Not a real language -- selects the strings bundled with the app, for when the
// server has no language of its own to offer
const LOCAL_DEFAULT_CODE = 'default'

// For matching {{replacementKey}} in localised strings
const stringReplacementRegex = /{{([A-z0-9]+)}}/gm

const initSelectedLanguage: LanguageOption = {
  code: savedLanguageCode ?? '',
  languageName: '',
  description: '',
  flag: '',
  locale: '',
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
  locale: string
  flag: string // To-do: limit to flag emojis
  enabled: boolean
}

export type LanguageStrings = { [Property in keyof typeof defaultStrings]: string }

interface LanguageState {
  selectedLanguage: LanguageOption
  strings: LanguageStrings
  loading: boolean
  error: any
}

type Substitutions = Record<string, unknown> | string | number

export type TranslateMethod = (
  key: keyof typeof defaultStrings,
  substitutions?: Substitutions
) => string

type TranslateMarkdownMethod = (
  key: keyof typeof defaultStrings,
  substitutions?: Substitutions
) => JSX.Element

export type TranslatePluginMethod = (key: string, substitutions?: Substitutions) => string

const initialContext: {
  selectedLanguage: LanguageOption
  languageOptions: LanguageOption[]
  languageOptionsFull: LanguageOption[]
  loading: boolean
  error: any
  setLanguage: Function
  refetchLanguages: Function
  translate: TranslateMethod
  t: TranslateMethod
  translateMarkdown: TranslateMarkdownMethod
  tFormat: TranslateMarkdownMethod
  getPluginTranslator: (pluginCode: string) => TranslatePluginMethod
} = {
  selectedLanguage: initSelectedLanguage,
  languageOptions: [],
  languageOptionsFull: [],
  loading: true,
  error: null,
  setLanguage: () => {},
  refetchLanguages: () => {},
  translate: () => '',
  t: () => '',
  translateMarkdown: () => <></>,
  tFormat: () => <></>,
  getPluginTranslator: () => () => '',
}

const LanguageProviderContext = createContext(initialContext)

// Get localisation strings from all form element plugins
export const getPluginStrings = () => {
  let pluginStrings = {}
  for (const plugin of Object.values(PluginProvider)) {
    try {
      const strings = plugin.localisation
      pluginStrings = {
        ...pluginStrings,
        ...mapKeys(strings, (_, key) => `${plugin.config.code}.${key}`),
      }
    } catch {
      //
    }
  }
  return pluginStrings
}

const allDefaultStrings = { ...defaultStrings, ...getPluginStrings() }

export function LanguageProvider({
  children,
  languageOptions,
  defaultLanguageCode,
  refetchPrefs,
}: LanguageProviderProps) {
  const [languageState, setLanguageState] = useState<LanguageState>({
    selectedLanguage: initSelectedLanguage,
    strings: allDefaultStrings,
    loading: true,
    error: null,
  })
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<string>(
    savedLanguageCode ?? defaultLanguageCode
  )
  const [shouldRefetchStrings, setShouldRefetchStrings] = useState(false)

  // Fetch the strings for a language code that has already been checked against
  // the available options
  const updateLanguageState = async (languageCode: string) => {
    setLanguageState((state) => ({ ...state, loading: true }))
    try {
      const strings = (await getLanguageStrings(languageCode)) as LanguageStrings
      setLanguageState((state) => ({
        ...state,
        selectedLanguage:
          languageOptions.find((lang: LanguageOption) => lang.code === languageCode) ??
          state.selectedLanguage,
        strings,
        loading: false,
        error: null,
      }))
      localStorage.setItem('language', languageCode)
    } catch (err) {
      setLanguageState((state) => ({
        ...state,
        loading: false,
        error: err,
      }))
      localStorage.removeItem('language')
    }
  }

  // A language code only means something to the server that has that language
  // installed and enabled, so a code from localStorage or from prefs can name a
  // language this server doesn't have -- asking for its strings would fail. The
  // server default is preferred as a fallback, then the first available
  // language, and finally the strings bundled with the app.
  const getValidLanguageCode = (code: string) => {
    const enabledLanguages = languageOptions.filter(({ enabled }) => enabled)
    if (enabledLanguages.some((lang) => lang.code === code)) return code

    const fallbackCode =
      enabledLanguages.find((lang) => lang.code === defaultLanguageCode)?.code ??
      enabledLanguages[0]?.code ??
      LOCAL_DEFAULT_CODE
    console.log(`Invalid language code "${code}", falling back to: ${fallbackCode}`)
    return fallbackCode
  }

  // Reload language options from prefs, and (optionally) refresh the current
  // strings
  const refetchLanguages = async (reloadStrings = false) => {
    if (reloadStrings) setShouldRefetchStrings(true)
    refetchPrefs()
  }

  const translate: TranslateMethod = (key, substitutions = {}) =>
    getTranslation(languageState.strings, key, substitutions)

  const translateMarkdown: TranslateMarkdownMethod = (key, substitutions = {}) => {
    return (
      <Markdown
        text={getTranslation(languageState.strings, key, substitutions)}
        semanticComponent="noParagraph"
      />
    )
  }

  // Same as the regular "translate" function, except appends the pluginCode as
  // key. We use the pluginCode as part of the key to avoid collisions if
  // plugins happen to use the same keys as the main app.
  const translatePlugin = (pluginCode: string, key: string, substitutions: Substitutions = {}) => {
    const fullKey = `${pluginCode}.${key}`
    return getTranslation(languageState.strings, fullKey, substitutions)
  }

  // Fetch new language when language code changes
  useEffect(() => {
    const validCode = getValidLanguageCode(selectedLanguageCode)
    // Correcting the code re-runs this effect, which then does the fetching
    if (validCode !== selectedLanguageCode) setSelectedLanguageCode(validCode)
    else updateLanguageState(validCode)
  }, [selectedLanguageCode])

  // Update language state whenever Options refetched from Prefs
  useEffect(() => {
    const validCode = getValidLanguageCode(selectedLanguageCode)
    if (validCode !== selectedLanguageCode) setSelectedLanguageCode(validCode)
    else if (shouldRefetchStrings) updateLanguageState(validCode)
    setShouldRefetchStrings(false)
  }, [languageOptions])

  return (
    <LanguageProviderContext.Provider
      value={{
        selectedLanguage: languageState.selectedLanguage,
        languageOptions: languageOptions.filter((lang: LanguageOption) => lang?.enabled),
        languageOptionsFull: languageOptions,
        loading: languageState.loading,
        error: languageState.error,
        setLanguage: setSelectedLanguageCode,
        refetchLanguages,
        translate,
        t: translate,
        translateMarkdown: translateMarkdown,
        tFormat: translateMarkdown,
        getPluginTranslator: (pluginCode) => (key, substitutions) =>
          translatePlugin(pluginCode, key, substitutions),
      }}
    >
      {children}
    </LanguageProviderContext.Provider>
  )
}

export const useLanguageProvider = () => useContext(LanguageProviderContext)

const getLanguageStrings = async (code: string) => {
  // If default language code not available on server, just use local defaults
  if (code === 'default') return allDefaultStrings
  // Else fetch language file from server
  const fetchedStrings = await getRequest(getServerUrl('language', { code }))
  if (fetchedStrings?.error) throw new Error(`Language code: ${code}, ${fetchedStrings?.message}`)
  return consolidateStrings(allDefaultStrings, fetchedStrings)
}

// Checks all keys from English master list in remoteStrings, and provide
// English fallback if missing or empty string.
const consolidateStrings = (refStrings: LanguageStrings, remoteStrings: LanguageStrings) =>
  mapValues(refStrings, (englishString, key: keyof LanguageStrings) =>
    remoteStrings?.[key] ? remoteStrings?.[key] : englishString
  )

// Returns translated string with substitutions
const getTranslation = (
  strings: Record<string, string>,
  key: string,
  substitutions: Substitutions
) => {
  let localisedString = strings[key]
  if (localisedString === undefined) return key

  if (typeof substitutions === 'string' || typeof substitutions === 'number') {
    const match = localisedString.match(/{{([A-z0-9]+)}}/m)
    if (match) {
      substitutions = { [match[1]]: substitutions }
    } else substitutions = {}
  }

  // "{{count}}" is a special replacement, where an alternative string can be
  // provided for certain numbers, usually a single value (1).
  if ('count' in substitutions) {
    const altKey = `${key}_${substitutions.count}` as keyof typeof strings
    if (strings[altKey]) localisedString = strings[altKey]
  }

  return localisedString.replace(stringReplacementRegex, (match, sub) =>
    String((substitutions as Record<string, unknown>)[sub] ?? match)
  )
}
