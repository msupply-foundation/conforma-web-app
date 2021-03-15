import React from 'react'
import { Route, Switch } from 'react-router'
import { Header, Message } from 'semantic-ui-react'
import { Loading, NoMatch } from '../../components'
import useGetFullApplicationStructure from '../../utils/hooks/useGetFullApplicationStructure'
import { useRouter } from '../../utils/hooks/useRouter'
import strings from '../../utils/constants'
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

  // Get application structure with evaluated properties (i.e visibility)
  const { error, fullStructure: fullApplicationStructure } = useGetFullApplicationStructure({
    structure,
    firstRunValidation: false,
    shouldCalculateProgress: false,
  })

  if (error) return <Message error title={strings.ERROR_GENERIC} list={[error]} />

  if (!fullApplicationStructure) return <Loading />

  // Find the review id used in URL in reviewAssignments
  const reviewAssignment = reviewAssignments.find(
    (reviewAssignment) => reviewAssignment?.review?.id === Number(reviewId)
  )

  if (!reviewAssignment) return <NoMatch />
  // Pass through structure and reviewAssignment associated to review
  return (
    <>
      <Switch>
        <Route exact path={`${path}/summary`}>
          <ReviewSummaryNEW />
        </Route>
        <Route exact path={path}>
          <ReviewPage {...{ fullApplicationStructure, reviewAssignment }} />
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
