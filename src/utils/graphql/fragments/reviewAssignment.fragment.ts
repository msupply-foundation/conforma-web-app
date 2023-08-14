import { gql } from '@apollo/client'

export default gql`
  fragment ReviewAssignment on ReviewAssignment {
    id
    status
    timeUpdated
    levelNumber
    reviewerId
    isLastLevel
    # TODO: Rename property in Backend to isMakeDecision
    isFinalDecision
    isSelfAssignable
    allowedSections
    assignedSections
    availableSections
  }
`
