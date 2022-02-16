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
    reviewStructure: FullStructure
  }) => PromiseReturnType
}

type ConstructAssignSectionPatch = (
  reviewLevel: number,
  isFinalDecision: boolean,
  isSelfAssignment: boolean,
  sectionCodes: string[],
  assignedSections: string[],
  reviewStructure: FullStructure
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
    sectionCodes,
    assignedSections,
    reviewStructure
  ) => {
    const elements = Object.values(reviewStructure?.elementsById || {}).filter(
      ({ element }) => element.category === TemplateElementCategory.Question
    )

    if (sectionCodes.length === 0) {
      // Will set all sections in assignedSections
      assignedSections = elements.reduce(
        (assignedSections: string[], { element: { sectionCode } }) => {
          if (!assignedSections.includes(sectionCode)) assignedSections.push(sectionCode)
          return assignedSections.sort()
        },
        []
      )
    } else {
      // Will combine new sections with previous
      assignedSections = sectionCodes.reduce(
        (assignedSections: string[], code) =>
          assignedSections.includes(code) ? assignedSections : [...assignedSections, code],
        assignedSections
      )
    }

    // Also set array of questions assigned filtering elements by assignedSections:
    // - level 1 (or finalDecision) -> if existing response linked
    // - level 1+ -> if existing review linked
    // - question category
    // - section codes (if none - then will consider all sections)
    const assignableElements = elements.filter(
      ({ element, response, lowerLevelReviewLatestResponse }) =>
        (reviewLevel === 1 || isFinalDecision ? !!response : !!lowerLevelReviewLatestResponse) &&
        (sectionCodes.length === 0 || assignedSections.includes(element.sectionCode))
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
      assignedSections,
    }
  }

  return {
    assignSectionsToUser: async ({ sectionCodes, assignment, reviewStructure }) => {
      const { id, isFinalDecision, isSelfAssignable, level, assignedSections } = assignment
      const result = await updateAssignment({
        variables: {
          assignmentId: id,
          assignmentPatch: constructAssignSectionPatch(
            level,
            isFinalDecision,
            isSelfAssignable,
            sectionCodes,
            assignedSections,
            reviewStructure
          ),
        },
      })

      if (result.errors) throw new Error(result.errors.toString())
      return result
    },
  }
}

export default useUpdateReviewAssignment
