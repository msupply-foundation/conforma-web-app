import React, { createContext, useContext, useReducer } from 'react'

type UserState = {
  currentUser: string | null
  users: Array<string>
}

export type UserActions =
  | {
      type: 'setCurrentUser'
      nextUser: string
    }
  | {
      type: 'resetCurrentUser'
    }
  | {
      type: 'updateUsersList'
      updatedUsers: Array<string>
    }

type UserProviderProps = { children: React.ReactNode }

const reducer = (state: UserState, action: UserActions) => {
  switch (action.type) {
    case 'setCurrentUser':
      const { nextUser } = action
      return {
        ...state,
        currentUser: nextUser,
      }
    case 'resetCurrentUser':
      return {
        ...state,
        currentUser: null,
      }
    case 'updateUsersList':
      const { updatedUsers } = action
      return {
        ...state,
        users: updatedUsers,
      }
    default:
      return state
  }
}

const initialState: UserState = {
  currentUser: null,
  users: new Array<string>(),
}

// By setting the typings here, we ensure we get intellisense in VS Code
const initialUserContext: {
  userState: UserState
  setUserState: React.Dispatch<UserActions>
} = {
  userState: initialState,
  setUserState: () => {},
}

const UserContext = createContext(initialUserContext)

export function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const userState = state
  const setUserState = dispatch

  // Return the state and reducer to the context (wrap around the children)
  return <UserContext.Provider value={{ userState, setUserState }}>{children}</UserContext.Provider>
}

/**
 * To use and set the state of the user from anywhere in the app
 * - @returns an object with a reducer function `setUserState` and the `userState`
 */
export const useUserState = () => useContext(UserContext)
