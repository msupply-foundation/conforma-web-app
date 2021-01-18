import React, { createContext, useContext, useReducer } from 'react'
import { ApplicationDetails, ContextListState } from '../utils/types'

export type ListActions =
  | {
      type: 'setApplications'
      applications: ApplicationDetails[]
    }
  | {
      type: 'reset'
    }

type ListProviderProps = { children: React.ReactNode }

const reducer = (state: ContextListState, action: ListActions) => {
  switch (action.type) {
    case 'setApplications':
      return { ...state, applications: action.applications }
    case 'reset':
      return initialState
    default:
      return state
  }
}

const initialState: ContextListState = {
  applications: [],
}

// By setting the typings here, we ensure we get intellisense in VS Code
const initialListContext: {
  listState: ContextListState
  setListState: React.Dispatch<ListActions>
} = {
  listState: initialState,
  setListState: () => {},
}

// No need to export this as we use it internally only
const ListContext = createContext(initialListContext)

export function ListProvider({ children }: ListProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const listState = state
  const setListState = dispatch

  // pass the state and reducer to the context, dont forget to wrap the children
  return <ListContext.Provider value={{ listState, setListState }}>{children}</ListContext.Provider>
}

/**
 * To use and set the state of the current list of applications from anywhere in the app
 * - @returns an object with a reducer function `setListState` and the `listState`
 */
export const useListState = () => useContext(ListContext)
