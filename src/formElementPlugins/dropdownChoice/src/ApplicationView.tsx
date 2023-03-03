import React, { useState, useEffect } from 'react'
import { Dropdown, Label } from 'semantic-ui-react'
import { ResponseFull } from '../../../utils/types'
import { ApplicationViewProps } from '../../types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import useDefault from '../../useDefault'

type ObjectOption = { [key: string]: any }
type ObjectOptions = { options: ObjectOption[]; optionsDisplayProperty: string }
type StringOptions = { options: string[]; optionsDisplayProperty: never }

const ApplicationView: React.FC<ApplicationViewProps> = ({
  element,
  parameters,
  currentResponse,
  validationState,
  onSave,
  Markdown,
  getDefaultIndex,
}) => {
  const { getPluginStrings } = useLanguageProvider()
  const strings = getPluginStrings('dropdownChoice')
  const {
    label,
    description,
    placeholder,
    search,
    options,
    optionsDisplayProperty,
    hasOther,
    default: defaultValue,
  } = parameters as {
    label?: string
    description?: string
    placeholder?: string
    search?: boolean
    hasOther?: boolean
    default?: string | number
  } & (ObjectOptions | StringOptions)

  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
    currentResponse?.optionIndex ?? undefined
  )
  const [addedOption, setAddedOption] = useState<string | null>(null)

  const { isEditable, isRequired } = element

  useEffect(() => {
    // This deals with the case when a default response has been externally set
    // (e.g. by a ListBuilder) and only a selection (with no index) has been
    // provided.
    if (options[0] === 'Loading...') return
    if (currentResponse?.selection && currentResponse?.optionIndex === undefined) {
      setSelectedIndex(getDefaultIndex(currentResponse?.selection, options))
    }
  }, [options])

  useDefault({
    defaultValue,
    currentResponse,
    parameters,
    additionalDependencies: [options],
    onChange: (defaultOption: any) => {
      const optionIndex = getDefaultIndex(defaultOption, options)
      if (optionIndex === -1 && hasOther) addItemHandler(defaultOption)
      else handleChange(optionIndex)
    },
  })

  const addItemHandler = (text: string) => {
    setAddedOption(text)
    const newIndex = options.length
    setSelectedIndex(newIndex)
    handleChange(newIndex, text)
  }

  const handleChange = (value: number | string, addedText?: string) => {
    const optionIndex: number | string = value

    // optionIndex becomes an empty string when selection is cleared
    setSelectedIndex(typeof optionIndex === 'string' ? undefined : optionIndex)
    if (typeof optionIndex === 'number') {
      if (optionIndex === options.length)
        // Save custom-added option
        onSave({
          text: addedText,
          selection: addedText,
          optionIndex,
          isCustomOption: true,
        })
      // Save regular option
      else
        onSave({
          text:
            optionsDisplayProperty &&
            options[optionIndex] !== undefined &&
            typeof options[optionIndex] === 'object'
              ? (options[optionIndex] as ObjectOption)[optionsDisplayProperty]
              : options[optionIndex],
          selection: options[optionIndex],
          optionIndex,
          isCustomOption: false,
        })
    }
    // Reset response if selection cleared
    else if (optionIndex === '') {
      setAddedOption(null)
      onSave(null)
    }
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
        // multiple
        selection
        clearable={isEditable && !isRequired}
        disabled={!isEditable}
        search={search || hasOther}
        allowAdditions={hasOther}
        additionLabel={strings.ADD_CUSTOM_OPTION_LABEL}
        onAddItem={(e, data) => addItemHandler(data.value as string)}
        placeholder={placeholder}
        options={getDropdownOptions(
          options,
          currentResponse,
          addedOption,
          setAddedOption,
          optionsDisplayProperty
        )}
        onChange={(e, data) => handleChange(data.value as string | number)}
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

const getDropdownOptions = (
  options: (ObjectOption | string)[],
  currentResponse: ResponseFull | null,
  addedOption: string | null,
  setAddedOption: (value: string) => void,
  displayProperty?: string
) => {
  // Figure out if the currentResponse contains an added custom response. This
  // is just for initial loading if we've had to wait for the list of options to
  // populate
  const initialCustomResponse =
    !addedOption &&
    currentResponse?.optionIndex === options.length &&
    typeof currentResponse.selection === 'string'
      ? currentResponse.selection
      : null

  if (initialCustomResponse) setAddedOption(initialCustomResponse)

  const dropdownOptions = options.map((option, index) => ({
    key: `${index}_${option}`,
    text: displayProperty && typeof option !== 'string' ? option[displayProperty] : option,
    value: index,
  }))
  if (initialCustomResponse || addedOption)
    dropdownOptions.push({
      key: `${options.length}_${initialCustomResponse || addedOption}`,
      text: initialCustomResponse || addedOption,
      value: options.length,
    })
  return dropdownOptions
}
