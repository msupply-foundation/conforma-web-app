import React, { createContext, useContext, useReducer } from 'react'
import { AssignmentDetails, FullStructure, ReviewStructureState } from '../utils/types'

type ReviewStructuresState = {
  [assignmentId: number]: ReviewStructureState
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

type InitialState = (props: {
  fullApplicationStructure: FullStructure
  assignments: AssignmentDetails[]
}) => ReviewStructuresState

const initialState: InitialState = ({ fullApplicationStructure, assignments }) => {
  return assignments.reduce((reviewStructures: ReviewStructuresState, assignment) => {
    return {
      ...reviewStructures,
      [assignment.id]: { reviewStructure: fullApplicationStructure, assignment },
    }
  }, {})
}

const reducer = (state: ReviewStructuresState, action: ReviewStructuresActions) => {
  switch (action.type) {
    case 'resetReviewStructures':
      const { fullApplicationStructure, assignments } = action
      return initialState({ fullApplicationStructure, assignments })
    case 'addReviewStructure':
      const { reviewStructure, assignment } = action
      // console.log('adding reviewStrcuture in REVIEW_STATE', state, 'new state', {
      //   ...state,
      //   [assignment.id]: { reviewStructure, assignment },
      // })

      return {
        ...state,
        [assignment.id]: { reviewStructure, assignment },
      }
    default:
      return state
  }
}

const initialReviewStateContext: {
  reviewStructuresState: ReviewStructuresState
  setReviewStructures: React.Dispatch<ReviewStructuresActions>
} = {
  reviewStructuresState: {},
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
