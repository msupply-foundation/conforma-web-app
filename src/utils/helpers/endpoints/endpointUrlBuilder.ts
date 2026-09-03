import config from '../../../config'
import {
  GetServerUrlFunction,
  LanguageOptions,
  FilesOptions,
  UserPermissionsOptions,
  VerifyOptions,
  CheckTriggersOptions,
  FileOptions,
  DataViewOptions,
  LocalisationOptions,
  SnapshotOptions,
  LookupTableOptions,
  TemplateOptions,
  GetApplicationDataOptions,
  ArchiveOptions,
  FigTreeFragmentsOptions,
} from './types'

const { VITE_USE_DEV_SERVER } = import.meta.env

const {
  isProductionBuild,
  restEndpoints,
  devServerRest,
  devServerGraphQL,
  devServerRestAbsolute,
  devServerGraphQLAbsolute,
  productionPathREST,
  productionPathGraphQL,
  productionPathWebSocket,
} = config
const { port, hostname, protocol } = window.location
const getProductionUrl = (path: string) => {
  return `${protocol}//${hostname}${port ? `:${port}` : ''}${path}`
}

// In dev (vite dev server) we build a full, *same-origin* URL from
// `window.location` (e.g. http://localhost:5100/api). Because it points at
// the dev server's own origin, the proxy still matches it on path and
// forwards it to the backend — everything stays same-origin, so there are no
// CORS preflights, exactly as with a bare `/api` path. The reason we make it
// absolute rather than relative: fig-tree-evaluator's URL join strips the
// leading slash off relative paths (turning `/api/...` into a path-relative
// URL that resolves against the current route, e.g. `/admin/api/...`). An
// absolute URL trips fig-tree's "already a full URL" guard and is used
// as-is. In a production build the page is served from the same host as the
// API, so we likewise build a full URL relative to `window.location`. The
// `VITE_USE_DEV_SERVER` branch is for the niche case of a production build
// pointed at a dev backend (no dev-server proxy in play), so it needs the
// absolute URL to the backend's own (cross-)origin.
export const serverREST = isProductionBuild
  ? VITE_USE_DEV_SERVER
    ? devServerRestAbsolute
    : getProductionUrl(productionPathREST)
  : getProductionUrl(devServerRest)
export const serverGraphQL = isProductionBuild
  ? VITE_USE_DEV_SERVER
    ? devServerGraphQLAbsolute
    : getProductionUrl(productionPathGraphQL)
  : getProductionUrl(devServerGraphQL)
// The websocket is same-origin, like every other endpoint: a deployment serves
// it under `/websocket`, and in dev the vite proxy forwards it (see
// vite.config.ts). That matters beyond consistency — the auth cookies are
// Secure and SameSite=Strict, so a cross-origin `ws://` handshake arrives
// without them and the server can't tell which session the socket belongs to,
// which is how it addresses "session-expired" notifications.
//
// `VITE_USE_DEV_SERVER` is the exception, as it is above: a production build
// pointed at a dev backend has no proxy in front of it, so it has to reach the
// backend's own origin directly.
const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:'
const sameOriginWebSocket = `${wsProtocol}//${hostname}${port ? `:${port}` : ''}`
const serverWebSocket = isProductionBuild
  ? VITE_USE_DEV_SERVER
    ? `${devServerRestAbsolute.replace(/^http/, 'ws').replace(/api\/?$/, '')}`
    : `${sameOriginWebSocket}${productionPathWebSocket}`
  : `${sameOriginWebSocket}/`

