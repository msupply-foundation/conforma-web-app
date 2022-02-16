import { Decision, ReviewInput, Trigger, useCreateReviewMutation } from '../generated/graphql'
import { FullStructure } from '../types'
import { useGetFullReviewStructureAsync } from './useGetReviewStructureForSection'

// below lines are used to get return type of the function that is returned by useCreateReviewMutation
type UseCreateReviewMutationReturnType = ReturnType<typeof useCreateReviewMutation>
type PromiseReturnType = ReturnType<UseCreateReviewMutationReturnType[0]>
// hook used to start a review, , as per type definition below (returns promise that resolve with mutation result data)
type UseCreateReview = (fullReviewStructure: FullStructure) => () => PromiseReturnType

type ConstructReviewInput = (structure: FullStructure) => ReviewInput

const useCreateReview: UseCreateReview = (fullReviewStructure) => {
  const [createReview] = useCreateReviewMutation()
  const reviewAssignmentId = fullReviewStructure.assignment?.assignmentId

  const getFullReviewStructureAsync = useGetFullReviewStructureAsync({
    fullReviewStructure,
  })

  const constructReviewInput: ConstructReviewInput = (structure) => {
    const elements = Object.values(structure?.elementsById || {})
    // Only create review for elements that are pendingReview and are assigned
    const reviewableElements = elements.filter(
      ({ isPendingReview, isAssigned }) => isPendingReview && isAssigned
    )

    const reviewResponseCreate = reviewableElements.map(
      ({ lowerLevelReviewLatestResponse, response, reviewQuestionAssignmentId }) => {
        // link to applicaiton response or review response based on review level
        const applicationResponseId =
          (fullReviewStructure.assignment?.assigneeLevel || 1) > 1 ? undefined : response?.id
        const reviewResponseLinkId =
          (fullReviewStructure.assignment?.assigneeLevel || 1) === 1
            ? undefined
            : lowerLevelReviewLatestResponse?.id
        return {
          applicationResponseId,
          reviewResponseLinkId,
          reviewQuestionAssignmentId,
        }
      }
    )
    // See comment at the bottom of file for resulting shape
    return {
      trigger: Trigger.OnReviewCreate,
      reviewAssignmentId,
      reviewResponsesUsingId: {
        create: reviewResponseCreate,
      },
      // create new empty decision
      reviewDecisionsUsingId: {
        create: [{ decision: Decision.NoDecision }],
      },
    }
  }

  return async () => {
    const result = await createReview({
      variables: {
        // See comment at the bottom of file for resulting shape
        reviewInput: constructReviewInput(await getFullReviewStructureAsync()),
      },
    })
    if (result.errors) throw new Error(result.errors.toString())
    return result
  }
}

export default useCreateReview

/* shape of reviewInput
{
  "trigger": "ON_REVIEW_CREATE",
  "reviewAssignmentId": 4,
  "reviewResponsesUsingId": {
    "create": [
      {
        "applicationResponseId": 11,
        "reviewQuestionAssignmentId": 11
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
