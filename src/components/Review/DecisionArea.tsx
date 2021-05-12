import React, { useState } from 'react'
import { Button, Form, Header, Modal, Radio, Segment, TextArea } from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'
import { ReviewResponse, ReviewResponseDecision } from '../../utils/generated/graphql'
import strings from '../../utils/constants'
import messages from '../../utils/messages'
import SummaryViewWrapper from '../../formElementPlugins/SummaryViewWrapper'
import { SummaryViewWrapperProps } from '../../formElementPlugins/types'
import useUpdateReviewResponse from '../../utils/hooks/useUpdateReviewResponse'

type DecisionAreaProps = SummaryViewWrapperProps & {
  reviewResponse: ReviewResponse
  isConsolidation: boolean
}

const optionsMap = {
  consolidation: [
    {
      label: strings.LABEL_CONSOLIDATION_AGREE,
      decision: ReviewResponseDecision.Agree,
    },
    {
      label: strings.LABEL_CONSOLIDATION_DISAGREE,
      decision: ReviewResponseDecision.Disagree,
    },
  ],
  review: [
    {
      label: strings.LABEL_REVIEW_APPROVE,
      decision: ReviewResponseDecision.Approve,
    },
    {
      label: strings.LABEL_REVIEW_RESSUBMIT,
      decision: ReviewResponseDecision.Decline,
    },
  ],
}

const DecisionArea: React.FC<DecisionAreaProps> = ({
  reviewResponse,
  isConsolidation,
  ...summaryViewProps
}) => {
  const {
    query: { openResponse },
    updateQuery,
  } = useRouter()
  const [reviewUpdate, setReviewUpdate] = useState(reviewResponse)
  const updateResponse = useUpdateReviewResponse()

  const submit = async () => {
    updateQuery({ openResponse: null })
    // TODO do we need to handle update error ?
    await updateResponse(reviewUpdate)
  }

  const isValidComment =
    (!!reviewUpdate.comment && reviewUpdate.comment?.trim() !== '') ||
    (isConsolidation
      ? reviewUpdate?.decision !== ReviewResponseDecision.Disagree
      : reviewUpdate?.decision !== ReviewResponseDecision.Decline)

  const options = isConsolidation ? optionsMap.consolidation : optionsMap.review

  return (
    <Modal
      closeIcon
      open={!!openResponse}
      onClose={() => {
        updateQuery({ openResponse: null })
      }}
      size="fullscreen"
      style={{ margin: 0, background: 'transparent' }} // TODO: Move style to overrides
    >
      <div id="review-decision-container">
        <div id="review-decision-content">
          <div id="document-viewer" className="hidden-element">
            TO-DO: DOCUMENT VIEWER
          </div>
          <div id="details-panel">
            <Form>
              <Segment basic>
                <Header as="h3">{strings.TITLE_DETAILS}</Header>
                <SummaryViewWrapper {...summaryViewProps} />
              </Segment>
              <Segment basic>
                <strong>
                  {isConsolidation ? strings.LABEL_CONSOLIDATE : strings.LABEL_REVIEW}
                </strong>
                {options.map(({ decision, label }) => (
                  <Form.Field key={decision}>
                    <Radio
                      label={label}
                      value={decision}
                      name="decisionGroup"
                      checked={reviewUpdate.decision === decision}
                      onChange={() =>
                        setReviewUpdate({
                          ...reviewUpdate,
                          decision: decision,
                        })
                      }
                    />
                  </Form.Field>
                ))}
              </Segment>
              <Segment basic>
                <Form.Field>
                  <strong>{strings.LABEL_COMMENT}</strong>
                </Form.Field>
                <TextArea
                  rows={8}
                  defaultValue={reviewUpdate.comment}
                  onChange={(_, { value }) =>
                    setReviewUpdate({ ...reviewUpdate, comment: String(value) })
                  }
                />
              </Segment>
              <Segment basic>
                <Form.Field>
                  <Button
                    primary
                    className="button-wide"
                    onClick={submit}
                    disabled={!isValidComment}
                    content={strings.BUTTON_SUBMIT}
                  />
                </Form.Field>
                {!isValidComment && <p className="alert">{messages.REVIEW_RESUBMIT_COMMENT}</p>}
              </Segment>
              <Segment basic id="history-panel">
                <p>
                  <em>History panel goes here</em>
                </p>
              </Segment>
            </Form>
          </div>
        </div>
      </div>
      )
    </Modal>
  )
}

export default DecisionArea