const getServerUrl: GetServerUrlFunction = (endpointKey, options = undefined) => {
  if (endpointKey === 'graphQL') return serverGraphQL
  const endpointPath = restEndpoints[endpointKey]

  switch (endpointKey) {
    case 'public':
    case 'prefs':
    case 'login':
    case 'loginOrg':
    case 'logout':
    case 'userInfo':
    case 'createHash':
    case 'generatePDF':
    case 'admin':
    case 'previewActions':
    case 'extendApplication':
    case 'getAllPrefs':
    case 'setPrefs':
    case 'setMaintenanceMode':
      return serverREST + endpointPath

    case 'userPermissions':
    case 'checkUnique':
    case 'upload':
      return `${serverREST}${endpointPath}${buildQueryString(options as UserPermissionsOptions)}`

    case 'language': {
      const { code } = options as LanguageOptions
      return `${serverREST}${endpointPath}/${code}`
    }

    case 'file': {
      const { fileId, thumbnail = false, zipFile } = options as FileOptions
      if (zipFile) return `${serverREST}${endpointPath}?zipFile=${encodeURIComponent(zipFile)}`
      return `${serverREST}${endpointPath}?uid=${fileId}${thumbnail ? '&thumbnail=true' : ''}`
    }

    case 'files': {
      return `${serverREST}${endpointPath}${buildQueryString(options as FilesOptions)}`
    }

    case 'verify': {
      const { uid } = options as VerifyOptions
      return `${serverREST}${endpointPath}?uid=${uid}`
    }

    case 'checkTrigger': {
      const { serial } = options as CheckTriggersOptions
      return `${serverREST}${endpointPath}?serial=${serial}`
    }

    case 'dataViews': {
      const dataViewOptions = (options as DataViewOptions) ?? {}
      const { dataViewCode } = dataViewOptions

      // List view
      if (!dataViewCode) return `${serverREST}${endpointPath}`

      // Detail view
      if ('itemId' in dataViewOptions) {
        const { itemId } = dataViewOptions
        return `${serverREST}${endpointPath}/${dataViewCode}/${itemId}`
      }

      // Filter list
      if ('column' in dataViewOptions) {
        const { column } = dataViewOptions
        return `${serverREST}${endpointPath}/${dataViewCode}/filterList/${column}`
      }

      // Table view
      const { query } = dataViewOptions
      return `${serverREST}${endpointPath}/${dataViewCode}${buildQueryString(query)}`
    }

    // Localisation management
    case 'localisation': {
      const localisationOptions = options as LocalisationOptions
      const { action } = localisationOptions

      // Get all
      if (action === 'getAll') return `${serverREST}${endpointPath}/get-all`

      // Enable/disable
      if (action === 'enable') {
        const { code, enabled } = localisationOptions
        return `${serverREST}${endpointPath}/enable?code=${code}&enabled=${enabled}`
      }

      // Install
      if (action === 'install') return `${serverREST}${endpointPath}/install`

      // Remove
      if (action === 'remove')
        return `${serverREST}${endpointPath}/remove?code=${localisationOptions.code}`

      throw new Error('Missing options')
    }

    case 'snapshot': {
      const snapshotOptions = options as SnapshotOptions
      const { action } = snapshotOptions
      if (action === 'list') return `${serverREST}${endpointPath}/list`

      if (action === 'purge') return `${serverREST}${endpointPath}/purge-orphan-archives`

      const name = 'name' in snapshotOptions ? snapshotOptions.name : null

      if (action === 'upload') return `${serverREST}${endpointPath}/upload`

      if (!name) throw new Error('Name parameter missing in snapshot endpoint query')

      if (action === 'download')
        return `${serverREST}${endpointPath}/download?name=${encodeURIComponent(name)}`
      // Archive details are passed in Body JSON

      if (action === 'delete')
        return `${serverREST}${endpointPath}/${action}?name=${encodeURIComponent(name)}`

      // Must be "take", "use" or "fetch-archives"
      return `${serverREST}${endpointPath}/${action}?name=${encodeURIComponent(name)}`
    }

    case 'lookupTable': {
      const lookupTableOptions = options as LookupTableOptions
      const { action } = lookupTableOptions

      // List structures
      if (action === 'list') return `${serverREST}${endpointPath}/list`

      // Single table structure
      if (action === 'table') return `${serverREST}${endpointPath}/table/${lookupTableOptions.id}`

      // Import
      if (action === 'import') {
        const { name, code } = lookupTableOptions
        return `${serverREST}${endpointPath}/import?name=${encodeURIComponent(
          name
        )}&code=${encodeURIComponent(code)}`
      }

      // "Update" uses /import/tableID route
      if (action === 'update') {
        const { id, name, code } = lookupTableOptions
        return `${serverREST}${endpointPath}/import/${id}?name=${encodeURIComponent(
          name
        )}&code=${encodeURIComponent(code)}`
      }

      // Export
      return `${serverREST}${endpointPath}/export/${lookupTableOptions.id}`
    }

    // Template Export/Import
    case 'templateImportExport': {
      const templateOptions = options as TemplateOptions
      const { action } = templateOptions
      const id = 'id' in templateOptions && templateOptions.id
      const type = 'type' in templateOptions && templateOptions.type

      switch (action) {
        case 'check':
          return `${serverREST}${endpointPath}/check/${id}`
        case 'commit':
          return `${serverREST}${endpointPath}/commit/${id}`
        case 'duplicate':
          return `${serverREST}${endpointPath}/duplicate/${type}/${id}`
        case 'prepareExport':
          return `${serverREST}${endpointPath}/prepare-export/${id}`
        case 'import':
          if (type === 'install' && 'uid' in templateOptions)
            return `${serverREST}${endpointPath}/import/${type}/${templateOptions.uid}`
          if (
            type === 'getEntityDetail' &&
            'uid' in templateOptions &&
            'group' in templateOptions &&
            'name' in templateOptions
          )
            return `${serverREST}${endpointPath}/import/get-full-entity-diff/${templateOptions.uid}?type=${templateOptions.group}&value=${templateOptions.name}`
          return `${serverREST}${endpointPath}/import/${type}`
        case 'getDataViewDetails':
          return `${serverREST}${endpointPath}/get-data-view-details/${id}`
        case 'getFragmentDetails':
          return `${serverREST}${endpointPath}/get-fragment-details/${id}`
        case 'getLinkedFiles':
          return `${serverREST}${endpointPath}/get-linked-files/${id}`
      }
    }

    case 'figTreeFragments': {
      const { frontOrBack } = options as FigTreeFragmentsOptions
      const queryString = frontOrBack === 'backEnd' ? '?backEnd=true' : '?frontEnd=true'
      return `${serverREST}${endpointPath}${queryString}`
    }

    case 'getApplicationData': {
      const { applicationId, reviewId } = options as GetApplicationDataOptions
      return `${serverREST}${endpointPath}?applicationId=${applicationId}${
        reviewId ? `&reviewId=${reviewId}` : ''
      }`
    }

    case 'archiveFiles': {
      const { days } = options as ArchiveOptions
      return `${serverREST}${endpointPath}?days=${days}`
    }

    case 'serverStatus':
      return `${serverWebSocket}${endpointPath}`

    default: {
      // "never" type ensures we will get a *compile-time* error if we are
      // missing a case defined in Endpoints types
      const missingValue: never = endpointKey
      throw new Error('Failed to consider case:' + missingValue)
    }
  }
}

const buildQueryString = (query?: Record<string, any>): string => {
  if (!query) return ''
  const keyValStrings = Object.entries(query)
    .filter(([_, value]) => !!value)
    .map(([key, value]) => `${key}=${value}`)
  return '?' + keyValStrings.join('&')
}

export default getServerUrl
