import { AiFillChoices, AiFillMethods } from '../../types'
import { substituteValues } from '../../../utils/helpers/utilityFunctions'

// Option labels as the dropdown displays them. An "other" answer the applicant
// types in isn't offered.
const getChoices = (parameters: Record<string, unknown>): AiFillChoices | undefined => {
  const { options, optionsDisplayProperty, optionsDisplayExpression, multiSelect } = parameters
  if (!Array.isArray(options)) return undefined
  const labels = options.map((option) => {
    if (typeof option === 'string') return option
    if (typeof optionsDisplayExpression === 'string')
      return substituteValues(optionsDisplayExpression, option)
    if (typeof optionsDisplayProperty === 'string') return option?.[optionsDisplayProperty]
    return undefined
  })
  if (!labels.every((label) => typeof label === 'string')) return undefined
  return { options: labels, multiSelect: multiSelect === true }
}

export const aiFill: AiFillMethods = { getChoices }
