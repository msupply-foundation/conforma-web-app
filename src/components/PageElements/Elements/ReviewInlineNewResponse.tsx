import React, { useState } from 'react'
import { Button, Form, Radio, TextArea } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { SummaryViewWrapperProps } from '../../../formElementPlugins/types'
import { ReviewResponseDecision } from '../../../utils/generated/graphql'
import { useCreateReviewResponseMutation } from '../../../utils/generated/graphql'
import { ReviewDetails } from '../../../utils/types'

interface ReviewInlineNewResponseProps {
  setIsActiveEdit: (_: boolean) => void
  summaryViewProps: SummaryViewWrapperProps
  reviewInfo: ReviewDetails
  stageNumber: number
}

const ReviewInlineNewResponse: React.FC<ReviewInlineNewResponseProps> = ({
  setIsActiveEdit,
  summaryViewProps,
  reviewInfo,
  stageNumber,
}) => {
  const { strings } = useLanguageProvider()
  const [reviewResponse, setReviewResponse] = useState<{
    comment?: string
    decision?: ReviewResponseDecision
  }>({})

  const [createResponse] = useCreateReviewResponseMutation({
    onError: (error) => {
      // setError(error)
    },
  })

  const templateElementId = summaryViewProps.element.id as number
  const applicationId = summaryViewProps?.applicationData?.id as number
  const reviewId = reviewInfo.id

  const reviewOptions = [
    {
      label: strings.LABEL_REVIEW_APPROVE,
      decision: ReviewResponseDecision.Approve,
    },
    {
      label: strings.LABEL_REVIEW_RESSUBMIT,
      decision: ReviewResponseDecision.Decline,
    },
  ]

  const submit = async () => {
    await createResponse({
      variables: {
        templateElementId,
        applicationId,
        reviewId,
        stageNumber,
        decision: reviewResponse.decision as ReviewResponseDecision,
        comment: reviewResponse.comment,
      },
      refetchQueries: ['getReviewResponses'],
    })
    setIsActiveEdit(false)
  }

  const isInvalidComment =
    (!reviewResponse.comment || reviewResponse.comment?.trim() === '') &&
    reviewResponse?.decision === ReviewResponseDecision.Decline

  return (
    <div className="response-container highlight-background">
      <div className="response-element-content">
        <Form>
          <Form.Field>
            <label>{strings.LABEL_REVIEW}</label>
          </Form.Field>
          {reviewOptions.map(({ decision, label }) => (
            <Form.Field key={decision}>
              <Radio
                label={label}
                value={decision}
                name="decisionGroup"
                checked={reviewResponse.decision === decision}
                onChange={() =>
                  setReviewResponse({
                    ...reviewResponse,
                    decision: decision,
                  })
                }
              />
            </Form.Field>
          ))}
          <Form.Field>
            <label>{strings.LABEL_COMMENT}</label>
          </Form.Field>
          <Form.Field>
            <TextArea
              rows={4}
              defaultValue={reviewResponse.comment}
              onChange={(_, { value }) =>
                setReviewResponse({ ...reviewResponse, comment: String(value) })
              }
            />
          </Form.Field>
          <div className="review-button-container">
            <Button
              primary
              disabled={isInvalidComment || !reviewResponse.decision}
              content={strings.BUTTON_ADD_REVIEW}
              onClick={submit}
              className="button-med"
            />
            <Button
              primary
              inverted
              content={strings.OPTION_CANCEL}
              onClick={() => setIsActiveEdit(false)}
              className="button-med"
            />
          </div>
        </Form>
      </div>
    </div>
  )
}

export default ReviewInlineNewResponse
