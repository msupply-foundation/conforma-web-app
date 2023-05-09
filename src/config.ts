// for production we get URL relative to web app
const isProductionBuild = process.env.NODE_ENV === 'production'
const { version } = require('../package.json')

// To connect to a remote server, store url(s) in .env file:
// REMOTE_SERVER=<server-url>
const remoteServer = process.env.REMOTE_SERVER

const remoteRestServer = remoteServer ? `${remoteServer}/server/api` : null
const remoteGraphQLServer = remoteServer ? `${remoteServer}/graphql` : null

const config = {
  devServerRest: remoteRestServer ?? 'http://localhost:8080/api',
  devServerGraphQL: remoteGraphQLServer ?? 'http://localhost:5000/graphql',
  productionPathREST: '/server/api',
  productionPathGraphQL: '/postgraphile/graphql',
  restEndpoints: {
    // Public
    public: '/public',
    prefs: '/public/get-prefs',
    language: '/public/language',
    login: '/public/login',
    file: '/public/file',
    verify: '/public/verify',
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
    // Admin
    admin: '/admin',
    // updateRowPolicies: '/admin/updateRowPolicies', //-- not currently called by front-end
    enableLanguage: '/admin/enable-language',
    installLanguage: '/admin/install-language',
    allLanguages: '/admin/all-languages',
    removeLanguage: '/admin/remove-language',
    snapshot: '/admin/snapshot',
    getApplicationData: '/admin/get-application-data',
    getAllPrefs: '/admin/get-all-prefs',
    setPrefs: '/admin/set-prefs',
  },
  version,
  pluginsFolder: 'formElementPlugins',
  nonRegisteredUser: 'nonRegistered',
  localStorageJWTKey: 'persistJWT',
  applicantDeadlineCode: 'applicantDeadline',
  isProductionBuild,
  debounceTimeout: 350, // milliseconds,
  // These are the only default tables in the system that we allow to be mutated
  // directly by modifyRecord or display as data views. All other names must
  // have "data_table_" prepended.
  dataViewAllowedTableNames: ['user', 'organisation', 'file'],
}

export default config
