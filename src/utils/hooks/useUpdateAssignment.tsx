import { AssignmentDetails, FullStructure, SectionAssignee } from '../../utils/types'
import {
  ReviewAssignmentStatus,
  UpdateReviewAssignmentMutation,
  useUpdateReviewAssignmentMutation,
} from '../../utils/generated/graphql'
import { FetchResult } from '@apollo/client'
import { useUserState } from '../../contexts/UserState'

const useUpdateAssignment = ({ fullStructure }: { fullStructure: FullStructure }) => {
  const [updateReviewAssignment] = useUpdateReviewAssignmentMutation()
  const {
    userState: { currentUser },
  } = useUserState()

  const submitAssignments = async (
    assignedSections: SectionAssignee | null,
    assignmentsFiltered: AssignmentDetails[]
  ) => {
    // NOTE: If "assignedSections ==  null", then ALL sections will be
    // UNASSIGNED from the review assignments in assignmentsFiltered
    const results: Promise<
      FetchResult<UpdateReviewAssignmentMutation, Record<string, any>, Record<string, any>>
    >[] = []
    // Deduce which review assignments need to change and create patches, then
    // mutate one by one
    try {
      assignmentsFiltered.forEach((assignment) => {
        if (isChanging(assignment.reviewer.id, assignedSections)) {
          const assignmentPatch = createAssignmentPatch(
            assignment,
            assignedSections,
            currentUser?.userId as number
          )
          results.push(
            updateReviewAssignment({
              variables: {
                assignmentId: assignment.id,
                assignmentPatch,
              },
            })
          )
        }
      })
      await Promise.all(results)
    } catch (err) {
      throw new Error('Assignment update error')
    }
    fullStructure.reload()
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
interface AssignmentPatch {
  status: ReviewAssignmentStatus
  assignedSections?: string[]
  assignerId: number
}

const createAssignmentPatch = (
  assignment: AssignmentDetails,
  assignedSections: SectionAssignee | null,
  assignerId: number
): AssignmentPatch => {
  if (!assignedSections) return { status: ReviewAssignmentStatus.Available, assignerId }
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

  const patch: AssignmentPatch = {
    status:
      assignedSectionsCodes.size === 0
        ? ReviewAssignmentStatus.Available
        : ReviewAssignmentStatus.Assigned,
    assignerId,
  }
  if (assignedSectionsCodes.size > 0) patch.assignedSections = Array.from(assignedSectionsCodes)
  return patch
}

export default useUpdateAssignment
