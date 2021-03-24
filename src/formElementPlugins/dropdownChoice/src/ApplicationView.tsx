import React, { useEffect, useState } from 'react'
import { Dropdown, Header, Label } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'

const ApplicationView: React.FC<ApplicationViewProps> = ({
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
    placeholder,
    search,
    options,
    optionsDisplayProperty,
    default: defaultOption,
  } = parameters

  const [selectedIndex, setSelectedIndex] = useState<number>()

  useEffect(() => {
    onUpdate(currentResponse)
    if (!currentResponse && defaultOption !== undefined) {
      const optionIndex = getDefaultIndex(defaultOption, options)
      onSave({
        text: optionsDisplayProperty
          ? options[optionIndex][optionsDisplayProperty]
          : options[optionIndex],
        selection: options[optionIndex],
        optionIndex,
      })
    }
    if (currentResponse) {
      const { optionIndex } = currentResponse
      setSelectedIndex(optionIndex)
    }
  }, [])

  function handleChange(e: any, data: any) {
    const { value: optionIndex } = data
    setSelectedIndex(optionIndex)
    onSave({
      text: optionsDisplayProperty
        ? options[optionIndex][optionsDisplayProperty]
        : options[optionIndex],
      selection: options[optionIndex],
      optionIndex,
    })
  }

  const dropdownOptions = options.map((option: any, index: number) => {
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
      <Dropdown
        fluid
        selection
        search={search}
        placeholder={placeholder}
        options={dropdownOptions}
        onChange={handleChange}
        value={selectedIndex}
        disabled={!isEditable}
        error={!validationState.isValid ? true : undefined}
      />
      {validationState.isValid ? null : (
        <Label basic color="red" pointing>
          {validationState?.validationMessage}
        </Label>
      )}
    </>
  )
}

export default ApplicationView
