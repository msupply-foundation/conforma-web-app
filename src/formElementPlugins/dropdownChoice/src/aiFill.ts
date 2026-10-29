import { AiFillMethods, AiFillParameters } from '../../types'
import { substituteValues } from '../../../utils/helpers/utilityFunctions'

// Option labels as the dropdown displays them; undefined if they can't all be
// shown as text. An "other" answer the applicant types in isn't offered.
const getLabels = ({
  options,
  optionsDisplayProperty,
  optionsDisplayExpression,
}: AiFillParameters): string[] | undefined => {
  if (!Array.isArray(options)) return undefined
  const labels = options.map((option) => {
    if (typeof option === 'string') return option
    if (typeof optionsDisplayExpression === 'string')
      return substituteValues(optionsDisplayExpression, option)
    if (typeof optionsDisplayProperty === 'string') return option?.[optionsDisplayProperty]
    return undefined
  })
  return labels.every((label) => typeof label === 'string') ? labels : undefined
}

const describe = (parameters: AiFillParameters) => {
  const options = getLabels(parameters)
  return options ? { options, multiSelect: parameters.multiSelect === true } : undefined
}

// As the dropdown saves a selection of its options
const fromPlainValue: AiFillMethods['fromPlainValue'] = (value, parameters) => {
  const { options } = parameters
  const labels = getLabels(parameters)
  if (!labels || !Array.isArray(options)) return undefined

  if (parameters.multiSelect === true) {
    const chosen = Array.isArray(value) ? value : [String(value)]
    const indexes = labels.flatMap((label, index) => (chosen.includes(label) ? [index] : []))
    if (indexes.length === 0) return undefined
    return {
      optionIndex: indexes,
      text: indexes.map((index) => labels[index]).join(', '),
      selection: indexes.map((index) => options[index]),
      isCustomOption: false,
    }
  }

  const index = typeof value === 'string' ? labels.indexOf(value) : -1
  if (index === -1) return undefined
  return {
    text: labels[index],
    selection: options[index],
    optionIndex: index,
    isCustomOption: false,
  }
}

export const aiFill: AiFillMethods = { describe, fromPlainValue }
