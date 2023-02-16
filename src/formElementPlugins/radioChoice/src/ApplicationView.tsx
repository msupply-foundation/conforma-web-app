import React, { useState } from 'react'
import { Radio, Form, Input, Label } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import useDefault from '../../useDefault'

const ApplicationView: React.FC<ApplicationViewProps> = ({
  element,
  parameters,
  onUpdate,
  currentResponse,
  validationState,
  onSave,
  Markdown,
  getDefaultIndex,
}) => {
  const { getPluginStrings } = useLanguageProvider()
  const strings = getPluginStrings('radioChoice')
  const {
    label,
    description,
    options,
    default: defaultValue,
    persistUserInput,
    optionsDisplayProperty,
    hasOther,
    otherPlaceholder,
    layout,
  } = parameters

  const { code, isEditable } = element

  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
    currentResponse?.optionIndex
  )

  const allOptions = [...options]
  if (hasOther) allOptions.push(strings.OTHER)

  const [otherText, setOtherText] = useState<string | undefined>(
    hasOther && currentResponse?.optionIndex === allOptions.length - 1
      ? (currentResponse?.text as string)
      : undefined
  )

  useDefault({
    defaultValue,
    currentResponse,
    persistUserInput,
    onChange: (defaultOption) => {
      const optionIndex = getDefaultIndex(defaultOption, options)
      if (optionIndex >= 0) handleChange(optionIndex)
      else {
        if (!hasOther) return
        handleChange(allOptions.length - 1, defaultOption)
      }
    },
    additionalDependencies: [options],
  })

  function handleChange(optionIndex: number, additionalText: string | undefined = otherText) {
    setSelectedIndex(optionIndex)
    onSave({
      text:
        hasOther && optionIndex === allOptions.length - 1
          ? additionalText ?? ''
          : optionsDisplayProperty
          ? allOptions[optionIndex][optionsDisplayProperty]
          : allOptions[optionIndex],
      selection: allOptions[optionIndex],
      optionIndex,
      other: hasOther && optionIndex === allOptions.length - 1,
    })
    if (additionalText) setOtherText(additionalText)
  }

  function handleOtherChange(value: string) {
    setOtherText(value)
  }

  function handleOtherLoseFocus(_: any) {
    onSave({
      text: otherText,
      selection: allOptions[allOptions.length - 1],
      optionIndex: allOptions.length - 1,
      other: hasOther,
    })
  }

  const radioButtonOptions = allOptions.map((option: any, index: number) => {
    return {
      key: `${index}_${option}`,
      text: optionsDisplayProperty ? option[optionsDisplayProperty] : option,
      value: index,
    }
  })

  const styles =
    layout === 'inline'
      ? {
          display: 'inline',
          marginRight: 30,
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
      {radioButtonOptions.map((option: any, index: number) => {
        const showOther = hasOther && index === allOptions.length - 1
        return (
          <Form.Field
            key={option.key}
            disabled={!isEditable}
            style={styles}
            inline={showOther}
            error={!validationState.isValid}
          >
            <Radio
              label={option.text}
              name={`${code}_radio_${index}`} // This is GROUP name
              value={selectedIndex}
              checked={index === selectedIndex}
              onChange={(_, { index }) => handleChange(index)}
              index={index}
            />
            {showOther && (
              <Input
                placeholder={otherPlaceholder}
                size="small"
                disabled={selectedIndex !== allOptions.length - 1}
                onChange={(_, { value }) => handleOtherChange(value)}
                onBlur={handleOtherLoseFocus}
                value={otherText}
              />
            )}
          </Form.Field>
        )
      })}
      {validationState.isValid ? null : (
        <Label pointing prompt content={validationState?.validationMessage} />
      )}
    </>
  )
}

export default ApplicationView
