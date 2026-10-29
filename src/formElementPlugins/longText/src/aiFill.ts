import { AiFillMethods } from '../../types'

// Cut to maxLength, as the input saves it
const fromPlainValue: AiFillMethods['fromPlainValue'] = (value, { maxLength }) => {
  const text = String(value)
  if (!text.trim()) return undefined
  return { text: typeof maxLength === 'number' ? text.substring(0, maxLength) : text }
}

export const aiFill: AiFillMethods = { fromPlainValue }
