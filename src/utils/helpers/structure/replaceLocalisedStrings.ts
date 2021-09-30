// @ts-ignore
import mapValuesDeep from 'map-values-deep'

/* 
Function to replace localised strings that are outside the core system (which is handled by LanguageProvider). This includes Templates, Filters, PermissionNames.

Regex explanation: /\[strings\.([A-Z0-9_]+)\s?({(.+)})?\]/gm
Match [strings.LANGUAGE_KEY {Default string}]
- LANGUAGE_KEY must be made up of capital A-Z, digits, or _
- Single space between KEY and {Default string} is optional
- {Default string} is optional
- Capture groups:
  1. LANGUAGE_KEY -- used for key
  2. {Default string} -- ignored
  3. Default string -- used as fallback value
  https://regex101.com/r/3A9QyH/1
*/

const replaceLocalisedStrings = <T>(
  inputObject: T,
  strings: { [key: string]: string },
  matchExpression: RegExp = /\[strings\.([A-Z0-9_]+)\s?({(.+)})?\]/gm
): T =>
  mapValuesDeep(inputObject, (value: any) => {
    if (typeof value !== 'string') return value
    if (!value.match(matchExpression)) return value

    // Process custom string
    const matches: RegExpMatchArray[] = []
    let match
    while ((match = matchExpression.exec(value)) !== null) {
      matches.push(match)
    }
    let translatedString = value
    matches.forEach(([fullMatch, key, _, defaultValue]) => {
      const replacement = strings?.[key] ?? defaultValue ?? 'MISSING LANGUAGE STRING'
      translatedString = translatedString.replace(fullMatch, replacement)
    })
    return translatedString
  })

export default replaceLocalisedStrings
