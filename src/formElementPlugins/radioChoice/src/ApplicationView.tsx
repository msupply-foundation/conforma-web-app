import React, { useEffect } from 'react'
import { Radio, Form } from 'semantic-ui-react'
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
  const { label, description, options, default: defaultOption, hasOther } = parameters

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
    onSave({ text: value, optionIndex: index })
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
            />
            {option === 'Other' && <input placeholder="First Name" />}
          </Form.Field>
        )
      })}
    </>
  )
}

export default ApplicationView
