import { useUserState } from '../../contexts/UserState'
import {
  useUpdateReviewAssignmentMutation,
  ReviewAssignmentStatus,
  ReviewAssignmentPatch,
  TemplateElementCategory,
  Trigger,
} from '../generated/graphql'
import { AssignmentDetails, FullStructure } from '../types'

// below lines are used to get return type of the function that is returned by useUpdateReviewAssignmentMutation
type UseUpdateReviewAssignmentMutationReturnType = ReturnType<
  typeof useUpdateReviewAssignmentMutation
>
type PromiseReturnType = ReturnType<UseUpdateReviewAssignmentMutationReturnType[0]>
// hook used to assign section/s to user as per type definition below (returns promise that resolve with mutation result data)
type UseUpdateReviewAssignment = (structure: FullStructure) => {
  assignSectionsToUser: (props: {
    // Section code is optional if omitted all sections are assigned
    sectionCodes: string[]
    assignment: AssignmentDetails
  }) => PromiseReturnType
}

type ConstructAssignSectionPatch = (
  reviewLevel: number,
  isFinalDecision: boolean,
  isSelfAssignment: boolean,
  sectionCodes: string[]
) => ReviewAssignmentPatch

const useUpdateReviewAssignment: UseUpdateReviewAssignment = (structure) => {
  const {
    userState: { currentUser },
  } = useUserState()
  const [updateAssignment] = useUpdateReviewAssignmentMutation({
    onCompleted: () => {
      structure.reload()
    },
  })

  const constructAssignSectionPatch: ConstructAssignSectionPatch = (
    reviewLevel,
    isFinalDecision,
    isSelfAssignable,
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
      assignerId: currentUser?.userId || null,
      trigger: isSelfAssignable ? Trigger.OnReviewSelfAssign : Trigger.OnReviewAssign,
      timeUpdated: new Date().toISOString(),
      reviewQuestionAssignmentsUsingId: {
        create: createReviewQuestionAssignments,
      },
    }
  }

  return {
    assignSectionsToUser: async ({ sectionCodes, assignment }) => {
      const { id, isFinalDecision, isSelfAssignable, level } = assignment
      const result = await updateAssignment({
        variables: {
          assignmentId: id,
          assignmentPatch: constructAssignSectionPatch(
            level,
            isFinalDecision,
            isSelfAssignable,
            sectionCodes
          ),
        },
      })

      if (result.errors) throw new Error(result.errors.toString())
      return result
    },
  }
}

export default useUpdateReviewAssignment
