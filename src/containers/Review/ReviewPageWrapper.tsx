import React, { useEffect } from 'react'
import { Container, Form, Header, Label, Message } from 'semantic-ui-react'
import { Loading, ReviewSection } from '../../components'
import strings from '../../utils/constants'
import useLoadReview from '../../utils/hooks/useLoadReview'
import { useRouter } from '../../utils/hooks/useRouter'

const ReviewPageWrapper: React.FC = () => {
  const {
    params: { serialNumber, reviewId },
  } = useRouter()

  // TODO: Need to wait for trigger to run that will set the Review status as DRAFT (after creation)

  const { error, loading, applicationName, reviewSections } = useLoadReview({
    reviewId: Number(reviewId),
    serialNumber,
  })

  return error ? (
    <Message error header={strings.ERROR_REVIEW_PAGE} list={[error]} />
  ) : loading ? (
    <Loading />
  ) : reviewSections ? (
    <>
      <Container text textAlign="center">
        <Label color="blue">{strings.STAGE_PLACEHOLDER}</Label>
        <Header content={applicationName} subheader={strings.DATE_APPLICATION_PLACEHOLDER} />
        <Header
          as="h3"
          color="grey"
          content={strings.TITLE_REVIEW_SUMMARY}
          subheader={strings.SUBTITLE_REVIEW}
        />
      </Container>
      <Form>
        {reviewSections.map((reviewSection) => (
          <ReviewSection
            key={`ReviewSection_${reviewSection.section.code}`}
            reviewSection={reviewSection}
            canEdit={true} // TODO: Check Review status
          />
        ))}
      </Form>
    </>
  ) : (
    <Message error header={strings.ERROR_REVIEW_PAGE} />
  )
}

export default ReviewPageWrapper
