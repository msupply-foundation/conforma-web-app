import React from 'react'
import { Container, Form, Header, Message } from 'semantic-ui-react'
import { Loading, ReviewSection } from '../../components'
import useLoadReview from '../../utils/hooks/useLoadReview'
import { useRouter } from '../../utils/hooks/useRouter'

const ReviewPageWrapper: React.FC = () => {
  // Page will present the list of visible questions in Summary view, with additional "Reviewing" controls beneath each question.
  // Will also need to useGetTriggers hook to wait until Review(Assignment) and Application records have Null triggers before loading

  const {
    params: { serialNumber, reviewId },
  } = useRouter()

  // TODO: Need to wait for trigger to run that will set the Review status as DRAFT (after creation)

  const { error, loading, reviewSections } = useLoadReview({
    reviewId: Number(reviewId),
    serialNumber,
  })

  return error ? (
    <Message error header="Problem to load review" list={[error]} />
  ) : loading ? (
    <Loading />
  ) : reviewSections ? (
    <Container>
      <Header as="h1" content="REVIEW AND SUBMIT" />
      <Form>
        {reviewSections.map((reviewSection) => (
          <ReviewSection
            key={`SecSummary_${reviewSection.section.code}`}
            reviewSection={reviewSection}
            canEdit={true} // TODO: Check Review status
          />
        ))}
        {/* {appStatus.status === 'DRAFT' ? (
            <Button content="Submit application" onClick={() => submit()} />
          ) : null}
          {showProcessingModal(processing, submitted)} */}
      </Form>
    </Container>
  ) : (
    <Message error header="Problem to load application for review" />
  )
}

export default ReviewPageWrapper
