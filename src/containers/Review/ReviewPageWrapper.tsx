import { stringify } from 'querystring'
import React from 'react'
import { Container, Form, Header, Label, Message } from 'semantic-ui-react'
import { Loading, ReviewSection } from '../../components'
import useLoadReview from '../../utils/hooks/useLoadReview'
import { useRouter } from '../../utils/hooks/useRouter'
import strings from '../../utils/constants'

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
    <Message error header="Problem to load review" list={[error]} />
  ) : loading ? (
    <Loading />
  ) : reviewSections ? (
    <>
      <Container text textAlign="center">
        <Label color="blue">{strings.STAGE_PACEHOLDER}</Label>
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
    <Message error header="Problem to load application for review" />
  )
}

export default ReviewPageWrapper
