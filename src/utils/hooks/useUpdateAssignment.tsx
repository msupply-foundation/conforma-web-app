import { AssignmentDetails, FullStructure, SectionAssignee } from '../../utils/types'
import {
  ReviewAssignmentPatch,
  ReviewAssignmentStatus,
  Trigger,
  useUpdateReviewAssignmentMutation,
} from '../../utils/generated/graphql'
import { useUserState } from '../../contexts/UserState'

const useUpdateAssignment = ({ fullStructure }: { fullStructure: FullStructure }) => {
  const [updateReviewAssignment] = useUpdateReviewAssignmentMutation()
  const {
    userState: { currentUser },
  } = useUserState()

  const submitAssignments = async (
    level: number,
    assignedSections: SectionAssignee | null,
    assignmentsFiltered: AssignmentDetails[]
  ) => {
    // NOTE: If "assignedSections ==  null", then ALL sections will be
    // UNASSIGNED from the review assignments in assignmentsFiltered

    // Deduce which review assignments need to change and create patches, then
    // mutate one by one
    try {
      const filteredAssignments = assignmentsFiltered.filter(
        ({ level: assignmentLevel }) => assignmentLevel === level
      )

      const assignmentsToPatch: {
        assignment: AssignmentDetails
        assignmentPatch: ReviewAssignmentPatch
      }[] = []

      filteredAssignments.forEach((assignment) => {
        if (isChanging(assignment.reviewer.id, assignedSections)) {
          const assignmentPatch = createAssignmentPatch(
            assignment,
            assignedSections,
            currentUser?.userId as number
          )
          assignmentsToPatch.push({ assignment, assignmentPatch })
        }
      })

      // Need to sort so that we're sure UNASSIGNMENTS happen before
      // ASSIGNMENTS, otherwise back-end won't allow it
      assignmentsToPatch.sort((a, b) =>
        (a.assignmentPatch.status ?? '') > (b.assignmentPatch.status ?? '') ? -1 : 1
      )
      for (const { assignment, assignmentPatch } of assignmentsToPatch) {
        await updateReviewAssignment({
          variables: {
            assignmentId: assignment.id,
            assignmentPatch,
          },
        })
      }
      fullStructure.reload()
    } catch (err) {
      throw new Error('Assignment update error')
    }
  }

  return { submitAssignments }
}

const isChanging = (reviewerId: number, assignedSections: SectionAssignee | null) => {
  if (!assignedSections) return true
  else
    return !!Object.values(assignedSections).find(
      (section) => section.newAssignee === reviewerId || section.previousAssignee === reviewerId
    )
}

const createAssignmentPatch = (
  assignment: AssignmentDetails,
  assignedSections: SectionAssignee | null,
  assignerId: number
): ReviewAssignmentPatch => {
  // When no assignedSections it should be Unassignment
  if (!assignedSections)
    return {
      status: ReviewAssignmentStatus.Available,
      assignerId,
      trigger: Trigger.OnReviewUnassign,
    }

  const reviewerId = assignment.reviewer.id
  const assignedSectionsCodes = new Set(assignment.assignedSections)
  const removedSections = Object.entries(assignedSections)
    .filter(([_, { previousAssignee }]) => previousAssignee === reviewerId)
    .map((section) => section[0])
  const addedSections = Object.entries(assignedSections)
    .filter(([_, { newAssignee }]) => newAssignee === reviewerId)
    .map((section) => section[0])

  removedSections.forEach((code) => assignedSectionsCodes.delete(code))
  addedSections.forEach((code) => assignedSectionsCodes.add(code))

  const trigger =
    assignedSectionsCodes.size === 0 ? Trigger.OnReviewUnassign : Trigger.OnReviewAssign

  const status =
    assignedSectionsCodes.size === 0
      ? ReviewAssignmentStatus.Available
      : ReviewAssignmentStatus.Assigned

  const patch: ReviewAssignmentPatch = {
    status,
    // Required if previously locked (and now Assigned)
    isLocked: assignment.isSelfAssignable && !ReviewAssignmentStatus.Assigned,
    assignerId,
    trigger,
  }
  if (assignedSectionsCodes.size > 0) patch.assignedSections = Array.from(assignedSectionsCodes)
  return patch
}

export default useUpdateAssignment
