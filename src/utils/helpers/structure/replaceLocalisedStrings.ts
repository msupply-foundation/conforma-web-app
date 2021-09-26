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
  matchExpression: RegExp = /^strings\.([A-Z0-9_]+)$/gm
): T => {
  const newObject = mapValuesDeep(inputObject, (value: any, key: string) => {
    if (typeof value !== 'string') return value
    if (!value.match(matchExpression)) return value
    const keyName = value.replace(matchExpression, '$1')
    // Try and replace with preferred lanuage
    if (strings?.[languageCode]?.[keyName]) return strings?.[languageCode]?.[keyName]
    // Else try and replace with default language
    if (strings?.[config.defaultLanguageCode]?.[keyName])
      return strings?.[config.defaultLanguageCode]?.[keyName]
    // Else return error string
    return 'STRING KEY NOT FOUND'
  })
  return newObject
}

export default replaceLocalisedStrings
