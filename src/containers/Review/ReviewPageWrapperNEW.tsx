import React from 'react'
import { Route } from 'react-router'
import { Header } from 'semantic-ui-react'
import { NoMatch } from '../../components'
import { useRouter } from '../../utils/hooks/useRouter'
import { AssignmentDetailsNEW, FullStructure } from '../../utils/types'

const ReviewPageWrapperNEW: React.FC<{
  structure: FullStructure
  reviewAssignments: AssignmentDetailsNEW[]
}> = ({ structure, reviewAssignments }) => {
  const {
    query: { reviewId },
    match: { path },
  } = useRouter()
  const reviewAssignment = reviewAssignments.find(
    (reviewAssignment) => reviewAssignment?.review?.id === Number(reviewId)
  )

  if (!reviewAssignment) return <NoMatch />

  // Pass through structure and reviewAssignments
  return (
    <>
      <Route exact path={`${path}/:reviewId/summary`}>
        <ReviewSummaryNEW />
      </Route>
      <Route exact path={`${path}/:reviewId`}>
        <ReviewPage />
      </Route>
      <Route>
        <NoMatch />
      </Route>
    </>
  )
}

// To be used in case the decision step is in a separated page...
const ReviewSummaryNEW: React.FC = () => {
  return <Header>REVIEW SUMMARY PAGE</Header>
}

const ReviewPage: React.FC = () => {
  return <Header>REVIEW SUMMARY PAGE</Header>
}

export default ReviewPageWrapperNEW
