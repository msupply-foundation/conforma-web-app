import React, { createContext, useContext, useReducer } from 'react'

type NavigationState = {
  pathname: string
  queryParameters: { [key: string]: string }
}

export type NavigationActions =
  | {
      type: 'updateParameters'
      search: string
    }
  | {
      type: 'setPathname'
      pathname: string
    }
  | {
      type: 'clearParameters'
    }

type NavigationProviderProps = { children: React.ReactNode }

const reducer = (state: NavigationState, action: NavigationActions) => {
  switch (action.type) {
    case 'clearParameters':
      return {
        ...state,
        queryParameters: {},
      }
    case 'updateParameters':
      const { search } = action
      const newParameters: { [key: string]: string } = {}
      const query = new URLSearchParams(search)
      query.forEach((value, key) => (newParameters[key] = value))
      return {
        ...state,
        queryParameters: newParameters,
      }
    case 'setPathname':
      const { pathname } = action
      return {
        ...state,
        pathname,
      }
    default:
      return state
  }
}

const initialState: NavigationState = {
  pathname: '/',
  queryParameters: {},
}

const initialNavigationContext: {
  navigationState: NavigationState
  setNavigationState: React.Dispatch<NavigationActions>
} = {
  navigationState: initialState,
  setNavigationState: () => {},
}

const NavigationContext = createContext(initialNavigationContext)

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const navigationState = state
  const setNavigationState = dispatch

  return (
    <NavigationContext.Provider
      value={{ navigationState: navigationState, setNavigationState: setNavigationState }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

/**
 * To use and set the state of the navigation query
 * - @returns an object with:
 *  - Reducer function `setNavigationState`
 *  - Current state `navigationState`
 */
export const useNavigationState = () => useContext(NavigationContext)
