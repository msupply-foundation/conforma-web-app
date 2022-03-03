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
    unassignment?: AssignmentDetails
    reassignment: AssignmentDetails
  }) => PromiseReturnType
}

type ConstructAssignSectionPatch = (
  sectionCodes: string[],
  reassignment: AssignmentDetails,
  unassignment?: AssignmentDetails
) => { reassignmentPatch: ReviewAssignmentPatch; unassignmentPatch: any }

const useReassignReviewAssignment: UseReassignReviewAssignment = (structure) => {
  const {
    userState: { currentUser },
  } = useUserState()
  const [reassignReview] = useReassignReviewAssignmentMutation()

  const constructReassignmentSectionPatches: ConstructAssignSectionPatch = (
    sectionCodes,
    reassignment,
    unassignment
  ) => {
    const unassignedSectionCodes: string[] =
      unassignment?.assignedSections.filter((code) => !sectionCodes.includes(code)) || []

    const assignedSectionCodes: string[] = [...reassignment?.assignedSections, ...sectionCodes]

    const unassignedStatus =
      unassignedSectionCodes?.length > 0
        ? ReviewAssignmentStatus.Assigned
        : ReviewAssignmentStatus.Available

    const unassignmentPatch = unassignment
      ? {
          status: unassignedStatus,
          assignerId: unassignment?.id,
          trigger: Trigger.OnReviewUnassign,
          timeUpdated: new Date().toISOString(),
          assignedSections: unassignedSectionCodes,
        }
      : {}

    if (unassignedStatus === ReviewAssignmentStatus.Available)
      delete unassignmentPatch.assignedSections

    return {
      reassignmentPatch: {
        status: ReviewAssignmentStatus.Assigned,
        isLocked: false,
        assignerId: currentUser?.userId || null,
        trigger: Trigger.OnReviewReassign,
        // OnReviewReassign to trigger action on new ReviewAssignment assigned change status of Review - if existing - back to DRAFT
        // onReviewUnassign also set in mutation to trigger core action on previous ReviewAssignment unassigned changeStatus of review to LOCKED
        timeUpdated: new Date().toISOString(),
        assignedSections: assignedSectionCodes,
      },
      unassignmentPatch,
    }
  }

  return {
    reassignSections: async ({ sectionCodes, unassignment, reassignment }) => {
      const { id } = reassignment
      const { reassignmentPatch, unassignmentPatch } = constructReassignmentSectionPatches(
        sectionCodes,
        reassignment,
        unassignment
      )

      const result = await reassignReview({
        variables: {
          unassignmentId: unassignment?.id || 0,
          reassignmentId: id,
          reassignmentPatch,
          unassignmentPatch,
        },
      })

      if (result.errors) throw new Error(result.errors.toString())
      return result
    },
  }
}

export default useReassignReviewAssignment
