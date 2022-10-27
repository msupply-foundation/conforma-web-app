import React, { createContext, useContext, useReducer } from 'react'
import { AssignmentDetails, FullStructure } from '../utils/types'

type ReviewStructuresState = {
  [assignmentId: number]: {
    loading: boolean
    review?: FullStructure
  }
}

export type ReviewStructuresActions = {
  type: 'addAssignmentDetails'
  reviewStructure: FullStructure
  assignment: AssignmentDetails
}

type InitialState = (assignments: AssignmentDetails[]) => ReviewStructuresState

const initialState: InitialState = (assignments) =>
  assignments.reduce(
    (reviewStructureState, { id }) => ({ ...reviewStructureState, [id]: { loading: true } }),
    {}
  )

const reducer = (state: ReviewStructuresState, action: ReviewStructuresActions) => {
  switch (action.type) {
    case 'addAssignmentDetails':
      const { reviewStructure, assignment } = action
      return {
        ...state,
        [assignment.id]: { loading: false, review: reviewStructure },
      }
    default:
      return state
  }
}

const initialReviewStateContext: {
  reviewStructuresState: ReviewStructuresState
  setReviewStructureState: React.Dispatch<ReviewStructuresActions>
} = {
  reviewStructuresState: {},
  setReviewStructureState: () => {},
}

const ReviewsStateContext = createContext(initialReviewStateContext)

interface ReviewStructureProviderProps {
  children: React.ReactNode
  assignments: AssignmentDetails[]
}

export function ReviewStateProvider({ children, assignments }: ReviewStructureProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState(assignments))
  const reviewStructuresState = state
  const setReviewStructureState = dispatch

  // Return the state and reducer to the context (wrap around the children)
  return (
    <ReviewsStateContext.Provider value={{ reviewStructuresState, setReviewStructureState }}>
      {children}
    </ReviewsStateContext.Provider>
  )
}

/**
 * To use and set the state of the user from anywhere in the app
 * - @returns an object with a reducer function `setReviewStructureState` and the `reviewStructureState`
 */
export const useReviewStructureState = () => useContext(ReviewsStateContext)
