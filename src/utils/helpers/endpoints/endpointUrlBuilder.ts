import { BasicObject } from '@openmsupply/expression-evaluator/lib/types'
import config from '../../../config'
import { RestEndpoints } from './types'

const { isProductionBuild, restEndpoints, localHostRest, localHostGraphQL } = config as {
  isProductionBuild: boolean
  restEndpoints: { [key in RestEndpoints[0]]: string }
  localHostRest: string
  localHostGraphQL: string
}
const { port, hostname, protocol } = window.location
const getProductionUrl = (path: string) => `${protocol}//${hostname}:${port}/${path}`

const serverREST = isProductionBuild ? getProductionUrl('server/api') : localHostRest
export const serverGraphQL = isProductionBuild
  ? getProductionUrl('postgraphile/graphql')
  : localHostGraphQL

const getServerUrl = (...args: RestEndpoints) => {
  const endpointKey = args[0]
  const endpointPath = restEndpoints[endpointKey]
  switch (endpointKey) {
    case 'public':
    case 'prefs':
    case 'login':
    case 'loginOrg':
    case 'userInfo':
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

    case 'dataViews':
      const tableName = args[1]
      const itemId = typeof args[2] === 'string' ? args[2] : undefined
      const query = typeof args[2] === 'object' ? args[2] : undefined
      // Detail view
      if (itemId) return `${serverREST}${endpointPath}/table/${tableName}/item/${itemId}`
      // Table view
      if (tableName)
        return `${serverREST}${endpointPath}/table/${tableName}${
          query ? buildQueryString(query as BasicObject) : ''
        }`
      // List view
      return `${serverREST}${endpointPath}`

    case 'upload':
      const parameters = args[1]
      return `${serverREST}${endpointPath}${
        parameters ? buildQueryString(parameters as BasicObject) : ''
      }`

    default:
      return 'PATH NOT FOUND'
  }
}

const buildQueryString = (query: { [key: string]: string | number | boolean }) => {
  const keyValStrings = Object.entries(query)
    .filter(([_, value]) => !!value)
    .map(([key, value]) => `${key}=${value}`)
  return '?' + keyValStrings.join('&')
}

export default getServerUrl
