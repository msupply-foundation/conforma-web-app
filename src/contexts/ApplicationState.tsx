import React, { createContext, useContext, useReducer } from 'react'

export interface Page {
  sectionCode: string
  sectionTitle: string
  firstElement?: string
  lastElement?: string | null
  templateId: number
}

type ApplicationState = {
  pageIndex: number | null
  pageNumber: number | null
  pages: Page[] | null
  serialNumber: number | null
}

export type ApplicationActions =
  | {
      type: 'setSerialNumber'
      serialNumber: number
    }
  | {
    type: 'setCurretPage'
    pageNumber: number
  }
  | {
    type: 'setPages'
    pages: Page[]
  }
  | {
      type: 'reset'
    }

type ApplicationProviderProps = { children: React.ReactNode }

const reducer = (state: ApplicationState, action: ApplicationActions) => {
  switch (action.type) {
    case 'setSerialNumber':
      const { serialNumber } = action
      return {
        ...state,
        serialNumber,
      }
      case 'setCurretPage':
        const { pageNumber } = action
        return {
          ...state,
          pageIndex: (!state.pages) ? null : state.pages.length >= pageNumber ? pageNumber-1 : null,
          pageNumber 
        }
      case 'setPages':
        const { pages } = action
        return {
          ...state,
          pages,
          pageIndex: pages.length > 0 ? 0 : null,
          pageNumber: 1
        }
    case 'reset':
      return initialState
    default:
      return state
  }
}

const initialState: ApplicationState = {
  pageIndex: null,
  pageNumber: null,
  pages: null,
  serialNumber: null
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
