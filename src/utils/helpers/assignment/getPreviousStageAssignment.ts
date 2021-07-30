import { ReviewAssignmentStatus } from '../../generated/graphql'
import { AssignmentDetails } from '../../types'

export const getPreviousStageAssignment = (
  assignments: AssignmentDetails[],
  currentStageNumber?: number
) => {
  const previousStage = (currentStageNumber || 1) - 1
  return assignments
    .filter((assignment) => assignment.current.stage.number === previousStage)
    .filter(
      ({ isLastLevel, current: { assignmentStatus } }) =>
        assignmentStatus === ReviewAssignmentStatus.Assigned && isLastLevel
    )[0] // TODO: Deal with case of more than one lastLevel in stage
}
