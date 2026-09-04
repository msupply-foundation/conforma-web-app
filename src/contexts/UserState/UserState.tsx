import React, { createContext, useContext, useEffect, useReducer, useMemo } from 'react'
import { useApolloClient } from '@apollo/client'
import fetchUserInfo from '../../utils/helpers/fetchUserInfo'
import { Position, useToast } from '../Toast'
import { LoginPayload, OrganisationSimple, TemplatePermissions, User } from '../../utils/types'
import config from '../../config'
import { usePrefs } from '../SystemPrefs'
import { LanguageStrings, useLanguageProvider } from '../Localisation'
import { SessionActivityTimer, setSessionExpiry } from './SessionActivityTimer'
import { clearLocalStorageExcept } from '../../utils/helpers/utilityFunctions'
import { loadFragments } from '../../FigTreeEvaluator'
import { postRequest } from '../../utils/helpers/fetchMethods'
import getServerUrl from '../../utils/helpers/endpoints/endpointUrlBuilder'
import isLoggedIn from '../../utils/helpers/loginCheck'

type UserState = {
  currentUser: User | null
  templatePermissions: TemplatePermissions
  orgList: OrganisationSimple[]
  isLoading: boolean
  isNonRegistered: boolean | null
}

// The access and refresh tokens are HttpOnly cookies, set by the server on the
// login response, so there is no credential for the caller to pass in here --
// see kdd/auth-token-lifecycle §3. Called with no payload to restore a session
// the browser still holds cookies for, in which case the user's details are
// re-fetched from "/user-info".
type OnLogin = (loginPayload?: Partial<LoginPayload>) => void

export type UserActions =
  | {
      type: 'resetCurrentUser'
    }
  | {
      type: 'setCurrentUser'
      newUser: User
      newPermissions: TemplatePermissions
      newOrgList: OrganisationSimple[]
    }
  | {
      type: 'setLoading'
      isLoading: boolean
    }

type UserProviderProps = { children: React.ReactNode }

const reducer = (state: UserState, action: UserActions) => {
  switch (action.type) {
    case 'resetCurrentUser':
      return initialState
    case 'setCurrentUser': {
      const { newUser, newPermissions, newOrgList } = action
      return {
        ...state,
        currentUser: newUser,
        templatePermissions: newPermissions,
        orgList: newOrgList,
        isNonRegistered: newUser.username === config.nonRegisteredUser,
      }
    }
    case 'setLoading': {
      const { isLoading } = action
      return {
        ...state,
        isLoading,
      }
    }
    default:
      return state
  }
}

const initialState: UserState = {
  currentUser: null,
  templatePermissions: {},
  orgList: [],
  isLoading: false,
  isNonRegistered: null,
}

const initialUserContext: {
  userState: UserState
  setUserState: React.Dispatch<UserActions>
  onLogin: OnLogin
  logout: () => void
  checkSession: () => void
} = {
  userState: initialState,
  setUserState: () => {},
  onLogin: () => {},
  logout: () => {},
  checkSession: () => {},
}

const UserContext = createContext(initialUserContext)

/*
Ending a session reloads the page, and a toast is React state, so an explanation
shown before the reload would never be read. The reason is left in local storage
instead and picked up by the next mount, on the login screen it lands on.

It is a localisation key rather than a message, so it is translated when it's
shown -- the language provider may not have the user's language loaded at the
moment the session ends.
*/
const LOGOUT_REASON_KEY = 'logoutReason'
type LogoutReason = keyof LanguageStrings

