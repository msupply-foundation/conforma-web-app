import React from 'react'
import { Route, Switch } from 'react-router'
import { Header } from 'semantic-ui-react'
import { NoMatch } from '../../components'
import { useRouter } from '../../utils/hooks/useRouter'
import { AssignmentDetailsNEW, FullStructure } from '../../utils/types'
import ReviewPage from './ReviewPage'

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
      <Switch>
        <Route exact path={`${path}/summary`}>
          <ReviewSummaryNEW />
        </Route>
        <Route exact path={path}>
          <ReviewPage {...{ structure, reviewAssignment }} />
        </Route>
        <Route>
          <NoMatch />
        </Route>
      </Switch>
    </>
  )
}

// To be used in case the decision step is in a separated page...
const ReviewSummaryNEW: React.FC = () => {
  return <Header>REVIEW SUMMARY PAGE</Header>
}

export default ReviewPageWrapperNEW
