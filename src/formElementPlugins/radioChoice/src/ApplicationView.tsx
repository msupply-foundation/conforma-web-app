import React, { useEffect, useState } from 'react'
import { Radio, Form, Input } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import strings from '../constants'

const ApplicationView: React.FC<ApplicationViewProps> = ({
  code,
  parameters,
  onUpdate,
  // value,
  // setValue,
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
    optionsDisplayProperty,
    hasOther,
    otherPlaceholder,
  } = parameters

  const [otherText, setOtherText] = useState<string | undefined>(
    hasOther ? currentResponse?.other : undefined
  )
  const [selectedIndex, setSelectedIndex] = useState<number>()

  const allOptions = [...options]
  if (hasOther) allOptions.push(strings.OTHER)

  useEffect(() => {
    onUpdate(currentResponse)
    // This ensures that, if a default is specified, it gets saved on first load
    if (!currentResponse?.text && defaultOption !== undefined) {
      const optionIndex = getDefaultIndex(defaultOption, options)
      onSave({
        text: optionsDisplayProperty
          ? allOptions[optionIndex][optionsDisplayProperty]
          : allOptions[optionIndex],
        selection: allOptions[optionIndex],
        optionIndex,
      })
    }
    if (currentResponse?.text) {
      const { optionIndex } = currentResponse
      setSelectedIndex(optionIndex)
    }
  }, [])

  function handleChange(e: any, data: any) {
    const { index: optionIndex } = data
    setSelectedIndex(optionIndex)
    onSave({
      text:
        hasOther && optionIndex === allOptions.length - 1
          ? `${strings.OTHER}: ${otherText}`
          : optionsDisplayProperty
          ? allOptions[optionIndex][optionsDisplayProperty]
          : allOptions[optionIndex],
      selection: allOptions[optionIndex],
      optionIndex,
      other: hasOther && optionIndex === allOptions.length - 1 ? otherText : undefined,
    })
  }

  function handleOtherChange(e: any, { value }: any) {
    setOtherText(value)
  }

  function handleOtherLoseFocus(e: any) {
    onSave({
      text: `${strings.OTHER}: ${otherText}`,
      selection: allOptions[allOptions.length - 1],
      optionIndex: allOptions.length - 1,
      other: hasOther ? otherText : undefined,
    })
  }

  const radioButtonOptions = allOptions.map((option: any, index: number) => {
    return {
      key: `${index}_${option}`,
      text: optionsDisplayProperty ? option[optionsDisplayProperty] : option,
      value: index,
    }
  })

  return (
    <>
      <label>
        <Markdown text={label} semanticComponent="noParagraph" />
      </label>
      <Markdown text={description} />
      {radioButtonOptions.map((option: any, index: number) => {
        const showOther = hasOther && index === allOptions.length - 1
        return (
          <Form.Field key={`${index}_${option}`} disabled={!isEditable} inline={showOther}>
            <Radio
              label={option.text}
              name={`${code}_radio_${index}`} // This is GROUP name
              value={selectedIndex}
              checked={index === selectedIndex}
              onChange={handleChange}
              index={index}
            />
            {showOther && (
              <Input
                placeholder={otherPlaceholder}
                size="small"
                disabled={selectedIndex !== allOptions.length - 1}
                onChange={handleOtherChange}
                onBlur={handleOtherLoseFocus}
                value={otherText}
              />
            )}
          </Form.Field>
        )
      })}
    </>
  )
}

export default ApplicationView
