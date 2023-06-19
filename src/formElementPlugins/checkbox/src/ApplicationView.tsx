import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Form, Input, Label } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import config from '../pluginConfig.json'
import useDefault from '../../useDefault'

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
}> = ({ checkboxes, disabled, type, layout, onChange, onOtherChange }) => {
  const [otherText, setOtherText] = useState(checkboxes[checkboxes.length - 1].text)
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
          {cb.key === 'other' && cb.selected && (
            <Input
              size="mini"
              onBlur={(e: any) => onOtherChange(e.target.value)}
              onChange={(e) => setOtherText(e.target.value)}
              value={otherText}
              style={{ maxWidth: 250, maxHeight: 20 }}
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
    checkboxes,
    type,
    layout,
    resetButton = false,
    keyMap,
    preventNonResponse = false,
    hasOther = false,
    default: defaultValue,
    otherLabel = 'Other',
  } = parameters

  const [isFirstRender, setIsFirstRender] = useState(true)

  const [checkboxElements, setCheckboxElements] = useState<Checkbox[]>(
    getCheckboxStructure(currentResponse, checkboxes, keyMap, isFirstRender, hasOther)
  )

  useDefault({
    defaultValue,
    currentResponse,
    parameters,
    onChange: (value) => {
      if (typeof value !== 'string') {
        setCheckboxElements(
          getCheckboxStructure(currentResponse, checkboxes, keyMap, isFirstRender, hasOther)
        )
        // Assume it's a response shape
      } else {
        // Break down string text
        const textValues = value.split(',').map((e) => e.trim())
        console.log(textValues)
        setCheckboxElements(
          checkboxElements.map((cb) =>
            textValues.includes(cb.text) ? { ...cb, selected: true } : { ...cb, selected: false }
          )
        )
      }
    },
    additionalDependencies: [checkboxes],
  })

  // When checkbox array changes after initial load (e.g. when its being dynamically loaded from an API)
  // useEffect(() => {
  //   if (checkboxes[0] !== config.parameterLoadingValues.label && isFirstRender)
  //     setIsFirstRender(false)
  //   setCheckboxElements(
  //     getCheckboxStructure(currentResponse, checkboxes, keyMap, isFirstRender, hasOther)
  //   )
  // }, [checkboxes])

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
    } = createTextStrings(checkboxElements, t('LABEL_SUMMMARY_NOTHING_SELECTED'))
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

  const toggle = (e: any, data: any) => {
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
      getCheckboxStructure(currentResponse, checkboxes, keyMap, isFirstRender, hasOther)
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

type KeyMap = {
  label?: string
  text?: string
  textNegative?: string
  key?: string
  selected?: string
}

export const getCheckboxStructure = (
  initialValue: CheckboxSavedState | null,
  checkboxes: Checkbox[],
  keyMap: KeyMap | undefined,
  isFirstRender: boolean,
  hasOther: boolean,
  otherLabel?: string
) => {
  // Returns a consistent array of Checkbox objects, regardless of input structure
  const { values: initValues } = initialValue ?? {}
  const checkboxPropertyNames = {
    label: keyMap?.label ?? 'label',
    text: keyMap?.text ?? 'text',
    textNegative: keyMap?.textNegative ?? 'textNegative',
    key: keyMap?.key ?? 'key',
    selected: keyMap?.selected ?? 'selected',
  }
  const checkboxElements = checkboxes.map((cb: any, index: number) => {
    if (typeof cb === 'string' || typeof cb === 'number')
      return {
        label: String(cb),
        text: String(cb),
        textNegative: '',
        key: index,
        selected: false,
      }
    else
      return {
        ...cb,
        label: cb?.[checkboxPropertyNames.label],
        text: cb?.[checkboxPropertyNames.text] || cb?.[checkboxPropertyNames.label],
        textNegative: cb?.[checkboxPropertyNames.textNegative] || '',
        key: cb?.[checkboxPropertyNames.key] || index,
        selected: cb?.[checkboxPropertyNames.selected] || false,
      }
  })

  if (hasOther)
    checkboxElements.push({
      label: otherLabel ?? 'Other',
      text: initValues ? initValues.other.text : '',
      textNegative: '',
      key: 'other',
      selected: false,
    })

  // On first render, we set elements to the *saved* state, but after that we
  // replace them with the new, changed checkbox values
  return isFirstRender
    ? checkboxElements.map((cb) => ({
        ...cb,
        selected: initValues?.[cb.key] ? initValues[cb.key].selected : cb.selected,
      }))
    : checkboxElements
}

const createTextStrings = (checkboxes: Checkbox[], nothingSelectedText: string) => {
  let text = ''
  let textUnselected = ''
  let textMarkdownList = ''
  let textUnselectedMarkdownList = ''
  let textMarkdownPropertyList = ''
  checkboxes.forEach((cb) => {
    textMarkdownPropertyList =
      textMarkdownPropertyList + `- ${cb.label}: ${cb.selected ? cb.text : cb.textNegative}\n`
    if (cb.selected) {
      text = text === '' ? cb.text : `${text}, ${cb.text}`
      textMarkdownList = textMarkdownList + `- ${cb.text}\n`
    } else {
      textUnselected = textUnselected === '' ? cb.text : `${textUnselected}, ${cb.text}`
      textUnselectedMarkdownList = textUnselectedMarkdownList + `- ${cb.text}\n`
      if (cb.textNegative) {
        text = text === '' ? cb.textNegative : `${text}, ${cb.textNegative}`
        textMarkdownList = textMarkdownList + `- ${cb.textNegative}\n`
      }
    }
  })
  if (text === '') text = `*${nothingSelectedText}*`
  if (textMarkdownList === '') textMarkdownList = `- *${nothingSelectedText}*\n`
  return {
    text,
    textUnselected,
    textMarkdownList,
    textUnselectedMarkdownList,
    textMarkdownPropertyList,
  }
}
