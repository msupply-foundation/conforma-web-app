import { postRequest } from '../helpers/fetchMethods'
import config from '../../config'
import { LanguageStrings } from '../../contexts/Localisation'
import Papa from 'papaparse'
import { LanguageObject } from './exportLanguages'
interface ImportReturn {
  success: boolean
  message: string
}

export const importLanguages = async (
  data: string,
  importDisabled: boolean
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

  // Row 0 -- Language names
  rows[0].map((name, index) => (languageObjects[index].languageName = name))

  // Row 1 -- Description
  rows[1].map((description, index) => (languageObjects[index].description = description))

  // Row 2 -- Code
  rows[2].map((code, index) => (languageObjects[index].code = code))

  // Row 3 -- Flag
  rows[3].map((flag, index) => (languageObjects[index].flag = flag))

  // Row 4 -- Enabled
  rows[4].map((enabled, index) => (languageObjects[index].enabled = Boolean(enabled)))

  // Iterate over language rows
  for (let i = 7; i < rows.length; i++) {
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
    // .filter((language) => !importDisabled && )
    .map(({ languageName, description, code, flag, enabled, translations }) => ({
      language: { languageName, description, code, flag, enabled },
      strings: translations,
    }))

  if (uploadObjects.length === 0) return { success: false, message: 'No languages found in file' }

  // Upload one by one
  const results = []
  try {
    for (const language of uploadObjects) {
      results.push(
        await postRequest({
          url: config.serverREST + '/admin/install-language',
          jsonBody: language,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    }
  } catch {
    return { success: false, message: 'Problem installing one or more languages' }
  }

  if (results.every((res) => res.success)) {
    return {
      success: true,
      message: '',
    }
  } else {
    console.log(results)
    return { success: false, message: 'Problem installing one or more languages' }
  }
}
