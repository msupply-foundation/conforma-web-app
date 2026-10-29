import { AiFillMethods, AiFillParameters } from '../../types'
import type { Checkbox } from './ApplicationView'
import { KeyMap, createTextStrings, getCheckboxStructure } from './helpers'

interface CheckboxParameters {
  checkboxes?: unknown
  keyMap?: KeyMap
  hasOther?: boolean
  otherLabel?: string
  preventNonResponse?: boolean
}

// Checkbox labels as getCheckboxStructure reads them, including a keyMap's
// label property; undefined if they can't all be shown as text. The "other"
// checkbox isn't offered, as its answer is text the applicant types in.
const getLabels = (parameters: AiFillParameters) => {
  const { checkboxes, keyMap } = parameters as CheckboxParameters
  if (!Array.isArray(checkboxes)) return undefined
  const labelProperty = keyMap?.label ?? 'label'
  const labels = checkboxes.map((checkbox) =>
    typeof checkbox === 'string' || typeof checkbox === 'number'
      ? String(checkbox)
      : checkbox?.[labelProperty]
  )
  return labels.every((label) => typeof label === 'string') ? (labels as string[]) : undefined
}

const describe = (parameters: AiFillParameters) => {
  const options = getLabels(parameters)
  return options ? { options } : undefined
}

// As the checkboxes save their state, with exactly the chosen ones ticked
const fromPlainValue: AiFillMethods['fromPlainValue'] = (value, parameters, { t }) => {
  const {
    checkboxes,
    keyMap,
    hasOther = false,
    otherLabel = t('LABEL_OTHER'),
    preventNonResponse = false,
  } = parameters as CheckboxParameters
  if (!getLabels(parameters)) return undefined

  const chosen = Array.isArray(value) ? value : [String(value)]
  const checkboxElements: Checkbox[] = getCheckboxStructure(
    null,
    undefined,
    checkboxes as Checkbox[],
    keyMap,
    false,
    hasOther,
    otherLabel
  ).map((checkbox) => ({
    ...checkbox,
    selected: checkbox.key !== 'other' && chosen.includes(checkbox.label),
  }))
  if (preventNonResponse && checkboxElements.every(({ selected }) => !selected)) return undefined

  return {
    ...createTextStrings(checkboxElements, t('LABEL_SUMMARY_NOTHING_SELECTED')),
    values: Object.fromEntries(checkboxElements.map((checkbox) => [checkbox.key, checkbox])),
    selectedValuesArray: checkboxElements.filter(({ selected }) => selected),
    unselectedValuesArray: checkboxElements.filter(({ selected }) => !selected),
  }
}

export const aiFill: AiFillMethods = { describe, fromPlainValue }
