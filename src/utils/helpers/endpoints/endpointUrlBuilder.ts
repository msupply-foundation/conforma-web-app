import { BasicObject } from '@openmsupply/expression-evaluator/lib/types'
import config from '../../../config'
import { RestEndpoints } from './types'

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

const serverREST = isProductionBuild ? getProductionUrl(productionPathREST) : devServerRest
export const serverGraphQL = isProductionBuild
  ? getProductionUrl(productionPathGraphQL)
  : devServerGraphQL

const getServerUrl = (...args: RestEndpoints | ['graphQL']): string => {
  // "as" here ensures we must have types/cases for ALL keys of
  // config.restEndpoints
  const endpointKey = args[0] as keyof typeof restEndpoints | 'graphQL'
  if (endpointKey === 'graphQL') return serverGraphQL
  const endpointPath = restEndpoints[endpointKey]

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
      return serverREST + endpointPath

    case 'language':
      const languageCode = args[1]
      return `${serverREST}${endpointPath}/${languageCode}`

    case 'file':
      const fileId = args[1]
      const isThumbnail = args[2] === 'thumbnail'
      return `${serverREST}${endpointPath}?uid=${fileId}${isThumbnail ? '&thumbnail=true' : ''}`

    case 'verify':
      const uid = args[1]
      return `${serverREST}${endpointPath}?uid=${uid}`

    case 'userPermissions':
      const permissionParameters = args[1]
      return `${serverREST}${endpointPath}${buildQueryString(permissionParameters as BasicObject)}`

    case 'checkTrigger':
      const serial = args[1]
      return `${serverREST}${endpointPath}?serial=${serial}`

    case 'checkUnique':
      const checkUniqueParams = args[1]
      return `${serverREST}${endpointPath}${buildQueryString(checkUniqueParams as BasicObject)}`

    case 'dataViews':
      const tableName = args[1]
      // List view
      if (!tableName) return `${serverREST}${endpointPath}`

      const itemId = typeof args[2] === 'string' ? args[2] : undefined
      const query = typeof args[2] === 'object' ? args[2] : undefined

      // Detail view
      if (itemId) return `${serverREST}${endpointPath}/table/${tableName}/item/${itemId}`

      // Table view
      return `${serverREST}${endpointPath}/table/${tableName}${
        query ? buildQueryString(query as BasicObject) : ''
      }`

    case 'upload':
      const uploadParameters = args[1]
      return `${serverREST}${endpointPath}${buildQueryString(uploadParameters as BasicObject)}`

    case 'enableLanguage':
      const langCodeEnable = args[1]
      const enabled = args[2]
      return `${serverREST}${endpointPath}?code=${langCodeEnable}${
        enabled !== undefined ? `&enabled=${enabled}` : ''
      }`

    case 'removeLanguage':
      const langCodeRemove = args[1]
      return `${serverREST}${endpointPath}?code=${langCodeRemove}`

    case 'snapshot':
      const action = args[1]
      if (action === 'list') return `${serverREST}${endpointPath}/list`
      const name = args[2]
      const options = args[3]

      // "download" is direct download url
      if (action === 'download') return `${serverREST}${endpointPath}/files/${name}.zip`

      if (action === 'upload' || action === 'delete' || !options)
        return `${serverREST}${endpointPath}/${action}?name=${name}`

      // Options AND name present, so must be 'take' or 'use'
      return `${serverREST}${endpointPath}/${action}?name=${name}&optionsName=${options}`

    case 'lookupTable':
      const lookupAction = args[1]
      const nameOrId = args[2]
      if (lookupAction === 'import') return `${serverREST}${endpointPath}/import?name=${nameOrId}`
      // "Update" uses /import/tableID route
      if (lookupAction === 'update') return `${serverREST}${endpointPath}/import/${nameOrId}`
      // Export
      return `${serverREST}${endpointPath}/export/${nameOrId}`

    case 'getApplicationData':
      const applicationId = args[1]
      const reviewId = args[2]
      return `${serverREST}${endpointPath}?applicationId=${applicationId}${
        reviewId ? `&reviewId=${reviewId}` : ''
      }`

    default:
      // "never" type ensures we will get a *compile-time* error if we are
      // missing a case defined in RestEndpoints type
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
