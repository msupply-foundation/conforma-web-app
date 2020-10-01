import React, { createContext, useContext, useReducer } from 'react'

type QueryState = {
  pathname: string
  queryParameters: { [key: string]: string }
}

export type QueryActions =
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

type QueryProviderProps = { children: React.ReactNode }

const reducer = (state: QueryState, action: QueryActions) => {
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

const initialState: QueryState = {
  pathname: '/',
  queryParameters: {},
}

const initialQueryContext: {
  queryState: QueryState
  setQueryState: React.Dispatch<QueryActions>
} = {
  queryState: initialState,
  setQueryState: () => {},
}

const QueryContext = createContext(initialQueryContext)

export function QueryProvider({ children }: QueryProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const queryState = state
  const setQueryState = dispatch

  return (
    <QueryContext.Provider value={{ queryState, setQueryState }}>{children}</QueryContext.Provider>
  )
}

/**
 * To use and set the state of the navigation query
 * - @returns an object with a reducer function `setQueryState` and the `queryState`
 */
export const useQueryState = () => useContext(QueryContext)
