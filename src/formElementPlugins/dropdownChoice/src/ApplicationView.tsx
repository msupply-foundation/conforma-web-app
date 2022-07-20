import React, { useEffect, useState } from 'react'
import { Dropdown, Label } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'

const ApplicationView: React.FC<ApplicationViewProps> = ({
  element,
  parameters,
  onUpdate,
  currentResponse,
  // value,
  // setValue,
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
  const [additionalItem, setAdditionalItem] = useState<any|null>(null)
  const { isEditable } = element

  useEffect(() => {
    // This ensures that, if a default is specified, it gets saved on first load
    if (!currentResponse?.text && defaultOption !== undefined) {
      const optionIndex = getDefaultIndex(defaultOption, options)
      onSave({
        text: optionsDisplayProperty
          ? options[optionIndex][optionsDisplayProperty]
          : options[optionIndex],
        selection: options[optionIndex],
        optionIndex,
      })
      setSelectedIndex(optionIndex)
    }
    if (currentResponse?.text) {
      const { optionIndex } = currentResponse
      setSelectedIndex(optionIndex)
    }
  }, [])

  function handleChange(e: any, data: any) {
    const { value: optionIndex } = data
    setSelectedIndex(optionIndex === '' ? undefined : optionIndex)
    if (optionIndex !== '')
      onSave({
        text: optionsDisplayProperty
          ? options[optionIndex][optionsDisplayProperty]
          : options[optionIndex],
        selection: options[optionIndex],
        optionIndex,
      })
    // Reset response if selection cleared
    else onSave(null)
  }

  var currentOptions = [...options]
  if (additionalItem) {
    currentOptions = [...options, additionalItem]
    console.log(currentOptions)
  }

  const dropdownOptions = currentOptions.map((option: any, index: number) => {
    return {
      key: `${index}_${option}`,
      text: optionsDisplayProperty ? option[optionsDisplayProperty] : option,
      value: index,
    }
  })

  

  return (
    <>
      {label && (
        <label>
          <Markdown text={label} semanticComponent="noParagraph" />
        </label>
      )}
      <Markdown text={description} />
      <Dropdown
        fluid
        //multiple
        onAddItem={additionalItem}
        selection
        clearable
        search={search}
        allowAdditions
        OnAddItem={({value}) => setAdditionalItem()}
        placeholder={placeholder}
        options={dropdownOptions}
        onChange={handleChange}
        value={selectedIndex}
        error={!validationState.isValid ? true : undefined}
      />
      {validationState.isValid ? null : (
        <Label pointing prompt content={validationState?.validationMessage} />
      )}
    </>
  )
}

export default ApplicationView
