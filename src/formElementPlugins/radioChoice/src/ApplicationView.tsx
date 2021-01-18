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
  const { label, description, options, default: defaultOption } = parameters

  useEffect(() => {
    onUpdate(value)
    if (!value && defaultOption !== undefined)
      onSave({ text: value, optionIndex: options.indexOf(value) })
    setValue(options?.[getDefaultIndex(defaultOption, options)])
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
      {options.map((option: any, index: number) => {
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
          </Form.Field>
        )
      })}
    </>
  )
}

export default ApplicationView
