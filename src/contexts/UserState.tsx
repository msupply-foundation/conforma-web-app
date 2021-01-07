import React, { createContext, useContext, useReducer } from 'react'
import fetchUserInfo from '../utils/helpers/fetchUserInfo'
import { TemplatePermissions, User } from '../utils/types'

type UserState = {
  currentUser: User | null
  templatePermissions: TemplatePermissions
}

export type UserActions =
  | {
      type: 'resetCurrentUser'
    }
  | {
      type: 'setCurrentUser'
      newUser: User
      newPermissions: TemplatePermissions
    }
  | {
      type: 'setTemplatePermissions'
      templatePermissions: TemplatePermissions
    }

type UserProviderProps = { children: React.ReactNode }

const reducer = (state: UserState, action: UserActions) => {
  switch (action.type) {
    case 'resetCurrentUser':
      return initialState
    case 'setCurrentUser':
      const { newUser, newPermissions } = action
      return {
        ...state,
        currentUser: newUser,
        templatePermissions: newPermissions,
      }
    case 'setTemplatePermissions':
      const { templatePermissions } = action
      return {
        ...state,
        templatePermissions,
      }
    default:
      return state
  }
}

const initialState: UserState = {
  currentUser: null,
  templatePermissions: {},
}

// By setting the typings here, we ensure we get intellisense in VS Code
const initialUserContext: {
  userState: UserState
  setUserState: React.Dispatch<UserActions>
  login: Function
  logout: Function
} = {
  userState: initialState,
  setUserState: () => {},
  login: () => {},
  logout: () => {},
}

const UserContext = createContext(initialUserContext)

export function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const userState = state
  const setUserState = dispatch

  const login = (JWT: string) => {
    localStorage.setItem('persistJWT', JWT)
    fetchUserInfo({ dispatch: setUserState })
  }

  const logout = () => {
    localStorage.clear()
    dispatch({ type: 'resetCurrentUser' })
  }

  // Initial check for persisted user in local storage
  const JWT = localStorage.getItem('persistJWT')
  if (JWT && !userState.currentUser) login(JWT)

  // Return the state and reducer to the context (wrap around the children)
  return (
    <UserContext.Provider value={{ userState, setUserState, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

/**
 * To use and set the state of the user from anywhere in the app
 * - @returns an object with a reducer function `setUserState` and the `userState`
 */
export const useUserState = () => useContext(UserContext)
