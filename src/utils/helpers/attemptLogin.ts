import { postRequest } from './fetchMethods'
import { LoginPayload } from '../types'
import getServerUrl from './endpoints/endpointUrlBuilder'
import config from '../../config'

// The auth cookies are HttpOnly, so a flag in local storage is the app's only
// record that a session exists (see `loginCheck`). These two endpoints are
// where the server creates one, so the flag is written here rather than by the
// caller -- it then holds however the login was initiated, including from
// `AdminLogin`, which renders outside `UserProvider` and so has no `onLogin`.
const recordSessionStarted = () => localStorage.setItem(config.localStorageLoginKey, 'true')

interface loginParameters {
  username: string
  password: string
  sessionId?: string
  onLoginSuccess: (loginResult: LoginPayload) => void
  onLoginFailure?: () => void
}
interface loginOrgParameters {
  orgId: number
  sessionId?: string
  onLoginOrgSuccess: (loginResult: LoginPayload) => void
  onLoginOrgFailure?: () => void
}

export const attemptLogin = async ({
  username,
  password,
  sessionId,
  onLoginSuccess,
  onLoginFailure = () => {},
}: loginParameters) => {
  const loginResult: LoginPayload = await postRequest({
    jsonBody: { username, password, sessionId },
    url: getServerUrl('login'),
    headers: { 'Content-Type': 'application/json' },
  })

  if (!loginResult.success) {
    onLoginFailure()
  } else {
    recordSessionStarted()
    onLoginSuccess(loginResult)
  }
}

export const attemptLoginOrg = async ({
  orgId,
  sessionId,
  onLoginOrgSuccess,
  onLoginOrgFailure = () => {},
}: loginOrgParameters) => {
  const loginResult: LoginPayload = await postRequest({
    jsonBody: { orgId, sessionId },
    url: getServerUrl('loginOrg'),
    headers: { 'Content-Type': 'application/json' },
  })

  if (!loginResult.success) {
    onLoginOrgFailure()
  } else {
    recordSessionStarted()
    onLoginOrgSuccess(loginResult)
  }
}
