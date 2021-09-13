import { useUserState } from '../../contexts/UserState'
import {
  useUpdateAssigneeInReviewAssignmentMutation,
  ReviewAssignmentStatus,
  ReviewAssignmentPatch,
  TemplateElementCategory,
  Trigger,
} from '../generated/graphql'
import { AssignmentDetails, PageElement } from '../types'

// below lines are used to get return type of the function that is returned by useUpdateReviewReassignmentMutation
type UseUpdateAssigneeInReviewAssignmentMutationReturnType = ReturnType<
  typeof useUpdateAssigneeInReviewAssignmentMutation
>
type PromiseReturnType = ReturnType<UseUpdateAssigneeInReviewAssignmentMutationReturnType[0]>
// hook used to reassign section/s to user (and unassign previous section)
// as per type definition below (returns promise that resolve with mutation result data)
type UseReassignReviewAssignment = () => {
  reassignSection: (props: {
    // Section code is optional if omitted all sections are assigned
    sectionCode?: string
    unassignmentId?: number
    reassignment: AssignmentDetails
    elements: PageElement[]
  }) => PromiseReturnType
}

type ConstructAssignSectionPatch = (
  reviewLevel: number,
  isFinalDecision: boolean,
  elements: PageElement[],
  sectionCode?: string
) => ReviewAssignmentPatch

const useReasignReviewAssignment: UseReassignReviewAssignment = () => {
  const {
    userState: { currentUser },
  } = useUserState()
  const [reassignReview] = useUpdateAssigneeInReviewAssignmentMutation()

  const constructUnassignSectionPatch: ConstructAssignSectionPatch = (
    reviewLevel,
    isFinalDecision,
    elements,
    sectionCode
  ) => {
    // Will get assignment questions filtering elements by:
    // - level 1 (or finalDecision) -> if existing response linked
    // - level 1+ -> if existing review linked
    // - question category
    // - [Optional] section code (if one passed through)
    //
    // TODO: Would be nice to replace this to use something similar
    // to what is in addIsPendingReview (useGetReviewStructureForSection/helpers)
    const assignableElements = elements.filter(
      ({ element, response, lowerLevelReviewLatestResponse }) =>
        (reviewLevel === 1 || isFinalDecision ? !!response : !!lowerLevelReviewLatestResponse) &&
        (!sectionCode || element.sectionCode === sectionCode) &&
        element.category === TemplateElementCategory.Question
    )

    const createReviewQuestionAssignments = assignableElements.map((element) => ({
      templateElementId: element.element.id,
    }))

    return {
      status: ReviewAssignmentStatus.Assigned,
      isLocked: false,
      assignerId: currentUser?.userId || null,
      // onReviewReassign will trigger core action to move remove
      // previous assignment ASSIGNED to another reviewer
      // trigger: Trigger.OnReviewReassign,
      timeUpdated: new Date().toISOString(),
      reviewQuestionAssignmentsUsingId: {
        create: createReviewQuestionAssignments,
      },
    }
  }

  return {
    reassignSection: async ({ sectionCode, unassignmentId = 0, reassignment, elements }) => {
      const { id, isFinalDecision, level } = reassignment
      const result = await reassignReview({
        variables: {
          unassignmentId,
          reassignmentId: id,
          reassignmentPatch: constructUnassignSectionPatch(
            level,
            isFinalDecision,
            elements,
            sectionCode
          ),
        },
      })

      if (result.errors) throw new Error(result.errors.toString())
      return result
    },
  }
}

export default useReasignReviewAssignment
