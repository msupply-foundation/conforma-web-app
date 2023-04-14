import React from 'react'
import { Route, Switch } from 'react-router'
import { Container, Message } from 'semantic-ui-react'
import { Loading, NoMatch, ReviewContainer } from '../../components'
import { useRouter } from '../../utils/hooks/useRouter'
import { useLanguageProvider } from '../../contexts/Localisation'
import { FullStructure } from '../../utils/types'
import ReviewPage from './ReviewPage'
import { getPreviousStageAssignment } from '../../utils/helpers/assignment/getPreviousStageAssignment'
import useGetReviewInfo from '../../utils/hooks/useGetReviewInfo'
import { useUserState } from '../../contexts/UserState'

const ReviewPageWrapper: React.FC<{
  structure: FullStructure
}> = ({ structure: fullStructure }) => {
  const { t } = useLanguageProvider()
  const {
    query: { reviewId },
    match: { path },
  } = useRouter()
  const {
    userState: { currentUser },
  } = useUserState()

  const {
    error,
    loading,
    assignments: reviewAssignments,
  } = useGetReviewInfo({
    applicationId: fullStructure.info.id,
    serial: fullStructure.info.serial,
    userId: currentUser?.userId as number,
  })

  if (error) return <Message error title={t('ERROR_GENERIC')} list={[error]} />
  if (loading || !fullStructure) return <Loading />

  if (!reviewAssignments) return <NoMatch />

  const { info } = fullStructure

  // Find the review id used in URL in reviewAssignments
  const reviewAssignment = reviewAssignments.find(
    (reviewAssignment) => reviewAssignment?.review?.id === Number(reviewId)
  )

  if (!reviewAssignment) return <NoMatch />

  const previousAssignment = getPreviousStageAssignment(
    info.serial,
    reviewAssignments,
    reviewAssignment.current.stage.number
  )

  // Pass through structure and reviewAssignment associated to review
  return (
    <ReviewContainer application={info}>
      <Container id="review-page-summary">
        <Switch>
          <Route exact path={path}>
            <ReviewPage
              {...{ fullApplicationStructure: fullStructure, reviewAssignment, previousAssignment }}
            />
          </Route>
          <Route>
            <NoMatch />
          </Route>
        </Switch>
      </Container>
    </ReviewContainer>
  )
}

export default ReviewPageWrapper
