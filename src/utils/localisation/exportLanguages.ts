import { getRequest } from '../helpers/fetchMethods'
import { LanguageOption, LanguageStrings } from '../../contexts/Localisation'
import defaultLanguageStrings from '../../utils/defaultLanguageStrings'
import getServerUrl from '../helpers/endpoints/endpointUrlBuilder'
import { mapValues } from 'lodash'
import Papa from 'papaparse'
import { DateTime } from 'luxon'

export interface LanguageObject extends LanguageOption {
  translations: LanguageStrings
}

export const exportLanguages = async (
  languageOptions: LanguageOption[]
): Promise<{ success: boolean; message: string }> => {
  try {
    // Fetch all languages
    const allLanguageStrings: { [key: string]: LanguageStrings } = await getRequest(
      getServerUrl('allLanguages')
    )

    // Combine language options with their translations
    const languageObject: LanguageObject[] = languageOptions.map((language) => ({
      ...language,
      translations: allLanguageStrings[language.code],
    }))

    // Iterate over default strings and extract all translations
    const translationsObject = mapValues(defaultLanguageStrings, (value, key) =>
      getTranslations(value, key as keyof LanguageStrings, languageObject)
    )

    // Assemble orphans
    const orphanKeys = languageObject.map((lang) => Object.keys(lang.translations)).flat()
    const orphansObject = Object.fromEntries(
      orphanKeys.map((key) => [
        key,
        getTranslations('', key as keyof LanguageStrings, languageObject),
      ])
    )

    // Build CSV Rows and Columns
    const row1Name = [
      'Language:',
      'System Default',
      ...languageOptions.map((opt) => opt.languageName),
    ]
    const row2Description = [
      'Description:',
      'Internal values from which all others are translated',
      ...languageOptions.map((opt) => opt.description),
    ]
    const row3code = ['Code:', '', ...languageOptions.map((opt) => opt.code)]
    const row4Flag = ['Flag:', '', ...languageOptions.map((opt) => opt.flag)]
    const row5Enabled = ['Enabled?', '', ...languageOptions.map((opt) => opt.enabled)]
    const translationRows = Object.keys(defaultLanguageStrings).map((key) => [
      key,
      ...Object.values(translationsObject[key as keyof LanguageStrings]),
    ])
    const orphanRows = orphanKeys.map((key) => [
      key,
      ...Object.values(orphansObject[key as keyof LanguageStrings]),
    ])

    const csvRows = [
      row1Name,
      row2Description,
      row3code,
      row4Flag,
      row5Enabled,
      [],
      ['KEYS'],
      ...translationRows,
      [],
      ['__ORPHANS__', 'Translations found in language files that are no longer in use'],
      ...orphanRows,
    ]
    const csvContent = 'data:text/csv;charset=utf-8,' + Papa.unparse(csvRows)
    const encodedUri = encodeURI(csvContent)
    const hiddenLink = document.createElement('a')
    hiddenLink.setAttribute('href', encodedUri)
    hiddenLink.setAttribute('download', `conforma_localisations_${DateTime.now().toISODate()}.csv`)
    document.body.appendChild(hiddenLink) // Required for FF
    hiddenLink.click() // This will download the data file.

    return { success: true, message: '' }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

const getTranslations = (
  defaultString: string,
  key: keyof LanguageStrings,
  languageObject: LanguageObject[]
): { [key: string]: string } => {
  const valueObj: any = { default: defaultString }
  languageObject.forEach(({ code, translations }) => {
    valueObj[code] = translations[key] || ''
    delete translations[key]
  })
  return valueObj
}
