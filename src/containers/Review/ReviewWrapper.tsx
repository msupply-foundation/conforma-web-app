import React from 'react'
import { Route, Switch } from 'react-router'
import { Header, Message } from 'semantic-ui-react'
import { Loading, NoMatch } from '../../components'
import { useUserState } from '../../contexts/UserState'
import useGetReviewInfo from '../../utils/hooks/useGetReviewInfo'
import { useRouter } from '../../utils/hooks/useRouter'
import { AssignmentDetailsNEW, FullStructure } from '../../utils/types'
import strings from '../../utils/constants'

interface ReviewWrapperProps {
  structure: FullStructure
}

const ReviewWrapper: React.FC<ReviewWrapperProps> = ({ structure }) => {
  const {
    match: { path },
  } = useRouter()
  const {
    userState: { currentUser },
  } = useUserState()

  const { error, loading, assignments } = useGetReviewInfo({
    applicationId: structure.info.id,
    userId: currentUser?.userId as number,
  })

  if (error) return <Message error header={strings.ERROR_REVIEW_PAGE} list={[error]} />

  if (loading) return <Loading />

  if (!assignments || assignments.length === 0) return <NoMatch />

  return (
    <Switch>
      <Route exact path={path}>
        <ReviewHomeNEW assignments={assignments} structure={structure} />
      </Route>
      <Route exact path={`${path}/:reviewId`}>
        <ReviewPageNEW />
      </Route>
      <Route exact path={`${path}/:reviewId/summary`}>
        <ReviewSummaryNEW />
      </Route>
      <Route>
        <NoMatch />
      </Route>
    </Switch>
  )
}

interface ReviewHomeProps {
  assignments: AssignmentDetailsNEW[]
  structure: FullStructure
}

const ReviewHomeNEW: React.FC<ReviewHomeProps> = ({ assignments, structure }) => {
  console.log(assignments) // To be continued in #379
  return <Header>REVIEW HOME PAGE</Header>
}

const ReviewPageNEW: React.FC = () => {
  return <Header>REVIEW PAGE</Header>
}

// To be used in case the decision step is in a separated page...
const ReviewSummaryNEW: React.FC = () => {
  return <Header>REVIEW SUMMARY PAGE</Header>
}

export default ReviewWrapper
