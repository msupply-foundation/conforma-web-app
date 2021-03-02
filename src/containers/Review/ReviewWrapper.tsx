import React from 'react'
import { Route, Switch } from 'react-router'
import { Header } from 'semantic-ui-react'
import { NoMatch } from '../../components'
import { useRouter } from '../../utils/hooks/useRouter'
import { FullStructure } from '../../utils/types'

const ReviewWrapper: React.FC = () => {
  const {
    match: { path },
    query: { reviewId },
  } = useRouter()

  return (
    <Switch>
      <Route exact path={path}>
        <ReviewHomeNEW />
      </Route>
      <Route exact path={`${path}/:reviewId`}>
        <ReviewPageNEW reviewId={Number(reviewId)} />
      </Route>
      <Route exact path={`${path}/:reviewId/summary`}>
        <ReviewSummaryNEW reviewId={Number(reviewId)} />
      </Route>
      <Route>
        <NoMatch />
      </Route>
    </Switch>
  )
}

interface ReviewHomeProps {
  fullStructure?: FullStructure
}

const ReviewHomeNEW: React.FC<ReviewHomeProps> = ({ fullStructure }) => {
  return <Header>REVIEW HOME PAGE</Header>
}

interface ReviewProps {
  reviewId: number
}

const ReviewPageNEW: React.FC<ReviewProps> = ({ reviewId }) => {
  return <Header>REVIEW PAGE</Header>
}

// To be used in case the decision step is in a separated page...
const ReviewSummaryNEW: React.FC<ReviewProps> = ({ reviewId }) => {
  return <Header>REVIEW SUMMARY PAGE</Header>
}

export default ReviewWrapper
