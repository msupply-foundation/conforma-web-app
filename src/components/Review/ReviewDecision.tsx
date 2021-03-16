import React from 'react'
import { Checkbox, Form, Message } from 'semantic-ui-react'
import { Decision } from '../../utils/generated/graphql'
import { DecisionOption } from '../../utils/hooks/useGetDecisionOptions'
import strings from '../../utils/constants'

type ReviewDecisionProps = {
  decisionOptions: DecisionOption[]
  setDecision: (decision: Decision) => void
  isDecisionError: boolean
  isEditable: boolean
}

const ReviewDecision: React.FC<ReviewDecisionProps> = ({
  decisionOptions,
  setDecision,
  isDecisionError,
  isEditable,
}) => {
  if (isEditable)
    return (
      <Form>
        {decisionOptions
          .filter((option) => option.isVisible)
          .map((option) => (
            <Form.Field error={isDecisionError} key={option.code}>
              <Checkbox
                radio
                label={option.title}
                name={option.title}
                value={option.code}
                checked={option.value}
                onChange={() => setDecision(option.code)}
              />
            </Form.Field>
          ))}
      </Form>
    )
  // If review has been submitted/locked:
  // Check if has one selected option
  const visibleOptions = decisionOptions.filter((option) => option.isVisible)
  if (visibleOptions.length === 0) return null // For locked status we don't show options
  if (visibleOptions.length > 1) console.log('More than one decision option selected')
  const selectedOption = visibleOptions[0]
  return (
    <Message>
      <Message.Header>{strings.TITLE_REVIEW_DECISION}</Message.Header>
      {selectedOption.title}
    </Message>
  )
}

export default ReviewDecision
