import { AiFillChoices, AiFillMethods } from '../../types'

// Option labels as the radio buttons display them. The "other" option isn't
// offered, as its answer is text the applicant types in.
const getChoices = (parameters: Record<string, unknown>): AiFillChoices | undefined => {
  const { options, optionsDisplayProperty } = parameters
  if (!Array.isArray(options)) return undefined
  const labels = options.map((option) =>
    typeof optionsDisplayProperty === 'string' && typeof option === 'object'
      ? option?.[optionsDisplayProperty]
      : option
  )
  if (!labels.every((label) => typeof label === 'string')) return undefined
  return { options: labels }
}

export const aiFill: AiFillMethods = { getChoices }
