import React, { useEffect, useState } from 'react'
import { Form } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'

const ApplicationView: React.FC<ApplicationViewProps> = ({
  element,
  parameters,
  onUpdate,
  setIsActive,
  currentResponse,
  validationState,
  onSave,
  Markdown,
}) => {
  const [value, setValue] = useState<string | null | undefined>(currentResponse?.text)
  const [hasEdited, setHasEdited] = useState(
    currentResponse?.text !== null && currentResponse?.text !== parameters?.default
  )
  const { isEditable } = element
  const {
    placeholder,
    maskedInput,
    label,
    description,
    maxWidth,
    maxLength = Infinity,
    default: defaultText,
  } = parameters

  useEffect(() => {
    if (defaultText && (!hasEdited || !value)) {
      onSave({ text: defaultText })
      setValue(defaultText)
    } else onUpdate(value)
  }, [defaultText])

  function handleChange(e: any) {
    let text = e.target.value
    if (text.length > maxLength) {
      text = text.substring(0, maxLength)
    }
    onUpdate(text)
    setValue(text)
    setHasEdited(true)
  }

  function handleLoseFocus(e: any) {
    onSave({ text: value })
  }

  const styles = maxWidth
    ? {
        maxWidth,
      }
    : {}

  return (
    <>
      {label && (
        <label>
          <Markdown text={label} semanticComponent="noParagraph" />
        </label>
      )}
      <Markdown text={description} />
      <Form.Input
        fluid
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleLoseFocus}
        onFocus={setIsActive}
        value={value ? value : ''}
        disabled={!isEditable}
        type={maskedInput ? 'password' : undefined}
        style={styles}
        error={
          !validationState.isValid
            ? {
                content: validationState?.validationMessage,
                pointing: 'above',
              }
            : null
        }
      />
    </>
  )
}

export default ApplicationView
