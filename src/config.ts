// for production we get URL relative to web app
const { port, hostname, protocol } = window.location
const getUrl = (path: string) => `${protocol}//${hostname}:${port}/${path}`
const isProductionBuild = process.env.NODE_ENV === 'production'
const { version } = require('../package.json')

const serverURL = isProductionBuild ? getUrl('server') : 'http://localhost:8080'

const config = {
  serverGraphQL: isProductionBuild
    ? getUrl('postgraphile/graphql')
    : 'http://localhost:5000/graphql',
  serverREST: `${serverURL}/api`,
  uploadEndpoint: '/upload',
  version,
  pluginsFolder: 'formElementPlugins',
  nonRegisteredUser: 'nonRegistered',
  localStorageJWTKey: 'persistJWT',
  applicantDeadlineCode: 'applicantDeadline',
  isProductionBuild,
}

export default config
