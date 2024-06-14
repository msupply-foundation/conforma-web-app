import { FieldMapType } from '../types'

const buildFieldList = (fieldMap: FieldMapType[]) =>
  fieldMap.map((a: FieldMapType) => a.gqlName).join(' ')

const toCamelCase = (e: string) => {
  return e.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export { buildFieldList, toCamelCase, capitalizeFirstLetter }
