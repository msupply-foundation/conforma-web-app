import React, { createContext, useContext, useReducer } from 'react'

interface SingleFormElementUpdateState {
  enteredTimestamp: number
  enteredSequence: number // See calculateLatestChangedTimestamp timestamps for explanation
  previousEnteredTextValue?: string
  enteredTextValue?: string
  updatedSequence: number
  changedTimestamp: number
}

const elementStateDefault: SingleFormElementUpdateState = {
  enteredTimestamp: 0,
  enteredSequence: 0,
  updatedSequence: 0,
  changedTimestamp: 0,
}

interface ContextFormElementUpdateTrackerState {
  elementsUpdateState: { [elementCode: string]: SingleFormElementUpdateState }
  // if still waiting for element to update (i.e. it's still in focus, then it will be set to 'infinity')
  // if no elements were updated, it will be set to 0
  latestChangedElementUpdateTimestamp: number
  // This refers to elements that are either:
  // - having their parameters re-evaluated
  // - saving to server
  // We want to make sure the user can't move ahead while these are in progress,
  // otherwise we can end up with invalid or inconsistent responses slipping
  // through
  elementCurrentlyProcessing: Set<string>
}

const contextStateDefault: ContextFormElementUpdateTrackerState = {
  elementsUpdateState: {},
  latestChangedElementUpdateTimestamp: 0,
  elementCurrentlyProcessing: new Set(),
}

const calculateLatestChangedTimestamp = (elementsUpdateState: {
  [elementCode: string]: SingleFormElementUpdateState
}) =>
  Object.values(elementsUpdateState).reduce((latestUpdateTimestamp, singleElementState) => {
    if (latestUpdateTimestamp === Infinity) return Infinity
    const { enteredSequence, updatedSequence, changedTimestamp } = singleElementState
    // Element is in focus still when entered sequence is higher then updated sequence, using sequence to accommodate plugins like password
    // which have two fields for the same element, and there is a race condition when second field entered
    // occurs before first field exit (because exit is triggered after mutation)
    if (enteredSequence > updatedSequence) return Infinity

    return Math.max(latestUpdateTimestamp, changedTimestamp)
  }, 0)

export type UpdateAction =
  // this action should be called whenever an application page is refreshed on navigated
  | {
      type: 'resetElementsTracker'
    }
  | {
      type: 'setElementEntered'
      elementCode: string
      textValue: string
    }
  | {
      type: 'setElementUpdated'
      elementCode: string
      textValue: string
      previousValue: string
    }
  | {
      type: 'elementProcessing'
      elementCode: string
    }
  | {
      type: 'elementDoneProcessing'
      elementCode: string
    }

type FormElementUpdateTrackerProps = { children: React.ReactNode }

type Reducer = (
  state: ContextFormElementUpdateTrackerState,
  action: UpdateAction
) => ContextFormElementUpdateTrackerState

const reducer: Reducer = (state, action) => {
  switch (action.type) {
    case 'resetElementsTracker':
      return contextStateDefault
    case 'setElementEntered': {
      const { elementCode } = action
      const previousElementState = state.elementsUpdateState[elementCode] || elementStateDefault

      const newState: ContextFormElementUpdateTrackerState = {
        latestChangedElementUpdateTimestamp: Infinity, // signaling that at least one elements is awaiting update
        elementsUpdateState: {
          ...state.elementsUpdateState,
          [elementCode]: {
            ...previousElementState,
            enteredSequence: previousElementState.enteredSequence + 1,
            enteredTimestamp: Date.now(),
            previousEnteredTextValue: previousElementState.enteredTextValue,
            enteredTextValue: action.textValue,
          },
        },
        elementCurrentlyProcessing: state.elementCurrentlyProcessing,
      }

      return newState
    }
    case 'setElementUpdated': {
      const { elementCode } = action
      const previousElementState = state.elementsUpdateState[elementCode] || elementStateDefault
      const { updatedSequence, enteredSequence } = previousElementState
      // It's possible for element update sequence to get ahead of element entered sequence, want to restrict this
      // btw this could happen when element is updated when it's created or when 'entered' activity is not recorded
      const newUpdateSequence =
        updatedSequence >= enteredSequence ? enteredSequence : updatedSequence + 1

      const previousTextValue =
        newUpdateSequence === enteredSequence
          ? previousElementState.enteredTextValue
          : previousElementState.previousEnteredTextValue

      const wasElementChanged =
        typeof previousTextValue === 'undefined'
          ? action.textValue !== action.previousValue
          : action.textValue !== previousTextValue

      const changedTimestamp = wasElementChanged
        ? Date.now()
        : previousElementState.changedTimestamp

      const newElementState: SingleFormElementUpdateState = {
        ...previousElementState,
        updatedSequence: newUpdateSequence,
        enteredTextValue: action.textValue,
        changedTimestamp,
      }

      const newElementsUpdateState = {
        ...state.elementsUpdateState,
        [elementCode]: newElementState,
      }

      const latestChangedElementUpdateTimestamp =
        calculateLatestChangedTimestamp(newElementsUpdateState)

      const newState: ContextFormElementUpdateTrackerState = {
        latestChangedElementUpdateTimestamp,
        elementsUpdateState: newElementsUpdateState,
        elementCurrentlyProcessing: state.elementCurrentlyProcessing,
      }

      return newState
    }
    case 'elementProcessing': {
      const { elementCode } = action
      const elementCurrentlyProcessing = new Set(state.elementCurrentlyProcessing)
      elementCurrentlyProcessing.add(elementCode)
      const newState = { ...state, elementCurrentlyProcessing }
      return newState
    }
    case 'elementDoneProcessing': {
      const { elementCode } = action
      const elementCurrentlyProcessing = new Set(state.elementCurrentlyProcessing)
      elementCurrentlyProcessing.delete(elementCode)
      const newState = { ...state, elementCurrentlyProcessing }
      return newState
    }
    default:
      return state
  }
}

const initialState: ContextFormElementUpdateTrackerState = contextStateDefault

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
