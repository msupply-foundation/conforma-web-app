/* 
Function to replace localised strings that are outside the core system (which is handled by LanguageProvider). This includes Templates, Filters, PermissionNames.
*/

// @ts-ignore
import mapValuesDeep from 'map-values-deep'
import config from '../../../config'
import { CustomLanguageStrings } from '../../types'

const replaceLocalisedStrings = <T>(
  inputObject: T,
  strings: CustomLanguageStrings,
  languageCode: string,
  matchExpression: RegExp = /\[strings\.([A-Z0-9_]+)\]/gm
): T =>
  mapValuesDeep(inputObject, (value: any, key: string) => {
    if (typeof value !== 'string') return value
    const matches = value.match(matchExpression)
    if (!matches) return value

    const keyNames = matches.map((m) => m.replace(matchExpression, '$1'))
    let translatedString = value
    matches.forEach((match, index) => {
      const replacement =
        strings?.[languageCode]?.[keyNames[index]] ??
        strings?.[config.defaultLanguageCode]?.[keyNames[index]] ??
        'STRING KEY NOT FOUND'
      translatedString = translatedString.replace(match, replacement)
    })
    return translatedString
  })

export default replaceLocalisedStrings
