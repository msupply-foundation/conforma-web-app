import React, { useEffect, useState } from 'react'
import { Radio, Form, Input } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'

const ApplicationView: React.FC<ApplicationViewProps> = ({
  code,
  parameters,
  onUpdate,
  value,
  setValue,
  isEditable,
  currentResponse,
  validationState,
  onSave,
  Markdown,
  getDefaultIndex,
}) => {
  const {
    label,
    description,
    options,
    default: defaultOption,
    hasOther,
    otherPlaceholder,
  } = parameters

  const [otherText, setOtherText] = useState<string>()

  const allOptions = [...options]
  if (hasOther) allOptions.push('Other')

  useEffect(() => {
    onUpdate(value)
    // This ensures that, if a default is specified, it gets saved on first load
    if (!value && defaultOption !== undefined) {
      const defaultIndex = getDefaultIndex(defaultOption, allOptions)
      const defaultValue = allOptions?.[defaultIndex]
      onSave({
        text: defaultValue,
        optionIndex: defaultIndex,
      })
      setValue(defaultValue)
    }
  }, [])

  function handleChange(e: any, data: any) {
    const { value, index } = data
    setValue(value)
    onSave({
      text: hasOther && value === 'Other: ' ? 'Other' + otherText : value,
      optionIndex: index,
    })
  }

  function handleOtherChange(e: any, { value }: any) {
    setOtherText(value)
  }

  function handleOtherLoseFocus(e: any) {
    onSave({
      text: 'Other: ' + otherText,
      optionIndex: allOptions.length - 1,
    })
  }

  return (
    <>
      <label>
        <Markdown text={label} semanticComponent="noParagraph" />
      </label>
      <Markdown text={description} />
      {allOptions.map((option: string, index: number) => {
        return (
          <Form.Field key={`${index}_${option}`} disabled={!isEditable}>
            <Radio
              label={option}
              name={`${code}_radio_${index}`} // This is GROUP name
              value={option}
              checked={option === value}
              onChange={handleChange}
              index={index}
              float="left"
            />
            {/* TO-DO: Need to find a way to make this input field inline with  the last Other radio button*/}
            {option === 'Other' && (
              <Input
                placeholder={otherPlaceholder}
                size="small"
                disabled={value !== 'Other'}
                onChange={handleOtherChange}
                onBlur={handleOtherLoseFocus}
              />
            )}
          </Form.Field>
        )
      })}
    </>
  )
}

export default ApplicationView
