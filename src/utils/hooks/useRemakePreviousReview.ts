import {
  useCreateReviewMutation,
  ReviewPatch,
  Trigger,
  Decision,
  ReviewResponseDecision,
} from '../generated/graphql'
import { AssignmentDetails, FullStructure, PageElement } from '../types'
import { useGetFullReviewStructureAsync } from './useGetReviewStructureForSection'

// below lines are used to get return type of the function that is returned by useRestartReviewMutation
type UseRemakePreviousReviewMutationReturnType = ReturnType<typeof useCreateReviewMutation>
type PromiseReturnType = ReturnType<UseRemakePreviousReviewMutationReturnType[0]>
// hook used to restart a review, , as per type definition below (returns promise that resolve with mutation result data)
type UseRemakePreviousReview = (props: {
  reviewStructure: FullStructure
  reviewAssignment: AssignmentDetails
  previousAssignment?: AssignmentDetails
}) => () => PromiseReturnType

type ConstructReviewPatch = (structure: FullStructure) => ReviewPatch

// Need to duplicate or create new review responses for all assigned questions
const useRemakePreviousReview: UseRemakePreviousReview = ({
  reviewStructure,
  reviewAssignment,
  previousAssignment,
}) => {
  const [createReview] = useCreateReviewMutation()

  const getFullReviewStructureAsync = useGetFullReviewStructureAsync({
    reviewStructure,
    reviewAssignment,
    previousAssignment,
  })

  const shouldRemakeFinalDecisionReviewResponse = (element: PageElement) => {
    if (previousAssignment?.level === 1) return true
    return element?.thisReviewLatestResponse?.decision === ReviewResponseDecision.Agree
  }

  const constructReviewPatch: ConstructReviewPatch = (structure) => {
    const elements = Object.values(structure?.elementsById || {})

    // Exclude not assigned, not visible and missing responses
    const reviewableElements = elements.filter((element) => {
      const { isAssigned, isActiveReviewResponse } = element
      return (
        shouldRemakeFinalDecisionReviewResponse(element) && isAssigned && !isActiveReviewResponse
      )
    })

    // For re-assignment this would be slightly different, we need to consider latest review response of this level
    // not necessarily this thisReviewLatestResponse (would be just latestReviewResponse, from all reviews at this level)
    const reviewResponseCreate = reviewableElements.map(
      ({ isPendingReview, thisReviewLatestResponse, response, lowerLevelReviewLatestResponse }) => {
        const applicationResponseId =
          !previousAssignment || previousAssignment.level > 1 ? undefined : response?.id
        const reviewResponseLinkId =
          !previousAssignment || previousAssignment.level === 1
            ? undefined
            : lowerLevelReviewLatestResponse?.id
        // create new if element is awaiting review
        const shouldCreateNew = isPendingReview
        return {
          // Create new decision and comment if lower level review response or application was change, otherwise duplicate previous review response
          decision: shouldCreateNew ? null : thisReviewLatestResponse?.decision,
          comment: shouldCreateNew ? null : thisReviewLatestResponse?.comment,
          applicationResponseId,
          reviewResponseLinkId,
        }
      }
    )

    // See comment at the bottom of file for resulting shape
    return {
      trigger: Trigger.OnReviewCreate,
      reviewResponsesUsingId: {
        create: reviewResponseCreate,
      },
      reviewAssignmentId: reviewAssignment.id,
      // create new empty decision (do we need to duplicate comment from latest decision ?)
      reviewDecisionsUsingId: {
        create: [{ decision: Decision.NoDecision }],
      },
    }
  }

  return async () => {
    const result = await createReview({
      variables: {
        // See comment at the bottom of file for resulting shape
        reviewInput: constructReviewPatch(await getFullReviewStructureAsync()),
      },
    })
    if (result.errors) throw new Error(result.errors.toString())
    return result
  }
}

export default useRemakePreviousReview

/* shape of reviewPatch
{
  "trigger": "ON_REVIEW_CREATE",
  "reviewResponsesUsingId": {
    "create": [
      {
        "decision": AGREE,
        "comment": null,
        "applicationResponseId": 34, // this or reviewResponseLinkId
        "reviewResponseLinkId": 34,  // this or applicationResponseId
      }
    ]
  },
  "reviewDecisionsUsingId": {
    "create": [
      {
        "decision": "NO_DECISION"
      }
    ]
  }
}

*/
