import { postRequest } from './fetchMethods'
import config from '../../config'
import { LoginPayload } from '../types'

const loginURL = config.serverREST + '/public/login'
const loginOrgURL = config.serverREST + '/login-org'

interface loginParameters {
  username: string
  password: string
  sessionId?: string
  onLoginSuccess: Function
  onLoginFailure?: Function
}
interface loginOrgParameters {
  orgId: number
  sessionId?: string
  onLoginOrgSuccess: Function
  onLoginOrgFailure?: Function
}

export const attemptLogin = async ({
  username,
  password,
  sessionId,
  onLoginSuccess,
  onLoginFailure = () => {},
}: loginParameters) => {
  try {
    const loginResult: LoginPayload = await postRequest({
      jsonBody: { username, password, sessionId },
      url: loginURL,
      headers: { 'Content-Type': 'application/json' },
    })

    if (!loginResult.success) {
      onLoginFailure()
    } else onLoginSuccess(loginResult)
  } catch (err) {
    throw err
  }
}

export const attemptLoginOrg = async ({
  orgId,
  sessionId,
  onLoginOrgSuccess,
  onLoginOrgFailure = () => {},
}: loginOrgParameters) => {
  try {
    const loginResult: LoginPayload = await postRequest({
      jsonBody: { orgId, sessionId },
      url: loginOrgURL,
      headers: { 'Content-Type': 'application/json' },
    })

    if (!loginResult.success) {
      onLoginOrgFailure()
    } else onLoginOrgSuccess(loginResult)
  } catch (err) {
    throw err
  }
}
