// for production we get URL relative to web app
const isProductionBuild = process.env.NODE_ENV === 'production'
const { version } = require('../package.json')

const config = {
  localHostRest: 'http://localhost:8080/api',
  localHostGraphQL: 'http://localhost:5000/graphql',
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
    // Admin
    admin: '/admin',
    // updateRowPolicies: '/admin/updateRowPolicies', //-- not currently called by front-end
    enableLanguage: '/admin/enable-language',
    installLanguage: '/admin/install-language',
    allLanguages: '/admin/all-languages',
    removeLanguage: '/admin/remove-language',
    snapshot: '/admin/snapshot',
    lookupTable: '/admin/lookup-table',
    getApplicationData: '/admin/get-application-data',
  },
  version,
  pluginsFolder: 'formElementPlugins',
  nonRegisteredUser: 'nonRegistered',
  localStorageJWTKey: 'persistJWT',
  applicantDeadlineCode: 'applicantDeadline',
  isProductionBuild,
}

export default config
