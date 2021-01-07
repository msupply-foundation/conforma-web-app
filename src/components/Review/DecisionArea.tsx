import React from 'react'
import { Button, Header, Modal, Radio, Segment, TextArea, TextAreaProps } from 'semantic-ui-react'
import { SummaryViewWrapper } from '../../formElementPlugins'
import { ReviewResponseDecision } from '../../utils/generated/graphql'
import { DecisionAreaState, ReviewQuestionDecision } from '../../utils/types'
import strings from '../../utils/constants'

interface DecisionAreaProps {
  state: DecisionAreaState
  setDecision: Function
  submitHandler: (_: any) => void
}

const DecisionArea: React.FC<DecisionAreaProps> = ({ state, setDecision, submitHandler }) => {
  const { open, review, summaryViewProps } = state
  const handleChange = (value: ReviewResponseDecision) => {
    const { id, comment } = review as ReviewQuestionDecision
    setDecision({
      ...state,
      review: { id, comment, decision: value },
    })
  }

  const handleUpdateComment = (_: any, { value }: TextAreaProps) => {
    const { review } = state
    setDecision({ ...state, review: { ...review, comment: value } })
  }

  return (
    <Modal open={open} size="fullscreen" style={{ margin: 0, background: 'transparent' }}>
      {open && summaryViewProps && review && (
        <Segment
          floated="right"
          style={{
            backgroundColor: 'white',
            height: '100vh',
            width: '300px',
          }}
        >
          <Segment basic>
            <Header>{strings.TITLE_DETAILS}</Header>
            <SummaryViewWrapper {...summaryViewProps} />
          </Segment>
          <Segment basic>
            <Header as="h3">{strings.LABEL_REVIEW}</Header>
            {/* // TODO: Change to list options dynamically? */}
            <Radio
              style={{ width: '100%' }}
              label={strings.LABEL_REVIEW_APPROVE}
              value={strings.LABEL_REVIEW_APPROVE}
              checked={review.decision === ReviewResponseDecision.Approve}
              onChange={() => handleChange(ReviewResponseDecision.Approve)}
            />
            <Radio
              style={{ width: '100%' }}
              label={strings.LABEL_REVIEW_RESSUBMIT}
              value={strings.LABEL_REVIEW_RESSUBMIT}
              checked={review.decision === ReviewResponseDecision.Decline}
              onChange={() => handleChange(ReviewResponseDecision.Decline)}
            />
          </Segment>
          <Segment basic>
            <Header as="h3">{strings.LABEL_COMMENT}</Header>
            <TextArea
              style={{ minHeight: 100 }}
              value={review.comment}
              onChange={handleUpdateComment}
            />
          </Segment>
          <Segment basic>
            <Button color="blue" basic onClick={submitHandler}>
              {strings.BUTTON_SUBMIT}
            </Button>
          </Segment>
        </Segment>
      )}
    </Modal>
  )
}

export default DecisionArea
