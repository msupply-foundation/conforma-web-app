import React, { createContext, useContext, useReducer } from 'react'

interface TemplateType {
  id: number
  code: string
  name: string
  description: string
  documents: string[]
}
interface TemplateSection {
  id: number
  code: string
  title: string
  elementsCount: number
}

type TemplateState = {
  type: TemplateType | null
  sections: TemplateSection[] | null
}

export type TemplateActions =
  | {
      type: 'setCurrentTemplate'
      nextType: TemplateType
      nextSections: TemplateSection[]
    }
  | {
      type: 'resetCurrentTemplate'
    }

type TemplateProviderProps = { children: React.ReactNode }

const reducer = (state: TemplateState, action: TemplateActions) => {
  switch (action.type) {
    case 'setCurrentTemplate':
      const { nextType, nextSections } = action
      return {
        ...state,
        type: nextType,
        sections: nextSections,
      }
    case 'resetCurrentTemplate':
      return {
        ...state,
        type: null,
        sections: null,
      }
    default:
      return state
  }
}

const initialState: TemplateState = {
  type: null,
  sections: null,
}

// By setting the typings here, we ensure we get intellisense in VS Code
const initialTemplateContext: {
  templateState: TemplateState
  setTemplateState: React.Dispatch<TemplateActions>
} = {
  templateState: initialState,
  // will update to the reducer we provide in MapProvider
  setTemplateState: () => {},
}

// No need to export this as we use it internally only
const TemplateContext = createContext(initialTemplateContext)

export function TemplateProvider({ children }: TemplateProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const templateState = state
  const setTemplateState = dispatch

  // pass the state and reducer to the context, dont forget to wrap the children
  return (
    <TemplateContext.Provider value={{ templateState, setTemplateState }}>
      {children}
    </TemplateContext.Provider>
  )
}

/**
 * To use and set the state of the current template from anywhere in the app
 * - @returns an object with a reducer function `setTemplateState` and the `templateState`
 */
export const useTemplateState = () => useContext(TemplateContext)
