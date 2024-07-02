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

/*
This component is visually the same as "ReviewInlineInput", but is used when
reviewing elements that don't have an applicantResponse. Instead of updating a
reviewResponse, it needs to create a new one and its associated applicationResponse.

Currently, this "optionally reviewable" functionality is only intended to work with first-level reviews (i.e. not Consolidations).
*/
const ReviewInlineNewResponse: React.FC<ReviewInlineNewResponseProps> = ({
  setIsActiveEdit,
  summaryViewProps,
  reviewInfo,
  stageNumber,
}) => {
  const { t } = useLanguageProvider()
  const [reviewResponse, setReviewResponse] = useState<{
    comment?: string
    decision?: ReviewResponseDecision
  }>({})

  const [createResponse] = useCreateReviewResponseMutation({
    onError: (error) => {
      // To-do
      // setError(error)
    },
  })

  // Values required for creating new applicationResponse and reviewResponse
  const templateElementId = summaryViewProps.element.id as number
  const applicationId = summaryViewProps.applicationData?.id as number
  const reviewId = reviewInfo.id
  const timeSubmitted = summaryViewProps.applicationData?.current.timeStatusCreated

  const reviewOptions = [
    {
      label: t('LABEL_REVIEW_APPROVE'),
      decision: ReviewResponseDecision.Approve,
    },
    {
      label: t('LABEL_REVIEW_RESSUBMIT'),
      decision: ReviewResponseDecision.Decline,
    },
  ]

  const submit = async (e: any) => {
    e.preventDefault()
    await createResponse({
      variables: {
        templateElementId,
        applicationId,
        reviewId,
        decision: reviewResponse.decision as ReviewResponseDecision,
        comment: reviewResponse.comment,
        timeSubmitted,
      },
      // The order of these refetch queries appears to be important!
      refetchQueries: ['getAllResponses', 'getReviewResponses'],
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
            <label>{t('LABEL_REVIEW')}</label>
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
            <label>{t('LABEL_COMMENT')}</label>
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
              content={t('BUTTON_ADD_REVIEW')}
              onClick={submit}
              className="button-med"
            />
            <Button
              primary
              inverted
              content={t('OPTION_CANCEL')}
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
