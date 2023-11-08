import React, { createContext, useContext, useReducer } from 'react'
import { useApolloClient } from '@apollo/client'
import fetchUserInfo from '../utils/helpers/fetchUserInfo'
import { OrganisationSimple, TemplatePermissions, User } from '../utils/types'
import config from '../config'

type UserState = {
  currentUser: User | null
  templatePermissions: TemplatePermissions
  orgList: OrganisationSimple[]
  isLoading: boolean
  isNonRegistered: boolean | null
  tokenExpiryTime: number // Unix timestamp
}

type OnLogin = (
  JWT: string,
  user?: User,
  templatePermissions?: TemplatePermissions,
  orgList?: OrganisationSimple[]
) => void

export type UserActions =
  | {
      type: 'resetCurrentUser'
    }
  | {
      type: 'setCurrentUser'
      newUser: User
      newPermissions: TemplatePermissions
      newOrgList: OrganisationSimple[]
      newTokenExpiryTime: number
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
      const { newUser, newPermissions, newOrgList, newTokenExpiryTime } = action
      return {
        ...state,
        currentUser: newUser,
        templatePermissions: newPermissions,
        orgList: newOrgList,
        isNonRegistered: newUser.username === config.nonRegisteredUser,
        tokenExpiryTime: newTokenExpiryTime,
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
  orgList: [],
  isLoading: false,
  isNonRegistered: null,
  tokenExpiryTime: 9999999999,
}

// By setting the typings here, we ensure we get intellisense in VS Code
const initialUserContext: {
  userState: UserState
  setUserState: React.Dispatch<UserActions>
  onLogin: OnLogin
  logout: () => void
  refreshJWT: () => void
} = {
  userState: initialState,
  setUserState: () => {},
  onLogin: () => {},
  logout: () => {},
  refreshJWT: () => {},
}

const UserContext = createContext(initialUserContext)

export function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const userState = state
  const setUserState = dispatch
  const client = useApolloClient()

  const logout = () => {
    // Delete everything EXCEPT language preference in localStorage
    const language = localStorage.getItem('language')
    localStorage.clear()
    if (language) localStorage.setItem('language', language)
    client.clearStore()
    window.location.href = '/login'
  }

  const onLogin: OnLogin = (JWT: string, user, templatePermissions, orgList) => {
    // NOTE: quotes are required in 'undefined', refer to https://github.com/openmsupply/conforma-web-app/pull/841#discussion_r670822649
    if (JWT == 'undefined' || JWT == undefined) logout()
    dispatch({ type: 'setLoading', isLoading: true })
    localStorage.setItem(config.localStorageJWTKey, JWT)
    if (!user || !templatePermissions || !user.permissionNames)
      fetchUserInfo({ dispatch: setUserState }, logout)
    else {
      dispatch({
        type: 'setCurrentUser',
        newUser: user,
        newPermissions: templatePermissions || {},
        newOrgList: orgList || [],
        newTokenExpiryTime: 0,
      })
      dispatch({ type: 'setLoading', isLoading: false })
    }
  }

  const refreshJWT = () => {
    fetchUserInfo({ dispatch: setUserState }, logout)
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
    <UserContext.Provider value={{ userState, setUserState, onLogin, logout, refreshJWT }}>
      {children}
    </UserContext.Provider>
  )
}

/**
 * To use and set the state of the user from anywhere in the app
 * - @returns an object with a reducer function `setUserState` and the `userState`
 */
export const useUserState = () => useContext(UserContext)
