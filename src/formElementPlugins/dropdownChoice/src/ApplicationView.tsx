import React, { useEffect, useState } from 'react'
import { Dropdown, Label } from 'semantic-ui-react'
import consolidatorResponseFragment from '../../../utils/graphql/fragments/consolidatorResponse.fragment'
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
    hasOther,
    default: defaultOption,
  } = parameters

  const [selectedIndex, setSelectedIndex] = useState<number>()

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

  const addItemHandler = (e: any, data: any) => {
    const { value: newOption } = data
    console.log(dropdownOptions)
    const index = dropdownOptions.length
    console.log(newOption)
    dropdownOptions.push({
      key: `${index}_${{newOption}}`,
      text: newOption,
      value: index,
    })
    console.log(dropdownOptions)
  }

  const dropdownOptions = options.map((option: any, index: number) => {
    //console.log(option)
    return {
      key: `${index}_${option}`,
      text: optionsDisplayProperty ? option[optionsDisplayProperty] : option,
      value: index,
    }
  })

  function handleChange(e: any, data: any) {
    const { value: optionIndex } = data
    setSelectedIndex(optionIndex === '' ? undefined : optionIndex)
    if (optionIndex !== '')
      onSave({
        text: (optionsDisplayProperty != undefined && optionsDisplayProperty)
          ? options[optionIndex][optionsDisplayProperty]
          : dropdownOptions[optionIndex],
        selection: dropdownOptions[optionIndex],
        optionIndex,
      })
    // Reset response if selection cleared
    else onSave(null)
  }





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
        // onAddItem={additionalItem}
        selection
        clearable
        search={search || hasOther}
        allowAdditions
        onAddItem={addItemHandler}
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
