// for production we get URL relative to web app
const isProductionBuild = import.meta.env.MODE === 'production'
import { version } from '../package.json'

// To connect to a remote server, store url(s) in .env file:
// VITE_REMOTE_SERVER=<server-url>
const remoteServer = import.meta.env.VITE_REMOTE_SERVER ?? null

const remoteRestServer = remoteServer ? `${remoteServer}/server/api` : null
const remoteGraphQLServer = remoteServer ? `${remoteServer}/server/graphql` : null

// In local dev (no remote server) HTTP requests use relative paths so they
// flow through the vite dev-server proxy (see vite.config.ts) and the
// browser treats them as same-origin — matching production. The websocket
// connection isn't proxied, so it needs an absolute URL regardless; that's
// what `devServerRestAbsolute` is for.
const devServerRestAbsolute = remoteRestServer ?? 'http://localhost:8080/api'

const config = {
  devServerRest: remoteRestServer ?? '/api',
  devServerGraphQL: remoteGraphQLServer ?? '/graphql',
  devServerRestAbsolute,
  productionPathREST: '/server/api',
  productionPathGraphQL: '/server/graphql',
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
  localStorageJWTKey: 'persistJWT',
  applicantDeadlineCode: 'applicantDeadline',
  isProductionBuild,
  debounceTimeout: 350, // milliseconds,
  // These are the only system tables that we allow to have Data View configuration, plus any "data_table" tables.
  dataViewAllowedTableNames: ['user', 'organisation', 'file'],
}

export default config
