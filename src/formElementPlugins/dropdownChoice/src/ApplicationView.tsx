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

  const [selectedIndex, setSelectedIndex] = useState<any>()
  const [localOptions, setLocalOptions] = useState<any[]>([])
  //saving selected value in local state, so that when options are re rendered, we retain this value
  const [selectedValue, setSelectedValue] = useState<any[]>()

  const { isEditable } = element

  useEffect (() => {
    console.log(options)
    const optionsMapped = options.map((option: any, index: number) => {
      return {
        key: `${index}_${option}`,
        text: optionsDisplayProperty ? option[optionsDisplayProperty] : option,
        value: index,
      }
    })
    setLocalOptions(optionsMapped)
    if (selectedIndex && selectedIndex > localOptions.length) {
      addItemHandler(selectedIndex, selectedValue)
    }
  }, [options])

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
    console.log('data is', data)
    const  newOption  = data
    const index = localOptions.length
    const newOptionList : any = [...localOptions, {
      key: `${index}_${{newOption}}`,
      text: newOption,
      value: index
    }]
    setLocalOptions(newOptionList)
    setSelectedIndex(index)
  }

  function handleChange(_: any, data: any) {
      const { value: optionIndex } = data
      const {options: array} = data
        setSelectedIndex(optionIndex === '' ? undefined : optionIndex)
        setSelectedValue(optionIndex === '' ? undefined : options[optionIndex])
        if (optionIndex !== '') {
        console.log('option Index is: ',optionIndex)
        console.log('optionDisplayProperty is: ', optionsDisplayProperty)
        console.log('local options are:', localOptions)
          onSave({
            text: (optionsDisplayProperty != undefined && optionsDisplayProperty)
              ? localOptions[optionIndex][optionsDisplayProperty]
              : localOptions[optionIndex],
            selection: localOptions[optionIndex],
            optionIndex,
          })
        }
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
        onAddItem={(e, data)=>addItemHandler(e, data.value)}
        placeholder={placeholder}
        options={localOptions}
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
