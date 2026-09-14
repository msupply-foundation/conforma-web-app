// for production we get URL relative to web app
const isProductionBuild = import.meta.env.MODE === 'production'
import { version } from '../package.json'

// To connect to a remote server, store url(s) in .env file:
// VITE_REMOTE_SERVER=<server-url>
const remoteServer = import.meta.env.VITE_REMOTE_SERVER ?? null

const remoteRestServer = remoteServer ? `${remoteServer}/server/api` : null
const remoteGraphQLServer = remoteServer ? `${remoteServer}/server/graphql` : null

// In dev mode the vite dev-server proxy (see vite.config.ts) handles
// backend traffic for both local and remote targets, so HTTP URLs are
// always relative — same-origin behaviour matching production.
//
// The absolute URLs to the actual backend are still needed for the one mode
// that DOESN'T go through the dev-server proxy: `VITE_USE_DEV_SERVER` (a
// production build pointed at a dev backend, where the dev-server proxy isn't
// in play at all).
const devServerRestAbsolute = remoteRestServer ?? 'http://localhost:8080/api'
const devServerGraphQLAbsolute = remoteGraphQLServer ?? 'http://localhost:8080/graphql'

const config = {
  devServerRest: '/api',
  devServerGraphQL: '/graphql',
  devServerRestAbsolute,
  devServerGraphQLAbsolute,
  productionPathREST: '/server/api',
  productionPathGraphQL: '/server/graphql',
  // A deployment serves the websocket under its own path rather than /server
  productionPathWebSocket: '/websocket/',
  restEndpoints: {
    // Public
    public: '/public',
    prefs: '/public/get-prefs',
    language: '/public/language',
    login: '/public/login',
    file: '/public/file',
    verify: '/public/verify',
    figTreeFragments: '/public/fragments',
    // Auth required
    loginOrg: '/login-org',
    logout: '/logout',
    heartbeat: '/heartbeat',
    userInfo: '/user-info',
    userPermissions: '/user-permissions',
    createHash: '/create-hash',
    checkTrigger: '/check-triggers',
    upload: '/upload',
    checkUnique: '/check-unique',
    generatePDF: '/generate-pdf',
    dataViews: '/data-views',
    previewActions: '/preview-actions',
    extendApplication: '/extend-application',
    lookupTable: '/lookup-table',
    localisation: '/localisation',
    files: '/files',
    // Admin
    admin: '/admin',
    // updateRowPolicies: '/admin/updateRowPolicies', //-- not currently called by front-end
    snapshot: '/admin/snapshot',
    getApplicationData: '/admin/get-application-data',
    getAllPrefs: '/admin/get-all-prefs',
    setPrefs: '/admin/set-prefs',
    archiveFiles: '/admin/archive-files',
    setMaintenanceMode: '/admin/set-maintenance-mode',
    templateImportExport: '/admin/template',
    // WebSocket
    serverStatus: 'server-status',
  },
  version,
  pluginsFolder: 'formElementPlugins',
  nonRegisteredUser: 'nonRegistered',
  // The auth tokens are HttpOnly cookies, so the front-end never sees them.
  // This flag is only a local record that we believe a session exists, so the
  // app knows to restore it on load rather than redirect to login.
  localStorageLoginKey: 'isLoggedIn',
  applicantDeadlineCode: 'applicantDeadline',
  isProductionBuild,
  debounceTimeout: 350, // milliseconds,
  // These are the only system tables that we allow to have Data View configuration, plus any "data_table" tables.
  dataViewAllowedTableNames: ['user', 'organisation', 'file'],
}

export default config
