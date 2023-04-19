import { postRequest } from '../helpers/fetchMethods'
import { LanguageStrings, TranslateMethod } from '../../contexts/Localisation'
import Papa from 'papaparse'
import { LanguageObject } from './exportLanguages'
import getServerUrl from '../helpers/endpoints/endpointUrlBuilder'
interface ImportReturn {
  success: boolean
  message: string
}

export const importLanguages = async (
  data: string,
  importDisabled: boolean,
  t: TranslateMethod
): Promise<ImportReturn> => {
  // Parse csv data
  const rows = Papa.parse(data).data as string[][]

  const languageObjects: LanguageObject[] = rows[0].map(
    (i) =>
      // Empty placeholder objects
      ({
        languageName: '',
        description: '',
        code: '',
        flag: '',
        enabled: false,
        translations: {},
      } as LanguageObject)
  )

  let rowIndex = 0

  // Row 1 -- Language names
  rows[rowIndex++].map((name, index) => (languageObjects[index].languageName = name))

  // Row 2 -- Description
  rows[rowIndex++].map((description, index) => (languageObjects[index].description = description))

  // Row 3 -- Code
  rows[rowIndex++].map((code, index) => (languageObjects[index].code = code))

  // Row 4 -- Flag
  rows[rowIndex++].map((flag, index) => (languageObjects[index].flag = flag))

  // Row 5 -- Locale
  rows[rowIndex++].map((locale, index) => (languageObjects[index].locale = locale))

  // Row 6 -- Enabled
  rows[rowIndex++].map(
    (enabled, index) =>
      (languageObjects[index].enabled = enabled.toLowerCase() === 'true' ? true : false)
  )

  // Iterate over language rows - starting on first row after headers parsed
  for (let i = rowIndex + 1; i < rows.length; i++) {
    const row = rows[i]
    const key = row[0] as keyof LanguageStrings
    if (key === ('' as string)) break // End of strings
    row.forEach((item, index) => {
      if (index === 0 || index === 1) return
      if (item) languageObjects[index].translations[key] = item
    })
  }

  const uploadObjects = languageObjects
    .slice(2) // First two are keys and default strings
    .filter((language) => (importDisabled ? true : language.enabled))
    .map(({ languageName, description, code, flag, locale, enabled, translations }) => ({
      language: { languageName, description, code, flag, locale, enabled },
      strings: translations,
    }))

  if (uploadObjects.length === 0)
    return { success: false, message: t('LOCALISATION_NO_LANG_FOUND') }

  // Upload one by one
  const results = []
  try {
    for (const language of uploadObjects) {
      results.push(
        await postRequest({
          url: getServerUrl('installLanguage'),
          jsonBody: language,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    }
  } catch {
    return { success: false, message: t('LOCALISATION_INSTALL_PROBLEM') }
  }

  if (results.every((res) => res.success)) {
    const installedLanguageCodes = languageObjects
      .slice(2)
      .map(({ code }) => code)
      .join(', ')
    return {
      success: true,
      message: installedLanguageCodes,
    }
  } else {
    return { success: false, message: t('LOCALISATION_INSTALL_PROBLEM') }
  }
}
