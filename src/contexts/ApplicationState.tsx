import React, { createContext, useContext, useReducer } from 'react'

type ApplicationState = {
  id: number | null
}

export type ApplicationActions =
  | {
      type: 'setCurrentApplication'
      nextId: number
    }
  | {
      type: 'resetCurrentApplication'
    }

type ApplicationProviderProps = { children: React.ReactNode }

const reducer = (state: ApplicationState, action: ApplicationActions) => {
  switch (action.type) {
    case 'setCurrentApplication':
      const { nextId } = action
      return {
        ...state,
        id: nextId,
      }
    case 'resetCurrentApplication':
      return {
        ...state,
        id: null,
      }
    default:
      return state
  }
}

const initialState: ApplicationState = {
  id: null,
}

// By setting the typings here, we ensure we get intellisense in VS Code
const initialApplicationContext: {
  applicationState: ApplicationState
  setApplicationState: React.Dispatch<ApplicationActions>
} = {
  applicationState: initialState,
  setApplicationState: () => {},
}

// No need to export this as we use it internally only
const ApplicationContext = createContext(initialApplicationContext)

export function ApplicationProvider({ children }: ApplicationProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const applicationState = state
  const setApplicationState = dispatch

  // pass the state and reducer to the context, dont forget to wrap the children
  return (
    <ApplicationContext.Provider value={{ applicationState, setApplicationState }}>
      {children}
    </ApplicationContext.Provider>
  )
}

/**
 * To use and set the state of the current application from anywhere in the app
 * - @returns an object with a reducer function `setApplicationState` and the `applicationState`
 */
export const useApplicationState = () => useContext(ApplicationContext)
