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
    hasOther,
    default: defaultOption,
  } = parameters

  const [selectedIndex, setSelectedIndex] = useState<number>()
  //saving selected value in local state, so that when options are re rendered, we retain this value
  const [addedOptions, setAddedOptions] = useState<Array<{}>>([])

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
    if (currentResponse?.text && currentResponse.optionIndex && currentResponse.optionIndex>options.length) {
      addItemHandler(_, currentResponse.text)
      return
    }
    if (currentResponse?.text) {
      const { optionIndex } = currentResponse
      setSelectedIndex(optionIndex)
    }
    
  }, [])


  //addItemHandler is called when new data is entered. This in turn calls original hook to re-render displayed options
  const addItemHandler = (e: any, data: string) => {
    const  newOptionText  = data
    const index = dropDownOptions[0].text !== undefined? dropDownOptions.length : currentResponse.optionIndex
    const newOption = {
      [optionsDisplayProperty]: newOptionText,
    }
    const newAddedOptions : any = [...addedOptions, newOption]
    setAddedOptions(newAddedOptions)
    setSelectedIndex(index)
  }

  function handleChange(_: any, data: any) {
      var { value: optionIndex } = data
      //If condition saves appropriate value if new value is entered by user
        if (typeof(optionIndex) === 'string') {
          const optionIndexForNewValues = dropDownOptions.length
          onSave({
            text: optionIndex,
            selection: {
              key: `${optionIndexForNewValues}_${optionIndex}`,
              text: optionIndex,
              value: optionIndexForNewValues,
            },
            optionIndex: optionIndexForNewValues,
          })
          return
        }
        setSelectedIndex(optionIndex === '' ? undefined : optionIndex)
        if (optionIndex !== '') {
          onSave({
            text: (optionsDisplayProperty[optionIndex][optionsDisplayProperty] !== undefined && optionsDisplayProperty)
              ? dropDownOptions[optionIndex][optionsDisplayProperty]
              : dropDownOptions[optionIndex]['text'],
            selection: dropDownOptions[optionIndex],
            optionIndex,
          })
        }
        // Reset response if selection cleared
        else onSave(null)
  }

  const combinedOptions = addedOptions? [...options, ...addedOptions] : options
  const dropDownOptions = combinedOptions.map((option: any, index: number) => {
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
        onAddItem={(e, data)=>addItemHandler(e, data.value as string)}
        placeholder={placeholder}
        options={dropDownOptions}
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
