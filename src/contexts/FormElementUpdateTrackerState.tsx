import React, { createContext, useContext, useReducer } from 'react'
import { ContextFormElementUpdateTrackerState } from '../utils/types'

export type UpdateAction =
  | {
      type: 'setElementEntered'
      textValue: string
    }
  | {
      type: 'setElementUpdated'
      textValue: string
    }

type FormElementUpdateTrackerProps = { children: React.ReactNode }

// TODO will have to think about storing elementEnteredTimestamp and elementUpdatedTimestamp by element code/application
// think of a use case where API query take a long time, and focus is changed to another field and submit is pressed
// straight away
const reducer = (state: ContextFormElementUpdateTrackerState, action: UpdateAction) => {
  switch (action.type) {
    case 'setElementUpdated': {
      const newState = {
        ...state,
        elementUpdatedTimestamp: Date.now(),
        elementUpdatedTextValue: action.textValue,
      }
      return {
        ...newState,
        isLastElementUpdateProcessed:
          newState.elementUpdatedTimestamp >= newState.elementEnteredTimestamp,
        wasValueChange: newState.elementUpdatedTextValue !== newState.elementEnteredTextValue,
      }
    }
    case 'setElementEntered': {
      const newState = {
        ...state,
        elementEnteredTimestamp: Date.now(),
        elementEnteredTextValue: action.textValue,
      }

      return {
        ...newState,
        isLastElementUpdateProcessed: false,
      }
    }
    default:
      return state
  }
}

const initialState: ContextFormElementUpdateTrackerState = {
  isLastElementUpdateProcessed: true,
  elementEnteredTimestamp: Date.now(),
  elementUpdatedTimestamp: Date.now(),
  elementEnteredTextValue: '',
  elementUpdatedTextValue: '',
  wasElementChange: false,
}

// By setting the typings here, we ensure we get intellisense in VS Code
const initialContext: {
  state: ContextFormElementUpdateTrackerState
  setState: React.Dispatch<UpdateAction>
} = {
  state: initialState,
  setState: () => {},
}

// No need to export this as we use it internally only
const FormElementUpdateTrackerContext = createContext(initialContext)

export function FormElementUpdateTrackerProvider({ children }: FormElementUpdateTrackerProps) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const setState = dispatch

  // pass the state and reducer to the context, dont forget to wrap the children
  return (
    <FormElementUpdateTrackerContext.Provider value={{ state, setState }}>
      {children}
    </FormElementUpdateTrackerContext.Provider>
  )
}

export const useFormElementUpdateTracker = () => useContext(FormElementUpdateTrackerContext)
