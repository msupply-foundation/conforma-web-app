import { Decision, ReviewInput, Trigger, useCreateReviewMutation } from '../generated/graphql'
import { AssignmentDetails, FullStructure } from '../types'
import { useGetFullReviewStructureAsync } from './useGetReviewStructureForSection'

// below lines are used to get return type of the function that is returned by useCreateReviewMutation
type UseCreateReviewMutationReturnType = ReturnType<typeof useCreateReviewMutation>
type PromiseReturnType = ReturnType<UseCreateReviewMutationReturnType[0]>
// hook used to start a review, , as per type definition below (returns promise that resolve with mutation result data)
type UseCreateReview = (props: {
  structure: FullStructure
  assignment: AssignmentDetails
}) => () => PromiseReturnType

type ConstructReviewInput = (structure: FullStructure) => ReviewInput

const useCreateReview: UseCreateReview = ({ structure, assignment }) => {
  const [updateReview] = useCreateReviewMutation()

  const getFullReviewStructureAsync = useGetFullReviewStructureAsync({
    fullApplicationStructure: structure,
    reviewAssignment: assignment,
  })

  const constructReviewInput: ConstructReviewInput = (structure) => {
    const elements = Object.values(structure?.elementsById || {})
    // Only create review for elements that are pendingReview
    const reviewableElements = elements.filter(({ isPendingReview }) => isPendingReview)

    const reviewResponseCreate = reviewableElements.map(
<<<<<<< HEAD
      ({ lowerLevelReviewLatestResponse, response, reviewQuestionAssignmentId }) => {
        // link to applicaiton response or review response based on review level
        const applicationResponseId = assignment.level > 1 ? undefined : response?.id
        const reviewResponseLinkId =
          assignment.level === 1 ? undefined : lowerLevelReviewLatestResponse?.id
=======
      ({ lowerLevelReviewPreviousResponse, response, reviewQuestionAssignmentId }) => {
        // link to applicaiton response or review response based on review level
        const applicationResponseId = assignment.level > 1 ? undefined : response?.id
        const reviewResponseLinkId =
          assignment.level === 1 ? undefined : lowerLevelReviewPreviousResponse?.id
>>>>>>> origin/295-Create-review_response-on-consolidation-start/continue
        return {
          applicationResponseId,
          reviewResponseLinkId,
          reviewQuestionAssignmentId,
        }
      }
    )

    return {
      trigger: Trigger.OnReviewCreate,
      reviewAssignmentId: assignment.id,
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
    const result = await updateReview({
      variables: {
        reviewInput: constructReviewInput(await getFullReviewStructureAsync()),
      },
    })
    if (result.errors) throw new Error(result.errors.toString())
    return result
  }
}

export default useCreateReview
