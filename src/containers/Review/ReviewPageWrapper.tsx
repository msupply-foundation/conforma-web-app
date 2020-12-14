import React, { useEffect } from 'react'
import { Card, Header, List, Message } from 'semantic-ui-react'
import { Loading } from '../../components'
import strings from '../../utils/constants'
import useLoadReview from '../../utils/hooks/useLoadReview'
import { useRouter } from '../../utils/hooks/useRouter'

const ReviewPageWrapper: React.FC = () => {
  // Page will present the list of visible questions in Summary view, with additional "Reviewing" controls beneath each question.
  // Will also need to useGetTriggers hook to wait until Review(Assignment) and Application records have Null triggers before loading

  const {
    params: { serialNumber, reviewId },
  } = useRouter()

  // TODO: Need to wait for trigger to run that will set the Review status as DRAFT (after creation)

  const { error, loading, data } = useLoadReview({ reviewId: Number(reviewId) })

  useEffect(() => {
    console.log('data', data)
  }, [data])

  return error ? (
    <Message error header={strings.ERROR_REVIEW_PAGE} list={[error]} />
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
