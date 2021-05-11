import React, { useState } from 'react'
import { Button, Form, Header, Modal, Radio, Segment, TextArea } from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'
import { ReviewResponseDecision } from '../../utils/generated/graphql'
import strings from '../../utils/constants'
import messages from '../../utils/messages'
import SummaryViewWrapper from '../../formElementPlugins/SummaryViewWrapper'
import { SummaryViewWrapperProps } from '../../formElementPlugins/types'
import useUpdateReviewResponse from '../../utils/hooks/useUpdateReviewResponse'
import { ReviewElementProps } from '../../utils/types'

type DecisionAreaProps = SummaryViewWrapperProps & ReviewElementProps

const DecisionArea: React.FC<DecisionAreaProps> = ({ reviewResponse, ...summaryViewProps }) => {
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

  return (
    <Modal
      closeIcon
      open={!!openResponse}
      onClose={() => {
        updateQuery({ openResponse: null })
      }}
      size="fullscreen"
      style={{ margin: 0, background: 'transparent' }}
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
                <Form.Field>
                  <strong>{strings.LABEL_REVIEW}</strong>
                </Form.Field>
                {/* // TODO: Change to list options dynamically? */}
                <Form.Field>
                  <Radio
                    label={strings.LABEL_REVIEW_APPROVE}
                    value={strings.LABEL_REVIEW_APPROVE}
                    name="decisionGroup"
                    checked={reviewUpdate.decision === ReviewResponseDecision.Approve}
                    onChange={() =>
                      setReviewUpdate({
                        ...reviewUpdate,
                        decision: ReviewResponseDecision.Approve,
                      })
                    }
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    label={strings.LABEL_REVIEW_RESSUBMIT}
                    value={strings.LABEL_REVIEW_RESSUBMIT}
                    name="decisionGroup"
                    checked={reviewUpdate.decision === ReviewResponseDecision.Decline}
                    onChange={() =>
                      setReviewUpdate({
                        ...reviewUpdate,
                        decision: ReviewResponseDecision.Decline,
                      })
                    }
                  />
                </Form.Field>
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
                    disabled={
                      !reviewUpdate.decision ||
                      (reviewUpdate.decision === ReviewResponseDecision.Decline &&
                        !reviewUpdate.comment)
                    }
                    content={strings.BUTTON_SUBMIT}
                  />
                </Form.Field>
                {reviewUpdate.decision === ReviewResponseDecision.Decline &&
                  !reviewUpdate.comment && (
                    <p className="alert">{messages.REVIEW_RESUBMIT_COMMENT}</p>
                  )}
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
