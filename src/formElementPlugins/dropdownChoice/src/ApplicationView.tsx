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
  const [localOptions, setLocalOptions] = useState<any[]>([])
  //saving selected value in local state, so that when options are re rendered, we retain this value
  const [addedOptions, setAddedOptions] = useState<any[]>([])

  const { isEditable } = element

  useEffect (() => {
    const optionsMapped = options.map((option: any, index: number) => {
      return {
        key: `${index}_${option}`,
        text: optionsDisplayProperty ? option[optionsDisplayProperty] : option,
        value: index,
      }
    })
    if (addedOptions && addedOptions.length > 0) {
      const newOptionList = [...optionsMapped, ...addedOptions]
      setLocalOptions(newOptionList)
    } else {
      setLocalOptions(optionsMapped)
    }
  }, [options, addedOptions])

  useEffect(() => {
    // This ensures that, if a default is specified, it gets saved on first load
    if (!currentResponse?.text && defaultOption !== undefined) {
      const optionValue = getDefaultIndex(defaultOption, options)
      onSave({
        text: optionsDisplayProperty
          ? options[optionValue][optionsDisplayProperty]
          : options[optionValue],
        selection: options[optionValue],
        optionValue,
      })
      setSelectedIndex(optionValue)
    }
  }, [])

  //addItemHandler is called when new data is entered. This in turn calls original hook to re-render displayed options
  const addItemHandler = (e: any, data: any) => {
    const  newOption  = data
    const index = localOptions.length
    const newAddedOptions : any = [...addedOptions, {
      key: `${index}_${{newOption}}`,
      text: newOption,
      value: index
    }]
    setAddedOptions(newAddedOptions)
    setSelectedIndex(index)
  }

  function handleChange(_: any, data: any) {
      var { value: optionValue } = data
      //If condition saves appropriate value if new value is entered by user
        if (typeof(optionValue) === 'string') {
          const optionIndex = localOptions.length
          onSave({
            text: optionValue,
            selection: {
              key: `${optionIndex}_${optionValue}`,
              text: optionValue,
              value: optionIndex,
            },
            optionIndex,
          })
          return
        }
        setSelectedIndex(optionValue === '' ? undefined : optionValue)
        if (optionValue !== '') {
          onSave({
            text: (optionsDisplayProperty != undefined && optionsDisplayProperty)
              ? localOptions[optionValue][optionsDisplayProperty]
              : localOptions[optionValue],
            selection: localOptions[optionValue],
            optionValue,
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
