// for production we get URL relative to web app
const { port, hostname, protocol } = window.location
const getUrl = (path: string) => `${protocol}//${hostname}:${port}/${path}`
const isProductionBuild = process.env.NODE_ENV === 'production'
const { version } = require('../package.json')

const serverURL = isProductionBuild ? getUrl('server') : 'http://localhost:8080'

const config = {
  localHostRest: 'http://localhost:8080/api',
  localHostGraphQL: 'http://localhost:5000/graphql',
  serverGraphQL: isProductionBuild
    ? getUrl('postgraphile/graphql')
    : 'http://localhost:5000/graphql',
  serverREST: `${serverURL}/api`,
  restEndpoints: {
    public: '/public',
    prefs: '/public/get-prefs',
    language: 'public/language',
    verify: 'public/verify',
    login: '/public/login',
    file: '/public/file',
    loginOrg: '/login-org',
    userInfo: '/user-info',
    userPermissions: '/user-permissions',
    checkTrigger: '/check-trigger',
    upload: '/upload',
    checkUnique: '/check-unique',
    generatePDF: '/generate-pdf',
    dataViews: '/data-views',
    admin: '/admin',
    updateRowPolicies: '/admin/updateRowPolicies',
    localisations: '/admin/localisations',
    // Enable language
    // install language
    // All languages
    // Snapshots
  },
  uploadEndpoint: '/upload',
  version,
  pluginsFolder: 'formElementPlugins',
  nonRegisteredUser: 'nonRegistered',
  localStorageJWTKey: 'persistJWT',
  applicantDeadlineCode: 'applicantDeadline',
  isProductionBuild,
}

export default config
