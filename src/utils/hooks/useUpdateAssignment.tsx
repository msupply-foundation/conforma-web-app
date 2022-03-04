import { AssignmentDetails, FullStructure, SectionAssignee } from '../../utils/types'
import {
  ReviewAssignmentStatus,
  useUpdateReviewAssignmentMutation,
} from '../../utils/generated/graphql'

const useUpdateAssignment = ({ fullStructure }: { fullStructure: FullStructure }) => {
  const [updateReviewAssignment] = useUpdateReviewAssignmentMutation()

  const submitAssignments = async (
    assignedSections: SectionAssignee,
    assignmentsFiltered: AssignmentDetails[]
  ) => {
    const results: Promise<any>[] = []
    // Deduce which review assignments will change and create patches, then
    // mutate one by one
    assignmentsFiltered.forEach((assignment) => {
      if (isChanging(assignment.reviewer.id, assignedSections)) {
        const assignmentPatch = createAssignmentPatch(assignment, assignedSections)
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
    // Check for Errors?
    fullStructure.reload()
  }

  return { submitAssignments }
}

const isChanging = (reviewerId: number, assignedSections: SectionAssignee) => {
  return !!Object.values(assignedSections).find(
    (section) => section.newAssignee === reviewerId || section.previousAssignee === reviewerId
  )
}
interface AssignmentPatch {
  status: ReviewAssignmentStatus
  assignedSections?: string[]
}

const createAssignmentPatch = (
  assignment: AssignmentDetails,
  assignedSections: SectionAssignee
) => {
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
  }
  if (assignedSectionsCodes.size > 0) patch.assignedSections = Array.from(assignedSectionsCodes)
  return patch
}

export default useUpdateAssignment
