import { postRequest } from './fetchMethods'
import { LoginPayload } from '../types'
import getServerUrl from './endpoints/endpointUrlBuilder'

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
      url: getServerUrl('login'),
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
      url: getServerUrl('loginOrg'),
      headers: { 'Content-Type': 'application/json' },
    })

    if (!loginResult.success) {
      onLoginOrgFailure()
    } else onLoginOrgSuccess(loginResult)
  } catch (err) {
    throw err
  }
}
