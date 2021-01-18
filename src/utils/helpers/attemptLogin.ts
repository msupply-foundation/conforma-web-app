import { postRequest as attemptLogin } from './fetchMethods'
import config from '../../config.json'

const loginURL = config.serverREST + '/login'
const loginOrgURL = config.serverREST + '/login-org'
