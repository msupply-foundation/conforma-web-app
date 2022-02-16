import { getRequest } from '../helpers/fetchMethods'
import config from '../../config'
import { LanguageOption, LanguageStrings } from '../../contexts/Localisation'
import defaultLanguageStrings from '../../utils/defaultLanguageStrings'
import { mapValues } from 'lodash'
import { DateTime } from 'luxon'

interface LanguageObject extends LanguageOption {
  translations: LanguageStrings
}

export const exportLanguages = async (includeDisabled = true) => {
  // Fetch list of languages
  const languageOptions: LanguageOption[] = []
  try {
    languageOptions.push(
      ...(await getRequest(`${config.serverREST}/public/get-prefs`)).languageOptions.filter(
        (language: LanguageOption) => language.enabled || includeDisabled
      )
    )
  } catch (err) {
    throw err
  }

  // Fetch all languages
  const languagePromises: Promise<LanguageStrings>[] = []
  languageOptions.forEach((language) => {
    try {
      languagePromises.push(getRequest(config.serverREST + '/public/language/' + language.code))
    } catch (err) {
      throw err
    }
  })
  const languages = await Promise.all(languagePromises)

  // Combine language options with their translations
  const languageObject: LanguageObject[] = languageOptions.map((language, index) => ({
    ...language,
    translations: languages[index],
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
  const row5Enabled = ['Enabled?', true, ...languageOptions.map((opt) => opt.enabled)]
  const translationRows = Object.keys(defaultLanguageStrings).map((key) => [
    key,
    ...Object.values(translationsObject[key as keyof LanguageStrings]).map((str) => `"${str}"`),
  ])
  const orphanRows = orphanKeys.map((key) => [
    key,
    ...Object.values(orphansObject[key as keyof LanguageStrings]).map((str) => `"${str}"`),
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
    ['ORPHANS', 'Translations found in language files that are no longer in use'],
    ...orphanRows,
  ]
  const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((row) => row.join(',')).join('\n')
  const encodedUri = encodeURI(csvContent)
  const hiddenLink = document.createElement('a')
  hiddenLink.setAttribute('href', encodedUri)
  hiddenLink.setAttribute('download', `conforma_localisations_${DateTime.now().toISODate()}.csv`)
  document.body.appendChild(hiddenLink) // Required for FF
  hiddenLink.click() // This will download the data file named "my_data.csv".
}

const getTranslations = (
  defaultString: string,
  key: keyof LanguageStrings,
  languageObject: LanguageObject[]
) => {
  const valueObj: any = { default: defaultString }
  languageObject.forEach(({ code, translations }) => {
    valueObj[code] = translations[key] || ''
    delete translations[key]
  })

  return valueObj
}
