import React, { createContext, useContext, useReducer } from 'react'
import { useApolloClient } from '@apollo/client'
import fetchUserInfo from '../utils/helpers/fetchUserInfo'
import { OrganisationSimple, TemplatePermissions, User } from '../utils/types'
import config from '../config'
import { usePrefs } from '../contexts/SystemPrefs'

type UserState = {
  currentUser: User | null
  templatePermissions: TemplatePermissions
  permissionNames: string[]
  orgList: OrganisationSimple[]
  isLoading: boolean
  isNonRegistered: boolean | null
  isAdmin: boolean
  isManager: boolean
}

type OnLogin = (
  JWT: string,
  user?: User,
  templatePermissions?: TemplatePermissions,
  permissionNames?: string[],
  orgList?: OrganisationSimple[],
  isAdmin?: boolean
) => void

export type UserActions =
  | {
      type: 'resetCurrentUser'
    }
  | {
      type: 'setCurrentUser'
      newUser: User
      newPermissions: TemplatePermissions
      newPermissionNames: string[]
      newOrgList: OrganisationSimple[]
      newIsAdmin: boolean
      newIsManager: boolean
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
    case 'setCurrentUser':
      const { newUser, newPermissions, newPermissionNames, newOrgList, newIsAdmin, newIsManager } =
        action
      return {
        ...state,
        currentUser: newUser,
        templatePermissions: newPermissions,
        permissionNames: newPermissionNames,
        orgList: newOrgList,
        isAdmin: newIsAdmin,
        isManager: newIsManager,
        isNonRegistered: newUser.username === config.nonRegisteredUser,
      }
    case 'setLoading':
      const { isLoading } = action
      return {
        ...state,
        isLoading,
      }
    default:
      return state
  }
}

const initialState: UserState = {
  currentUser: null,
  templatePermissions: {},
  permissionNames: [],
  orgList: [],
  isLoading: false,
  isNonRegistered: null,
  isAdmin: false,
  isManager: false,
}

// By setting the typings here, we ensure we get intellisense in VS Code
const initialUserContext: {
  userState: UserState
  setUserState: React.Dispatch<UserActions>
  onLogin: OnLogin
  logout: () => void
} = {
  userState: initialState,
  setUserState: () => {},
  onLogin: () => {},
  logout: () => {},
}

const UserContext = createContext(initialUserContext)

export function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const userState = state
  const setUserState = dispatch
  const client = useApolloClient()
  const { preferences } = usePrefs()

  const managementPrefName =
    preferences?.systemManagerPermissionName || config.defaultSystemManagerPermissionName

  const logout = () => {
    // Delete everything EXCEPT language preference in localStorage
    const language = localStorage.getItem('language')
    localStorage.clear()
    if (language) localStorage.setItem('language', language)
    client.clearStore()
    window.location.href = '/login'
  }

  const onLogin: OnLogin = (
    JWT: string,
    user,
    templatePermissions,
    permissionNames,
    orgList,
    isAdmin
  ) => {
    // NOTE: quotes are required in 'undefined', refer to https://github.com/openmsupply/conforma-web-app/pull/841#discussion_r670822649
    if (JWT == 'undefined' || JWT == undefined) logout()
    dispatch({ type: 'setLoading', isLoading: true })
    localStorage.setItem(config.localStorageJWTKey, JWT)
    if (!user || !templatePermissions || !permissionNames)
      fetchUserInfo({ dispatch: setUserState }, logout)
    else {
      dispatch({
        type: 'setCurrentUser',
        newUser: user,
        newPermissions: templatePermissions || {},
        newPermissionNames: permissionNames || [],
        newOrgList: orgList || [],
        newIsAdmin: !!isAdmin,
        newIsManager: permissionNames.includes(managementPrefName),
      })
      dispatch({ type: 'setLoading', isLoading: false })
    }
  }

  // Initial check for persisted user in local storage
  const JWT = localStorage.getItem(config.localStorageJWTKey)
  // NOTE: quotes are required in 'undefined', refer to https://github.com/openmsupply/conforma-web-app/pull/841#discussion_r670822649
  if (JWT === 'undefined') logout()
  if (JWT && !userState.currentUser && !userState.isLoading) {
    onLogin(JWT)
  }

  // Return the state and reducer to the context (wrap around the children)
  return (
    <UserContext.Provider value={{ userState, setUserState, onLogin, logout }}>
      {children}
    </UserContext.Provider>
  )
}

/**
 * To use and set the state of the user from anywhere in the app
 * - @returns an object with a reducer function `setUserState` and the `userState`
 */
export const useUserState = () => useContext(UserContext)
