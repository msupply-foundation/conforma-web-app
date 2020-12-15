import React, { useState } from 'react'
import { Container, Form, Header, Label, Message } from 'semantic-ui-react'
import { Loading } from '../../components'
import strings from '../../utils/constants'
import useLoadReview from '../../utils/hooks/useLoadReview'
import { useRouter } from '../../utils/hooks/useRouter'
import { useUpdateReviewResponseMutation } from '../../utils/generated/graphql'
import { ReviewQuestionDecision } from '../../utils/types'
import getReviewQuery from '../../utils/graphql/queries/getReview.query'

const ReviewPageWrapper: React.FC = () => {
  const [updatingResponses, setUpdatingResponses] = useState(false)
  const {
    params: { serialNumber, reviewId },
  } = useRouter()

  // TODO: Need to wait for trigger to run that will set the Review status as DRAFT (after creation)

  const { error, loading, applicationName, reviewSections } = useLoadReview({
    reviewId: Number(reviewId),
    serialNumber,
  })

  const [updateReviewResponse] = useUpdateReviewResponseMutation({
    onCompleted: ({ updateReviewResponse }) =>
      console.log('Success to update reviewResponse: ', updateReviewResponse?.clientMutationId),
    onError: (error) => console.log('Problem to update reviewResponse', error.message),
    refetchQueries: [
      {
        query: getReviewQuery,
        variables: { reviewId: Number(reviewId), serialNumber },
      },
    ],
  })

  const updateResponses = (array: ReviewQuestionDecision[]) => {
    setUpdatingResponses(true)
    array.forEach((reviewResponse) => {
      updateReviewResponse({ variables: { ...reviewResponse } })
    })
    setUpdatingResponses(false)
  }

  return error ? (
    <Message error header={strings.ERROR_REVIEW_PAGE} list={[error]} />
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
            updatingResponses={updatingResponses}
            updateResponses={updateResponses}
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
