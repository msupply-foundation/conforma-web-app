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
  const [additionalItem, setAdditionalItem] = useState<any|null>(null)
  const [currentOptions, setCurrentOptions] = useState<any>(options)
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
    // console.log(optionsDisplayProperty)
    // console.log(optionIndex)
    // console.log(options)
    setSelectedIndex(optionIndex === '' ? undefined : optionIndex)
    if (optionIndex !== '')
      onSave({
        text: (optionsDisplayProperty != undefined && optionsDisplayProperty)
          ? options[optionIndex][optionsDisplayProperty]
          : options[optionIndex],
        selection: options[optionIndex],
        optionIndex,
      })
    // Reset response if selection cleared
    else onSave(null)
  }



  const addItemHandler = (e: any, data: any) => {
    setCurrentOptions(options)
    console.log('here is the data',data)
    console.log('here are options', options)
    const { value: newOption } = data
    console.log(newOption)
    // options.push({
    //   name: newOption
    // })
    setCurrentOptions([...currentOptions, {name: newOption}])
    console.log('current options', currentOptions)
  }

  const dropdownOptions = options.map((option: any, index: number) => {
    //console.log(options)
    // console.log(optionsDisplayProperty)
    // console.log(option)
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
