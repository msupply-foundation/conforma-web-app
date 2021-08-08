import { ReviewAssignmentStatus } from '../../generated/graphql'
import { AssignmentDetails } from '../../types'

export const getPreviousStageAssignment = (
  serial: string,
  assignments: AssignmentDetails[],
  currentStageNumber?: number
) => {
  const previousStage = (currentStageNumber || 1) - 1
  const lastLevelPreviousStage = assignments
    .filter((assignment) => assignment.current.stage.number === previousStage)
    .filter(
      ({ isLastLevel, current: { assignmentStatus } }) =>
        assignmentStatus === ReviewAssignmentStatus.Assigned && isLastLevel
    )

  // Should always only have 1 lastLevel reviewer assigned - others are locked once the first
  if (lastLevelPreviousStage.length > 1)
    console.log(
      `Problem found: stage number ${previousStage}
      Application ${serial} has more than one lastLevel
      Only first reviewAssignment is returned`
    )

  return lastLevelPreviousStage[0]
}
