import { useUserState } from '../../contexts/UserState'
import {
  useReassignReviewAssignmentMutation,
  ReviewAssignmentStatus,
  ReviewAssignmentPatch,
  TemplateElementCategory,
  Trigger,
} from '../generated/graphql'
import { AssignmentDetails, FullStructure } from '../types'

// below lines are used to get return type of the function that is returned by useUpdateReviewReassignmentMutation
type UseReassignReviewAssignmentMutationReturnType = ReturnType<
  typeof useReassignReviewAssignmentMutation
>
type PromiseReturnType = ReturnType<UseReassignReviewAssignmentMutationReturnType[0]>
// hook used to reassign section/s to user (and unassign previous section)
// as per type definition below (returns promise that resolve with mutation result data)
type UseReassignReviewAssignment = (structure: FullStructure) => {
  reassignSections: (props: {
    // Section code if empty all sections are assigned
    sectionCodes: string[]
    unassignmentId?: number
    reassignment: AssignmentDetails
  }) => PromiseReturnType
}

type ConstructAssignSectionPatch = (
  reviewLevel: number,
  isFinalDecision: boolean,
  sectionCodes: string[]
) => ReviewAssignmentPatch

const useReasignReviewAssignment: UseReassignReviewAssignment = (structure) => {
  const {
    userState: { currentUser },
  } = useUserState()
  const [reassignReview] = useReassignReviewAssignmentMutation()

  const constructUnassignSectionPatch: ConstructAssignSectionPatch = (
    reviewLevel,
    isFinalDecision,
    sectionCodes
  ) => {
    const elements = Object.values(structure?.elementsById || {})

    // Will get assignment questions filtering elements by:
    // - level 1 (or finalDecision) -> if existing response linked
    // - level 1+ -> if existing review linked
    // - question category
    // - section codes (if none - then will consider all sections)
    //
    // TODO: Would be nice to replace this to use something similar
    // to what is in addIsPendingReview (useGetReviewStructureForSection/helpers)
    const assignableElements = elements.filter(
      ({ element, response, lowerLevelReviewLatestResponse }) =>
        (reviewLevel === 1 || isFinalDecision ? !!response : !!lowerLevelReviewLatestResponse) &&
        (sectionCodes.length === 0 || sectionCodes.includes(element.sectionCode)) &&
        element.category === TemplateElementCategory.Question
    )

    const createReviewQuestionAssignments = assignableElements.map((element) => ({
      templateElementId: element.element.id,
    }))

    return {
      status: ReviewAssignmentStatus.Assigned,
      isLocked: false,
      assignerId: currentUser?.userId || null,
      trigger: Trigger.OnReviewReassign,
      // OnReviewReassign to trigger action on new ReviewAssignment assigned change status of Review - if existing - back to DRAFT
      // onReviewUnassign also set in mutation to trigger core action on previous ReviewAssignment unassigned changeStatus of review to LOCKED
      timeUpdated: new Date().toISOString(),
      reviewQuestionAssignmentsUsingId: {
        create: createReviewQuestionAssignments,
      },
    }
  }

  return {
    reassignSections: async ({ sectionCodes, unassignmentId = 0, reassignment }) => {
      const { id, isFinalDecision, level } = reassignment
      const result = await reassignReview({
        variables: {
          unassignmentId,
          reassignmentId: id,
          reassignmentPatch: constructUnassignSectionPatch(level, isFinalDecision, sectionCodes),
        },
      })

      if (result.errors) throw new Error(result.errors.toString())
      return result
    },
  }
}

export default useReasignReviewAssignment
