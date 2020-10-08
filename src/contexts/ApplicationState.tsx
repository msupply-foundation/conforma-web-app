import React, { createContext, useContext, useEffect, useReducer } from 'react'

interface Section {
  id: number
  code: string
  title: string
  templateId: number
}

type ApplicationState = {
  appTemplateId: number | null
  isLoading: boolean
  name: string | null
  sections: Section[] | null
  serial: number | null
}

export type ApplicationActions =
  | {
      type: 'setApplication'
      nextName: string
      nextSerial: number
      nextTempId: number
    }
  | {
      type: 'setSection'
      newSection: Section
    }
  | {
      type: 'setLoading'
      isLoading: boolean
    }
  | {
      type: 'resetApplication'
    }

type ApplicationProviderProps = { children: React.ReactNode }

const reducer = (state: ApplicationState, action: ApplicationActions) => {
  switch (action.type) {
    case 'setApplication':
      const { nextName, nextSerial, nextTempId } = action
      return {
        ...state,
        appTemplateId: nextTempId,
        isLoading: false,
        name: nextName,
        sections: new Array<Section>(),
        serial: nextSerial,
      }
    case 'setSection':
      const { newSection } = action
      const { sections } = state
      return {
        ...state,
        sections: sections ? [...sections, newSection] : new Array<Section>(newSection),
      }
    case 'setLoading':
      const { isLoading } = action
      return {
        ...state,
        isLoading,
      }
    case 'resetApplication':
      return {
        ...state,
        appTemplateId: null,
        isLoading: false,
        name: null,
        sections: null,
        serial: null,
      }
    default:
      return state
  }
}

const initialState: ApplicationState = {
  isLoading: false,
  name: null,
  serial: null,
  sections: null,
  appTemplateId: null,
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
