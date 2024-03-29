import { BasicObject } from '@openmsupply/expression-evaluator/lib/types'
import config from '../../../config'
import {
  ComplexEndpoint,
  BasicEndpoint,
  VerifyEndpoint,
  LookupTableEndpoint,
  LanguageEndpoint,
  FileEndpoint,
  CheckTriggersEndpoint,
  EnableLanguageEndpoint,
  RemoveLanguageEndpoint,
  GetApplicationDataEndpoint,
  SnapshotEndpoint,
  ArchiveEndpoint,
} from './types'

const {
  isProductionBuild,
  restEndpoints,
  devServerRest,
  devServerGraphQL,
  productionPathREST,
  productionPathGraphQL,
} = config
const { port, hostname, protocol } = window.location
const getProductionUrl = (path: string) => `${protocol}//${hostname}:${port}${path}`

export const serverREST = isProductionBuild ? getProductionUrl(productionPathREST) : devServerRest
export const serverGraphQL = isProductionBuild
  ? getProductionUrl(productionPathGraphQL)
  : devServerGraphQL

const getServerUrl = (...args: ComplexEndpoint | BasicEndpoint | ['graphQL']): string => {
  // "as" here ensures we must have types/cases for ALL keys of
  // config.restEndpoints
  const endpointKey = args[0] as keyof typeof restEndpoints | 'graphQL'
  if (endpointKey === 'graphQL') return serverGraphQL
  const endpointPath = restEndpoints[endpointKey]

  const options = (args[1] as ComplexEndpoint[1]) || {}

  switch (endpointKey) {
    case 'public':
    case 'prefs':
    case 'login':
    case 'loginOrg':
    case 'userInfo':
    case 'createHash':
    case 'generatePDF':
    case 'admin':
    case 'installLanguage':
    case 'allLanguages':
    case 'previewActions':
    case 'extendApplication':
    case 'getAllPrefs':
    case 'setPrefs':
      return serverREST + endpointPath

    case 'userPermissions':
    case 'checkUnique':
    case 'upload':
      return `${serverREST}${endpointPath}${buildQueryString(options)}`

    // The "as"s here shouldn't be required, but it's a current limitation of
    // Typescript that it doesn't properly narrow the "case" statements when the
    // variable has been re-assigned. See example: https://bit.ly/3bFhQqX
    case 'language':
      const { code } = options as LanguageEndpoint[1]
      return `${serverREST}${endpointPath}/${code}`

    case 'file':
      const { fileId, thumbnail = false } = options as FileEndpoint[1]
      return `${serverREST}${endpointPath}?uid=${fileId}${thumbnail ? '&thumbnail=true' : ''}`

    case 'verify':
      const { uid } = options as VerifyEndpoint[1]
      return `${serverREST}${endpointPath}?uid=${uid}`

    case 'checkTrigger':
      const { serial } = options as CheckTriggersEndpoint[1]
      return `${serverREST}${endpointPath}?serial=${serial}`

    case 'dataViews':
      // List view
      if (!('dataViewCode' in options)) return `${serverREST}${endpointPath}`

      // Detail view
      if ('itemId' in options) {
        const { dataViewCode, itemId } = options
        return `${serverREST}${endpointPath}/${dataViewCode}/${itemId}`
      }

      // Filter list
      if ('column' in options) {
        const { dataViewCode, column } = options
        return `${serverREST}${endpointPath}/${dataViewCode}/filterList/${column}`
      }

      // Table view
      const { dataViewCode, query } = options
      return `${serverREST}${endpointPath}/${dataViewCode}${buildQueryString(query)}`

    case 'enableLanguage': {
      const { code, enabled = true } = options as EnableLanguageEndpoint[1]
      return `${serverREST}${endpointPath}?code=${code}${enabled ? `&enabled=${enabled}` : ''}`
    }

    case 'removeLanguage': {
      const { code } = options as RemoveLanguageEndpoint[1]
      return `${serverREST}${endpointPath}?code=${code}`
    }

    case 'snapshot':
      const { action } = options as SnapshotEndpoint[1]
      const isArchive = 'archive' in options && options.archive
      const isTemplate = 'template' in options && options.template

      if (action === 'list')
        return `${serverREST}${endpointPath}/list${isArchive ? '?archive=true' : ''}`

      const name = 'name' in options ? options.name : null
      const optionsName = 'options' in options ? options.options : null

      if (action === 'upload')
        return `${serverREST}${endpointPath}/upload${isTemplate ? '?template=true' : ''}`

      if (!name) throw new Error('Name parameter missing in snapshot endpoint query')

      // "download" is direct download url
      if (action === 'download')
        return `${serverREST}${endpointPath}/files/${isArchive ? '_archives/' : ''}${name}.zip`

      if (action === 'delete')
        return `${serverREST}${endpointPath}/${action}?name=${name}${
          isArchive ? '&archive=true' : ''
        }`

      // Must be "take" or "use", which uses "options" file
      return `${serverREST}${endpointPath}/${action}?name=${name}${
        optionsName ? `&optionsName=${optionsName}` : ''
      }${isArchive ? '&archive=true' : ''}`

    case 'lookupTable': {
      let { action } = options as LookupTableEndpoint[1]

      // Import
      if (action === 'import' && 'name' in options)
        return `${serverREST}${endpointPath}/import?name=${options.name}`

      // "Update" uses /import/tableID route
      if (action === 'update' && 'id' in options)
        return `${serverREST}${endpointPath}/import/${options.id}`

      // Export
      if ('id' in options) return `${serverREST}${endpointPath}/export/${options.id}`

      // Typescript should prevent this during compilation
      throw new Error('Missing options')
    }

    case 'getApplicationData':
      const { applicationId, reviewId } = options as GetApplicationDataEndpoint[1]
      return `${serverREST}${endpointPath}?applicationId=${applicationId}${
        reviewId ? `&reviewId=${reviewId}` : ''
      }`

    case 'archiveFiles':
      const { days } = options as ArchiveEndpoint[1]
      return `${serverREST}${endpointPath}?days=${days}`

    default:
      // "never" type ensures we will get a *compile-time* error if we are
      // missing a case defined in Endpoints types
      const missingValue: never = endpointKey
      throw new Error('Failed to consider case:' + missingValue)
  }
}

const buildQueryString = (query?: BasicObject): string => {
  if (!query) return ''
  const keyValStrings = Object.entries(query)
    .filter(([_, value]) => !!value)
    .map(([key, value]) => `${key}=${value}`)
  return '?' + keyValStrings.join('&')
}

export default getServerUrl
