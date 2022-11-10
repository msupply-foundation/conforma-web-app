import { gql } from '@apollo/client'

export default gql`
  fragment ReviewAssignment on ReviewAssignment {
    id
    status
    timeUpdated
    levelNumber
    reviewerId
    isLastLevel
    isFinalDecision
    isSelfAssignable
    allowedSections
    assignedSections
  }
`
