import {
  useUpdateReviewMutation,
  ReviewPatch,
  Trigger,
  Decision,
  ReviewStatus,
  Reviewability,
} from '../generated/graphql'
import { AssignmentDetails, FullStructure, PageElement } from '../types'
import { useGetFullReviewStructureAsync } from './useGetReviewStructureForSection'

// below lines are used to get return type of the function that is returned by useRestartReviewMutation
type UseUpdateReviewMutationReturnType = ReturnType<typeof useUpdateReviewMutation>
type PromiseReturnType = ReturnType<UseUpdateReviewMutationReturnType[0]>
// hook used to restart a review, , as per type definition below (returns promise that resolve with mutation result data)
type UseRestartReview = (props: {
  reviewStructure: FullStructure
  reviewAssignment: AssignmentDetails
}) => () => PromiseReturnType

type ConstructReviewPatch = (reviewStructure: FullStructure) => ReviewPatch

// Need to duplicate or create new review responses for all assigned questions
const useRestartReview: UseRestartReview = ({ reviewStructure, reviewAssignment }) => {
  const [updateReview] = useUpdateReviewMutation()
  const reviewId = reviewStructure.thisReview?.id as number

  const getFullReviewStructureAsync = useGetFullReviewStructureAsync({
    reviewStructure,
    reviewAssignment,
  })

  const shouldCreateConsolidationReviewResponse = (element: PageElement) => {
    if (reviewAssignment.level === 1) return true
    return element?.lowerLevelReviewLatestResponse?.review?.status !== ReviewStatus.Draft
  }

  const constructReviewPatch: ConstructReviewPatch = (reviewStructure) => {
    const elements = Object.values(reviewStructure?.elementsById || {})

    // Exclude not assigned, not visible and missing responses
    const reviewableElements = elements.filter((element) => {
      const {
        isAssigned,
        isActiveReviewResponse,
        response,
        element: { reviewability },
      } = element
      return (
        shouldCreateConsolidationReviewResponse(element) &&
        !!response &&
        isAssigned &&
        !isActiveReviewResponse &&
        reviewability !== Reviewability.Never
      )
    })

    // For re-assignment this would be slightly different, we need to consider latest review response of this level
    // not necessarily this thisReviewLatestResponse (would be just latestReviewResponse, from all reviews at this level)
    const reviewResponseCreate = reviewableElements.map(
      ({ isPendingReview, thisReviewLatestResponse, response, lowerLevelReviewLatestResponse }) => {
        const applicationResponseId = reviewAssignment.level > 1 ? undefined : response?.id
        const reviewResponseLinkId =
          reviewAssignment.level === 1 ? undefined : lowerLevelReviewLatestResponse?.id
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
      trigger: Trigger.OnReviewRestart,
      reviewResponsesUsingId: {
        create: reviewResponseCreate,
      },
      // create new empty decision (do we need to duplicate comment from latest decision ?)
      reviewDecisionsUsingId: {
        create: [{ decision: Decision.NoDecision }],
      },
    }
  }

  return async () => {
    const result = await updateReview({
      variables: {
        reviewId,
        // See comment at the bottom of file for resulting shape
        reviewPatch: constructReviewPatch(await getFullReviewStructureAsync()),
      },
    })
    if (result.errors) throw new Error(result.errors.toString())
    return result
  }
}

export default useRestartReview

/* shape of reviewPatch
{
  "trigger": "ON_REVIEW_RESTART",
  "reviewResponsesUsingId": {
    "create": [
      {
        "decision": null,
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
