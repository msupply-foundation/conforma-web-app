import { useCreateReviewMutation, ReviewPatch, Trigger, Decision } from '../generated/graphql'
import { AssignmentDetails, FullStructure } from '../types'
import { useGetFullReviewStructureAsync } from './useGetReviewStructureForSection'

// below lines are used to get return type of the function that is returned by useRestartReviewMutation
type UseRemakePreviousReviewMutationReturnType = ReturnType<typeof useCreateReviewMutation>
type PromiseReturnType = ReturnType<UseRemakePreviousReviewMutationReturnType[0]>
// hook used to restart a review, , as per type definition below (returns promise that resolve with mutation result data)
type UseCreateFinalDecisionReview = (props: {
  reviewStructure: FullStructure
  reviewAssignment: AssignmentDetails
  previousAssignment?: AssignmentDetails
}) => () => PromiseReturnType

type ConstructReviewPatch = (structure: FullStructure) => ReviewPatch

// Need to duplicate or create new review responses for all assigned questions
const useCreateFinalDecisionReview: UseCreateFinalDecisionReview = ({
  reviewStructure,
  reviewAssignment,
  previousAssignment,
}) => {
  const [createReview] = useCreateReviewMutation()

  const getFullReviewStructureAsync = useGetFullReviewStructureAsync({
    reviewStructure,
    reviewAssignment: previousAssignment,
  })

  const constructReviewPatch: ConstructReviewPatch = (structure) => {
    const elements = Object.values(structure?.elementsById || {})

    // Exclude not assigned, not visible and missing responses
    const reviewableElements = elements.filter((element) => {
      const { isAssigned, isActiveReviewResponse } = element
      return isAssigned && !isActiveReviewResponse
    })

    // Generate each reviewResponse for FinalStage review as a copy of previus lastLevel review
    const reviewResponseCreate = reviewableElements.map(
      ({
        response,
        thisReviewLatestResponse,
        latestOriginalReviewResponse,
        lowerLevelReviewLatestResponse,
      }) => {
        const applicationResponseId =
          (previousAssignment?.level || 1) > 1 ? undefined : response?.id
        const reviewResponseLinkId =
          thisReviewLatestResponse?.reviewResponseLinkId ?? lowerLevelReviewLatestResponse?.id
        return {
          // Create new decision and comment if lower level review response or application was change, otherwise duplicate previous review response
          decision: thisReviewLatestResponse?.decision
            ? lowerLevelReviewLatestResponse?.decision ?? null
            : latestOriginalReviewResponse?.decision ?? null,
          comment: thisReviewLatestResponse?.decision
            ? lowerLevelReviewLatestResponse?.comment ?? null
            : latestOriginalReviewResponse?.comment ?? null,
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

export default useCreateFinalDecisionReview

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
