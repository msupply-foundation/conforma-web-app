import React, { createContext, useContext, useReducer } from 'react'
import { SectionProgress } from '../utils/types'

interface ApplicationState {
  id: number | null
  sections: SectionProgress[] | null
  serialNumber: string | null
}

export type ApplicationActions =
  | {
      type: 'setApplication'
      id: number
      sectionsProgress: SectionProgress[]
    }
  | {
      type: 'setPageVisited'
      sectionIndex: number
      pageNumber: number
      validation: boolean
    }
  | {
      type: 'setSerialNumber'
      serialNumber: string
    }
  | {
      type: 'reset'
    }

type ApplicationProviderProps = { children: React.ReactNode }

const reducer = (state: ApplicationState, action: ApplicationActions) => {
  switch (action.type) {
    case 'setApplication':
      const { id, sectionsProgress } = action
      return {
        ...state,
        id,
        sections: sectionsProgress,
      }
    case 'setPageVisited':
      const { sections } = state
      const { sectionIndex, pageNumber, validation } = action

      return {
        ...state,
        sections: sections
          ? {
              ...sections,
              [sectionIndex]: {
                ...sections[sectionIndex],
                [pageNumber]: { valid: validation, visited: true },
              },
            }
          : Object.assign({ [pageNumber]: { valid: validation, visited: true } }),
      }
    case 'setSerialNumber':
      const { serialNumber } = action
      return {
        ...state,
        serialNumber,
      }
    case 'reset':
      return initialState
    default:
      return state
  }
}

const initialState: ApplicationState = {
  id: null,
  sections: null,
  serialNumber: null,
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
