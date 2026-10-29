import { AiFillMethods, AiFillParameters } from '../../types'

// Option labels as the radio buttons display them; undefined if they can't all
// be shown as text. The "other" option isn't offered, as its answer is text
// the applicant types in.
const getLabels = ({ options, optionsDisplayProperty }: AiFillParameters) => {
  if (!Array.isArray(options)) return undefined
  const labels = options.map((option) =>
    typeof optionsDisplayProperty === 'string' && typeof option === 'object'
      ? option?.[optionsDisplayProperty]
      : option
  )
  return labels.every((label) => typeof label === 'string') ? (labels as string[]) : undefined
}

const describe = (parameters: AiFillParameters) => {
  const options = getLabels(parameters)
  return options ? { options } : undefined
}

// As the radio buttons save a chosen option (never "other")
const fromPlainValue: AiFillMethods['fromPlainValue'] = (value, parameters) => {
  const { options } = parameters
  const labels = getLabels(parameters)
  if (!labels || !Array.isArray(options)) return undefined

  const index = typeof value === 'string' ? labels.indexOf(value) : -1
  if (index === -1) return undefined
  return { text: labels[index], selection: options[index], optionIndex: index, other: false }
}

export const aiFill: AiFillMethods = { describe, fromPlainValue }
