import React, { useEffect } from 'react'
import { Card, Header, List, Message } from 'semantic-ui-react'
import { Loading } from '../../components'
import useLoadReview from '../../utils/hooks/useLoadReview'
import { useRouter } from '../../utils/hooks/useRouter'
import { ApplicationResponse, ReviewResponse } from '../../utils/generated/graphql'

const ReviewPageWrapper: React.FC = () => {
  // Page will present the list of visible questions in Summary view, with additional "Reviewing" controls beneath each question.
  // Will also need to useGetTriggers hook to wait until Review(Assignment) and Application records have Null triggers before loading

  const {
    params: { serialNumber, reviewId },
  } = useRouter()

  // TODO: Need to wait for trigger to run that will set the Review status as DRAFT (after creation)

  const { error, loading, reviewElements } = useLoadReview({
    reviewId: Number(reviewId),
    serialNumber,
  })

  useEffect(() => {
    console.log('reviewElements', reviewElements)
  }, [reviewElements])

  return error ? (
    <Message error header="Problem to load review" list={[error]} />
  ) : loading ? (
    <Loading />
  ) : (
    <div>
      <p>
        This is the Review page for Review ID#{reviewId} of Application {serialNumber}
      </p>
    </div>
  )
}

export default ReviewPageWrapper
