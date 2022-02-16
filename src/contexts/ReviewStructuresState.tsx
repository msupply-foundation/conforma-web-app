import React, { createContext, useContext, useReducer } from 'react'
import { AssignmentDetails, FullStructure } from '../utils/types'

type ReviewStructuresState = {
  structures: { [assignmentId: number]: FullStructure }
  syncToken: boolean
}

export type ReviewStructuresActions =
  | {
      type: 'addReviewStructure'
      reviewStructure: FullStructure
      assignment: AssignmentDetails
    }
  | {
      type: 'resetReviewStructures'
      fullApplicationStructure: FullStructure
      assignments: AssignmentDetails[]
    }
  | {
      type: 'getSyncToken'
    }
  | {
      type: 'releaseSyncToken'
    }

type InitialState = (props: {
  fullApplicationStructure: FullStructure
  assignments: AssignmentDetails[]
}) => ReviewStructuresState

const initialState: InitialState = ({ fullApplicationStructure, assignments }) => {
  return assignments.reduce(
    (reviewStructures: ReviewStructuresState, assignment) => {
      return {
        ...reviewStructures,
        structures: { ...reviewStructures.structures, [assignment.id]: fullApplicationStructure },
      }
    },
    { syncToken: false, structures: {} }
  )
}

const reducer = (state: ReviewStructuresState, action: ReviewStructuresActions) => {
  switch (action.type) {
    case 'resetReviewStructures':
      const { fullApplicationStructure, assignments } = action
      return initialState({ fullApplicationStructure, assignments })
    case 'addReviewStructure':
      const { reviewStructure, assignment } = action
      return {
        ...state,
        structures: { ...state.structures, [assignment.id]: reviewStructure },
      }
    case 'getSyncToken':
      return {
        ...state,
        syncToken: true,
      }
    case 'releaseSyncToken':
      return {
        ...state,
        syncToken: false,
      }
    default:
      return state
  }
}

const initialReviewStateContext: {
  reviewStructuresState: ReviewStructuresState
  setReviewStructures: React.Dispatch<ReviewStructuresActions>
} = {
  reviewStructuresState: { structures: {}, syncToken: false },
  setReviewStructures: () => {},
}

const ReviewsStateContext = createContext(initialReviewStateContext)

interface ReviewStructureProviderProps {
  children: React.ReactNode
  fullApplicationStructure: FullStructure
  assignments: AssignmentDetails[]
}

export function ReviewStateProvider({ children, ...props }: ReviewStructureProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState(props))
  const reviewStructuresState = state
  const setReviewStructures = dispatch

  // Return the state and reducer to the context (wrap around the children)
  return (
    <ReviewsStateContext.Provider value={{ reviewStructuresState, setReviewStructures }}>
      {children}
    </ReviewsStateContext.Provider>
  )
}

/**
 * To use and set the state of the user from anywhere in the app
 * - @returns an object with a reducer function `setReviewStructureState` and the `reviewStructureState`
 */
export const useReviewStructureState = () => useContext(ReviewsStateContext)
