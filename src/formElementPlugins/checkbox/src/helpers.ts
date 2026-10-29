import type { Checkbox, CheckboxSavedState } from './ApplicationView'

export type KeyMap = {
  label?: string
  text?: string
  textNegative?: string
  key?: string
  selected?: string
}

export const getCheckboxStructure = (
  initialValue: CheckboxSavedState | null,
  defaultValue: { [key: string]: Checkbox } | Checkbox[] | string | string[] | undefined,
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
      label: otherLabel,
      text: initValues ? (initValues.other?.text ?? '') : '',
      textNegative: '',
      key: 'other',
      selected: false,
    })

  // On first render, we set elements to the *saved* state, but after that we
  // replace them with the new, changed checkbox values, or default values
  if (isFirstRender && initValues)
    return checkboxElements.map((cb) => ({
      ...cb,
      selected: initValues?.[cb.key] ? initValues[cb.key].selected : cb.selected,
    }))

  if (defaultValue) return standardiseDefault(defaultValue, checkboxElements, hasOther)

  return checkboxElements
}

const standardiseDefault = (
  defaultValue: string | string[] | { [key: string]: Checkbox } | Checkbox[],
  checkboxElements: Checkbox[],
  hasOther: boolean
): Checkbox[] => {
  if (
    typeof defaultValue === 'string' ||
    (Array.isArray(defaultValue) &&
      (defaultValue as string[]).every((val) => typeof val === 'string'))
  ) {
    // Convert delimited text string to selection values
    let textValues =
      typeof defaultValue === 'string'
        ? defaultValue.split(',').map((e) => e.trim())
        : (defaultValue as string[])
    const newCheckboxes = checkboxElements.map((cb) => {
      const newCheckbox = textValues.includes(cb.text)
        ? { ...cb, selected: true }
        : { ...cb, selected: false }
      textValues = textValues.filter((e) => e !== cb.text)
      return newCheckbox
    })
    if (hasOther && textValues.length > 0) {
      // Leftover textValues must be for the "Other" value
      newCheckboxes[newCheckboxes.length - 1].text = textValues[0]
      newCheckboxes[newCheckboxes.length - 1].selected = true
    }
    return newCheckboxes
  }

  if (!Array.isArray(defaultValue)) return Object.values(defaultValue)
  return defaultValue as Checkbox[]
}

export const createTextStrings = (checkboxes: Checkbox[], nothingSelectedText: string) => {
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
