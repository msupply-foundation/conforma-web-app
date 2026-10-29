import { AiFillMethods } from '../../types'

// Trimmed and cut to maxLength, as the input saves it
const fromPlainValue: AiFillMethods['fromPlainValue'] = (value, { maxLength }) => {
  const text = String(value).trim()
  if (!text) return undefined
  return { text: typeof maxLength === 'number' ? text.substring(0, maxLength) : text }
}

export const aiFill: AiFillMethods = { fromPlainValue }
