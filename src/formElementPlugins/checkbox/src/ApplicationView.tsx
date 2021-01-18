import React, { useEffect } from 'react'
import { Checkbox, Form } from 'semantic-ui-react'
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
  const { label, description, options, selected, type } = parameters

  useEffect(() => {
    onUpdate(value)
    if (!value && selected.length !== 0) {
      // onSave({ text: value, optionIndex: options.indexOf(value) })
      setValue(createInitialValueObject(options, selected || []))
    }
  }, [])

  function handleChange(e: any, data: any) {
    const { checked, index } = data
    console.log('Data', data)
    const newValue = { ...value } || {}
    newValue[index] = value
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
          // <Form.Field key={`${index}_${option}`} disabled={!isEditable}>
          <Checkbox
            key={`${index}_${option}`}
            label={option}
            // name={`${code}_radio_${index}`} // This is GROUP name
            // value={option}
            checked={false}
            // checked={option === value[index]?.selected}
            onChange={handleChange}
            index={index}
            disabled={!isEditable}
            toggle={type}
            slider={type}
          />
          // </Form.Field>
        )
      })}
    </>
  )
}

export default ApplicationView

const createInitialValueObject = (options: string[], selected: number[]) => {
  const initialValue: any = {}
  options.forEach((option, index) => {
    initialValue[index] = { text: option, selected: index in selected }
  })
  console.log('initialValue', initialValue)
  return initialValue
}
