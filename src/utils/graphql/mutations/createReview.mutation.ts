import { gql } from '@apollo/client'

export default gql`
 mutation createReview($applicationId: ID!, $reviewAssigmentId: ID!,
  $outcome: ApplicationOutcome = PENDING, $trigger: Trigger = ON_APPLICATION_CREATE,
 )
`