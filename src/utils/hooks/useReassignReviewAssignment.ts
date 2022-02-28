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
  reviewLevel: number,
  isFinalDecision: boolean,
  sectionCodes: string[],
  unassignment?: AssignmentDetails
) => { reassignmentPatch: ReviewAssignmentPatch; unassignmentPatch: any }

const useReassignReviewAssignment: UseReassignReviewAssignment = (structure) => {
  const {
    userState: { currentUser },
  } = useUserState()
  const [reassignReview] = useReassignReviewAssignmentMutation()

  const constructUnassignSectionPatch: ConstructAssignSectionPatch = (
    reviewLevel,
    isFinalDecision,
    sectionCodes,
    unassignment
  ) => {
    // Will get assignment questions filtering elements by:
    // - level 1 (or finalDecision) -> if existing response linked
    // - level 1+ -> if existing review linked
    // - question category
    // - section codes (if none - then will consider all sections)
    //
    // TODO: Would be nice to replace this to use something similar
    // to what is in addIsPendingReview (useGetReviewStructureForSection/helpers)

    console.log('sectionCodes', sectionCodes)
    console.log('unassignment', unassignment)

    const unassignedSectionCodes: string[] =
      unassignment?.assignedSections.filter((code) => !sectionCodes.includes(code)) || []

    console.log('unassignedSectionCodes', unassignedSectionCodes)

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
        assignedSections: sectionCodes,
      },
      unassignmentPatch,
    }
  }

  return {
    reassignSections: async ({ sectionCodes, unassignment, reassignment }) => {
      const { id, isFinalDecision, level } = reassignment
      const { reassignmentPatch, unassignmentPatch } = constructUnassignSectionPatch(
        level,
        isFinalDecision,
        sectionCodes,
        unassignment
      )

      // console.log('reassignmentPatch', reassignmentPatch)
      // console.log('unassignmentPatch', unassignmentPatch)

      const result = {}
      // await reassignReview({
      //   variables: {
      //     unassignmentId: unassignment?.id || 0,
      //     reassignmentId: id,
      //     reassignmentPatch,
      //     unassignmentPatch,
      //   },
      // })

      // if (result.errors) throw new Error(result.errors.toString())
      return result
    },
  }
}

export default useReassignReviewAssignment
