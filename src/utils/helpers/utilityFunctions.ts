import { get as extractObjectProperty } from 'lodash'

export const isArraySorted = (array: any[], ascending = true) => {
  if (ascending) return array.every((element, index) => index === 0 || element >= array[index - 1])
  else
    return array.every(
      (element, index) => index === array.length - 1 || element >= array[index + 1]
    )
}

/*
Checks if a URL string is an external URL or a local/relative one
If local/relative, it prepends it with a specified host, else it
returns it unchanged.
*/
export const getFullUrl = (baseUrl: string | undefined, host: string) => {
  return baseUrl?.startsWith('http') ? baseUrl : host + baseUrl
}

/*
Replaces substrings identified as ${"property"} with values from "data".
"property" can be a nested object property e.g "user.name".
Note: If substring contains no property name (i.e. '${}') and "data" is not an Object, the whole item will be inserted.
*/
export const substituteValues = (
  parameterisedString: string,
  data: { [key: string]: any | string }
): string => {
  // Custom replacement function for regex replace
  const getObjectProperty = (_: string, __: string, property: string) => {
    if (typeof data !== 'object') return data
    return extractObjectProperty(data, property, `Can't find property: ${property}`)
  }

  // Match ${...} using regex and replace ... with property from object
  return parameterisedString.replace(/(\${)(.*?)(})/gm, getObjectProperty)
}
