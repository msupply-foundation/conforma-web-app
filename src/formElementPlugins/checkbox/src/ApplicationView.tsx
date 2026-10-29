import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Form, Input, Label } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import config from '../pluginConfig.json'
import { createTextStrings, getCheckboxStructure } from './helpers'

export interface Checkbox {
  label: string
  text: string
  textNegative?: string
  key: string | number
  selected: boolean
}

export interface CheckboxSavedState {
  text: string
  values: { [key: string]: Checkbox }
}

export const CheckboxDisplay: React.FC<{
  checkboxes: Checkbox[]
  disabled: boolean
  type: string
  layout: string
  onChange: (e: any, data: any) => void
  onOtherChange: (value: string) => void
  otherPlaceholder?: string
}> = ({ checkboxes, disabled, type, layout, onChange, onOtherChange, otherPlaceholder }) => {
  const [otherText, setOtherText] = useState(
    checkboxes.length >= 1 ? checkboxes[checkboxes.length - 1].text : ''
  )
  const styles =
    layout === 'inline'
      ? {
          display: 'inline',
          marginRight: 10,
        }
      : {}

  return (
    <>
      {checkboxes.map((cb: Checkbox, index: number) => (
        <Form.Field key={`${index}_${cb.label}`} disabled={disabled} style={styles}>
          <Checkbox
            label={cb.label}
            checked={cb.selected}
            onChange={onChange}
            index={index}
            toggle={type === 'toggle'}
            slider={type === 'slider'}
          />
          {cb.key === 'other' && (
            <Input
              placeholder={otherPlaceholder}
              disabled={!cb.selected}
              onBlur={(e: any) => onOtherChange(e.target.value)}
              onChange={(e) => setOtherText(e.target.value)}
              value={otherText}
              style={{ width: 'auto', marginLeft: 10 }}
            />
          )}
        </Form.Field>
      ))}
    </>
  )
}

const ApplicationView: React.FC<ApplicationViewProps> = ({
  element,
  parameters,
  onSave,
  Markdown,
  currentResponse,
  validationState,
}) => {
  const { getPluginTranslator } = useLanguageProvider()
  const t = getPluginTranslator('checkbox')
  const { isEditable } = element
  const {
    label,
    description,
    checkboxes = [],
    type,
    layout,
    resetButton = false,
    keyMap,
    preventNonResponse = false,
    hasOther = false,
    default: defaultValue,
    otherLabel = t('LABEL_OTHER'),
    otherPlaceholder = t('PLACEHOLDER_OTHER'),
  } = parameters

  const [isFirstRender, setIsFirstRender] = useState(true)

  const [checkboxElements, setCheckboxElements] = useState<Checkbox[]>(
    getCheckboxStructure(
      currentResponse,
      defaultValue,
      checkboxes,
      keyMap,
      isFirstRender,
      hasOther,
      otherLabel
    )
  )

  // When checkbox array changes after initial load (e.g. when its being dynamically loaded from an API)
  useEffect(() => {
    if (checkboxes[0] !== config.parameterLoadingValues.label && isFirstRender)
      setIsFirstRender(false)
    setCheckboxElements(
      getCheckboxStructure(
        currentResponse,
        defaultValue,
        checkboxes,
        keyMap,
        isFirstRender,
        hasOther,
        otherLabel
      )
    )
  }, [checkboxes, defaultValue])

  useEffect(() => {
    // Don't save response if parameters are still loading
    if (checkboxElements[0]?.text === config.parameterLoadingValues.label) return
    // Don't save proper response "preventNonResponse" active, but still need to save a `null` response -- this prevents the case where a user checks then unchecks the box and tries to submit: they'd think they hadn't checked the box but it would have sent the checked version through, which could be misleading in cases like declarations.
    if (preventNonResponse && checkboxElements.every((elem) => !elem.selected)) {
      onSave(null)
      return
    }

    const {
      text,
      textUnselected,
      textMarkdownList,
      textUnselectedMarkdownList,
      textMarkdownPropertyList,
    } = createTextStrings(checkboxElements, t('LABEL_SUMMARY_NOTHING_SELECTED'))
    onSave({
      text,
      textUnselected,
      textMarkdownList,
      textUnselectedMarkdownList,
      textMarkdownPropertyList,
      values: Object.fromEntries(
        checkboxElements.map((cb) => [
          cb.key,
          { ...cb, text: cb.text, textNegative: cb.textNegative, selected: cb.selected },
        ])
      ),
      selectedValuesArray: checkboxElements.filter((cb) => cb.selected),
      unselectedValuesArray: checkboxElements.filter((cb) => !cb.selected),
    })
  }, [checkboxElements])

  const toggle = (_: any, data: any) => {
    const { index } = data
    const changedCheckbox = { ...checkboxElements[index] }
    changedCheckbox.selected = !changedCheckbox.selected
    setCheckboxElements(checkboxElements.map((cb, i) => (i === index ? changedCheckbox : cb)))
  }

  const handleOtherChange = (value: string) => {
    const checkboxes = [...checkboxElements]
    checkboxes[checkboxes.length - 1].text = value
    setCheckboxElements([...checkboxes])
  }

  const resetState = () =>
    setCheckboxElements(
      getCheckboxStructure(
        currentResponse,
        defaultValue,
        checkboxes,
        keyMap,
        isFirstRender,
        hasOther,
        otherLabel
      )
    )

  return (
    <>
      {label && (
        <label>
          <Markdown text={label} semanticComponent="noParagraph" />
        </label>
      )}
      <Markdown text={description} />
      <CheckboxDisplay
        checkboxes={checkboxElements}
        disabled={!isEditable}
        type={type}
        layout={layout}
        onChange={toggle}
        onOtherChange={handleOtherChange}
        otherPlaceholder={otherPlaceholder}
      />
      {resetButton && (
        <div style={{ marginTop: 10 }}>
          <Button primary content={t('BUTTON_RESET_SELECTION')} compact onClick={resetState} />
        </div>
      )}
      {validationState.isValid ? null : (
        <Label pointing prompt content={validationState?.validationMessage} />
      )}
    </>
  )
}

export default ApplicationView
