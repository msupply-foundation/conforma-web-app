import React, { CSSProperties } from 'react'
import { Dropdown, Form, Label, Message } from 'semantic-ui-react'
import { Decision } from '../../utils/generated/graphql'
import { DecisionOption } from '../../utils/types'
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
  const options = decisionOptions
    .filter((option) => option.isVisible)
    .map(({ title, code, value }) => ({
      text: title,
      value: code,
      checked: value,
    }))

  const onChangeDecision = (_: any, { value: code }: any) => setDecision(code)

  if (isEditable)
    return (
      <Form style={inlineStyles.form}>
        <Label style={inlineStyles.decisionLabel} content={strings.LABEL_REVIEW_DECISION} />
        <Form.Field
          as={Dropdown}
          selection
          disabled={options.length === 0}
          error={isDecisionError}
          options={options}
          onChange={onChangeDecision}
        />
      </Form>
    )

  // If review has been submitted/locked:
  const visibleOption = decisionOptions.find((option) => option.isVisible)
  if (!visibleOption) return null
  return (
    <Message
      style={inlineStyles.message}
      attached="top"
      icon="calendar check outline"
      header={strings.TITLE_REVIEW_DECISION}
      content={visibleOption.title}
    />
  )
}

// Styles - TODO: Move to LESS || Global class style (semantic)
const inlineStyles = {
  message: {
    // Showing too big on mobile
    margin: '10px 20px 10px',
  },
  form: {
    // Showing too big on mobile
    display: 'flex',
    maxHeight: 50,
    margin: '10px 20px 10px',
  } as CSSProperties,
  decisionLabel: {
    background: 'transparent',
    fontWeight: 'bolder',
    fontSize: 16,
    alignContent: 'center',
    marginRight: 10,
  } as CSSProperties,
}

export default ReviewDecision