export function UserProvider({ children }: UserProviderProps) {
  const { t } = useLanguageProvider()
  const [state, dispatch] = useReducer(reducer, initialState)
  const userState = state
  const setUserState = dispatch
  const client = useApolloClient()
  const { preferences } = usePrefs()
  const { showToast, clearAllToasts } = useToast()

  // The reason for a logout the user didn't ask for is shown once, on the login
  // screen the reload lands on
  useEffect(() => {
    const reason = localStorage.getItem(LOGOUT_REASON_KEY) as LogoutReason | null
    if (!reason) return
    localStorage.removeItem(LOGOUT_REASON_KEY)
    showToast({
      title: t('MENU_LOGOUT'),
      text: t(reason),
      style: 'negative',
      position: Position.topMiddle,
      timeout: 0,
    })
  }, [])

  // Everything a logout does in this browser. Whether the session also ends on
  // the server is a separate question -- see logout and endSession.
  const clearSession = (logoutReason?: LogoutReason) => {
    clearLocalStorageExcept(['language', 'redirectLocation', 'maintenanceMode'])
    // Written after the clear, and read back after the reload below
    if (logoutReason) localStorage.setItem(LOGOUT_REASON_KEY, logoutReason)
    client.clearStore()
    setUserState({ type: 'resetCurrentUser' })
    sessionTimer.end()
    // Forcing a refresh makes the app reload, which is useful if the app has
    // been upgraded but still using locally cached javascript
    location.reload()
  }

  // The session has ended on the server -- it reached its deadline, or was
  // revoked, or another tab logged out -- so there is nothing to tell it, only
  // local state to discard and a reason to explain it with
  const endSession = () => clearSession('LOGOUT_INACTIVITY_ALERT')

  /*
  Asks the server whether the session is still there, and ends it here if the
  answer is no. Every logout the user didn't ask for goes through this, so the
  server's 401 is what ends a session rather than anything the app worked out
  for itself -- and that 401 is also the only thing that can expire the auth
  cookies, since they are HttpOnly and no script can discard them.

  A request that fails for some other reason says nothing about the session, so
  it leaves the user logged in and is tried again later.

  "idleDeadline" is passed by the activity timer, whose calls double as the
  keep-alive; a caller with no deadline to report is only checking.
  */
  const checkSession = (idleDeadline?: number) =>
    fetchUserInfo({ dispatch: setUserState }, endSession, {
      logoutOnRequestFailure: false,
      idleDeadline,
    })

  const sessionTimer = useMemo(
    () =>
      // Using useMemo to ensure only one instance created
      new SessionActivityTimer({
        sessionTimeout: preferences.logoutAfterInactivity,
        // Hitting "/user-info" is what extends the session on the server, and
        // the deadline it carries is what stops the session outliving it
        onKeepAlive: checkSession,
        onSessionEnded: endSession,
      }),
    []
  )

  // The user asked to log out, so the session is ended on the server as well --
  // which is also the only way to expire the HttpOnly cookies. Note this ends
  // the user's sessions on every device: there is one Logout action in the UI
  // and it means all of them.
  const logout = async () => {
    try {
      await postRequest({
        url: getServerUrl('logout'),
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (err) {
      console.error('Problem ending session:', err)
    }
    clearSession()
  }

  const onLogin: OnLogin = (loginPayload) => {
    const { user, templatePermissions, orgList, sessionExpiry } = loginPayload ?? {}
    clearAllToasts()
    dispatch({ type: 'setLoading', isLoading: true })
    localStorage.setItem(config.localStorageLoginKey, 'true')
    // Refresh the FigTree fragments available to the global evaluator
    loadFragments()
    if (!user || !templatePermissions || !user.permissionNames) {
      // Failure here means the session couldn't be restored, so there is
      // nothing to end on the server -- and if it turns out to have been a
      // network blip, the session is still good and must not be touched
      fetchUserInfo({ dispatch: setUserState }, clearSession)
    } else {
      if (sessionExpiry) setSessionExpiry(sessionExpiry)
      dispatch({
        type: 'setCurrentUser',
        newUser: user,
        newPermissions: templatePermissions || {},
        newOrgList: orgList || [],
      })
      dispatch({ type: 'setLoading', isLoading: false })
    }

    // Started unconditionally: when auto-logout is disabled the session's
    // deadline is set decades out, so the timer simply never needs to keep it
    // alive, and it still notices another tab logging out
    sessionTimer.start()
  }

  // Restore the session recorded in local storage. Its cookies are sent
  // automatically, so onLogin only needs to re-fetch the user's details -- and
  // if the session has since been revoked or expired, that request fails and
  // takes us to the login screen
  if (isLoggedIn() && !userState.currentUser && !userState.isLoading) {
    onLogin()
  }

  // Return the state and reducer to the context (wrap around the children)
  return (
    <UserContext.Provider value={{ userState, setUserState, onLogin, logout, checkSession }}>
      {children}
    </UserContext.Provider>
  )
}

/**
 * To use and set the state of the user from anywhere in the app
 * - @returns an object with a reducer function `setUserState` and the `userState`
 */
export const useUserState = () => useContext(UserContext)
