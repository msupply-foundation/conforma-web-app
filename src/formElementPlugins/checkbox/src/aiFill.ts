import { AiFillChoices, AiFillMethods } from '../../types'

// Checkbox labels as getCheckboxStructure (ApplicationView.tsx) reads them,
// including a keyMap's label property. The "other" checkbox isn't offered, as
// its answer is text the applicant types in.
const getChoices = (parameters: Record<string, unknown>): AiFillChoices | undefined => {
  const { checkboxes, keyMap } = parameters as {
    checkboxes?: unknown
    keyMap?: { label?: string }
  }
  if (!Array.isArray(checkboxes)) return undefined
  const labelProperty = keyMap?.label ?? 'label'
  const labels = checkboxes.map((checkbox) =>
    typeof checkbox === 'string' || typeof checkbox === 'number'
      ? String(checkbox)
      : checkbox?.[labelProperty]
  )
  if (!labels.every((label) => typeof label === 'string')) return undefined
  return { options: labels }
}

export const aiFill: AiFillMethods = { getChoices }
