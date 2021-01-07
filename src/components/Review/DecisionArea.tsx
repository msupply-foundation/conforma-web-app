import React from 'react'
import { Button, Header, Modal, Radio, Segment, TextArea } from 'semantic-ui-react'
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
  const handleChange = (value: string) => {
    const { id, comment } = review as ReviewQuestionDecision
    setDecision({
      ...state,
      review: { id, comment, decision: value as ReviewResponseDecision },
    })
  }

  return (
    <Modal open={open} size="fullscreen" style={{ background: 'transparent' }}>
      {open && summaryViewProps && review && (
        <Segment.Group
          style={{
            backgroundColor: 'white',
            marginLeft: '70%',
            display: 'flex-right',
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
              checked={review.decision === strings.LABEL_REVIEW_APPROVE}
              onChange={() => handleChange(strings.LABEL_REVIEW_APPROVE)}
            />
            <Radio
              style={{ width: '100%' }}
              label={strings.LABEL_REVIEW_RESSUBMIT}
              value={strings.LABEL_REVIEW_RESSUBMIT}
              checked={review.decision === strings.LABEL_REVIEW_RESSUBMIT}
              onChange={() => handleChange(strings.LABEL_REVIEW_RESSUBMIT)}
            />
          </Segment>
          <Segment basic>
            <Header as="h3">{strings.LABEL_COMMENT}</Header>
            <TextArea style={{ minHeight: 100 }} />
          </Segment>
          <Segment basic>
            <Button color="blue" basic onClick={submitHandler}>
              {strings.BUTTON_SUBMIT}
            </Button>
          </Segment>
        </Segment.Group>
      )}
    </Modal>
  )
}

export default DecisionArea
