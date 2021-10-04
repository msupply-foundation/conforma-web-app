import { useEffect, useState } from 'react'
import { getRequest } from '../helpers/fetchMethods'
import config from '../../config'
import { LanguageOption } from '../../contexts/Localisation'

interface PrefsState {
  preferences?: { paginationPresets: number[]; defaultLanguageCode: string }
  languageOptions?: LanguageOption[]
  loading: boolean
  error?: Error
}

const usePrefs = () => {
  const [prefsState, setPrefsState] = useState<PrefsState>({
    loading: true,
  })

  useEffect(() => {
    getRequest(`${config.serverREST}/public/get-prefs`)
      .then((result) => {
        const { languageOptions, preferences } = result
        setPrefsState({
          languageOptions: languageOptions.filter((lang: LanguageOption) => lang?.enabled),
          preferences,
          loading: false,
        })
      })
      .catch((err) => {
        setPrefsState({ loading: false, error: err })
      })
  }, [])

  return { ...prefsState }
}

export default usePrefs
