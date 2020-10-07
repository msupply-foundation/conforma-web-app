import React, { createContext, useContext, useReducer } from 'react'

export interface TemplateType {
  id: number
  code: string
  name: string
  description: string
  documents: string[]
}

// interface TemplateStage {
//   id: number
//   title: string
// }

export interface Section {
  id: number
  code: string
  title: string
  elementsCount: number
}

interface TemplateElement {}

type TemplateState = {
  type: TemplateType | null
  // stages: TemplateStage[] | null
  sections: Section[] | null
  elements: TemplateElement[] | null
}

export type TemplateActions =
  | {
      type: 'setTemplate'
      nextType: TemplateType
    }
  | {
      type: 'resetTemplate'
    }
  | {
      type: 'setTemplateElements'
      nextElements: TemplateElement[]
    }
  | {
      type: 'setTemplateSections'
      nextSections: Section[]
    }
// | {
//     type: 'setTemplateStages'
//     nextStages: TemplateStage[]
//   }

type TemplateProviderProps = { children: React.ReactNode }

const reducer = (state: TemplateState, action: TemplateActions) => {
  switch (action.type) {
    case 'setTemplate':
      const { nextType } = action
      return {
        ...state,
        type: nextType,
        // stages: null,
        sections: null,
        elements: null,
      }
    case 'resetTemplate':
      return {
        ...state,
        type: null,
        // stages: null,
        sections: null,
        elements: null,
      }
    case 'setTemplateElements':
      const { nextElements } = action
      return {
        ...state,
        elements: nextElements,
      }
    case 'setTemplateSections':
      const { nextSections } = action
      return {
        ...state,
        sections: nextSections,
        elements: null,
      }
    // case 'setTemplateStages':
    //   const { nextStages } = action
    //   return {
    //     ...state,
    //     stages: nextStages,
    //   }
    default:
      return state
  }
}

const initialState: TemplateState = {
  type: null,
  // stages: null,
  sections: null,
  elements: null,
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
