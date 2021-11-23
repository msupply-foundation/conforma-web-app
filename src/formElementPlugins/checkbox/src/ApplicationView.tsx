import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Form } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import config from '../pluginConfig.json'

interface Checkbox {
  label: string
  text: string
  textNegative?: string
  key: string | number
  selected: boolean
}

interface CheckboxSavedState {
  text: string
  values: { [key: string]: Checkbox }
}

const ApplicationView: React.FC<ApplicationViewProps> = ({
  element,
  parameters,
  onSave,
  Markdown,
  initialValue,
}) => {
  const { getPluginStrings } = useLanguageProvider()
  const strings = getPluginStrings('checkbox')
  const { isEditable } = element
  const { label, description, checkboxes, type, layout, resetButton = false, keyMap } = parameters

  const [checkboxElements, setCheckboxElements] = useState<Checkbox[]>(
    getInitialState(initialValue, checkboxes, keyMap)
  )
  const [initialState, setInitialState] = useState<Checkbox[]>()

  // When checkbox array changes after initial load (e.g. when its being dynamically loaded from an API)
  useEffect(() => {
    const initState = getInitialState(initialValue, checkboxes, keyMap)
    setCheckboxElements(initState)
    setInitialState(initState)
  }, [checkboxes])

  useEffect(() => {
    // Don't save response if parameters are still loading
    if (checkboxElements[0].text === config.parameterLoadingValues.label) return
    onSave({
      text: createTextString(checkboxElements),
      values: Object.fromEntries(
        checkboxElements.map((cb) => [
          cb.key,
          { text: cb.text, textNegative: cb.textNegative, selected: cb.selected },
        ])
      ),
      selectedValuesArray: checkboxElements.filter((cb) => cb.selected),
    })
  }, [checkboxElements])

  const createTextString = (checkboxes: Checkbox[]) =>
    checkboxes
      .reduce((output, cb) => {
        const text = cb.selected ? cb.text : cb.textNegative
        return output + (output === '' ? text : ', ' + text)
      }, '')
      .replace(/^$/, `*<${strings.LABEL_SUMMMARY_NOTHING_SELECTED}>*`)

  const toggle = (e: any, data: any) => {
    const { index } = data
    const changedCheckbox = { ...checkboxElements[index] }
    changedCheckbox.selected = !changedCheckbox.selected
    setCheckboxElements(checkboxElements.map((cb, i) => (i === index ? changedCheckbox : cb)))
  }

  const resetState = () => setCheckboxElements(initialState as Checkbox[])

  const styles =
    layout === 'inline'
      ? {
          display: 'inline',
          marginRight: 10,
        }
      : {}

  return (
    <>
      <label>
        <Markdown text={label} semanticComponent="noParagraph" />
      </label>
      <Markdown text={description} />
      {checkboxElements.map((cb: Checkbox, index: number) => (
        <Form.Field key={`${index}_${cb.label}`} disabled={!isEditable} style={styles}>
          <Checkbox
            label={cb.label}
            checked={cb.selected}
            onChange={toggle}
            index={index}
            toggle={type === 'toggle'}
            slider={type === 'slider'}
          />
        </Form.Field>
      ))}
      {resetButton && (
        <div style={{ marginTop: 10 }}>
          <Button primary content={strings.BUTTON_RESET_SELECTION} compact onClick={resetState} />
        </div>
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

const getInitialState = (
  initialValue: CheckboxSavedState,
  checkboxes: Checkbox[],
  keyMap: KeyMap | undefined
) => {
  // Returns a consistent array of Checkbox objects, regardless of input structure
  const { values: initValues } = initialValue
  const checkboxPropertyNames = {
    label: keyMap?.label ?? 'label',
    text: keyMap?.text ?? 'text',
    textNegative: keyMap?.textNegative ?? 'textNegative',
    key: keyMap?.key ?? 'key',
    selected: keyMap?.selected ?? 'selected',
  }
  return (
    checkboxes
      .map((cb: any, index: number) => {
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
            label: cb?.[checkboxPropertyNames.label],
            text: cb?.[checkboxPropertyNames.text] || cb?.[checkboxPropertyNames.label],
            textNegative: cb?.[checkboxPropertyNames.textNegative] || '',
            key: cb?.[checkboxPropertyNames.key] || index,
            selected: cb?.[checkboxPropertyNames.selected] || false,
          }
      })
      // Replaces with any already-selected values from database
      .map((cb) => ({
        ...cb,
        selected: initValues?.[cb.key] ? initValues[cb.key].selected : cb.selected,
      }))
  )
}
