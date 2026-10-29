export const createNumberFormatter = (
  locale: string | undefined,
  currency: string | undefined,
  maxSignificantDigits: number | undefined,
  decimals: number | undefined
) =>
  new Intl.NumberFormat(locale, {
    style: currency ? 'currency' : undefined,
    currency: currency !== '' ? currency : undefined,
    maximumSignificantDigits: maxSignificantDigits,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

export const parseInput = (
  textInput: string | null | undefined,
  numberFormatter: Intl.NumberFormat,
  simple: boolean,
  prefix: string | undefined,
  suffix: string | undefined,
  suffixPlural: string | undefined
): {
  number: number | null
  formattedNumber: string | null
  currentSuffix: string | undefined
  fullText: string | null
} => {
  if (!textInput)
    return { number: null, formattedNumber: null, currentSuffix: suffixPlural, fullText: null }
  // Strip out any text that isn't a digit, "-" or "." to create the number
  const rawDigits = textInput?.replace(/[^\d\.\-]/g, '')
  if (rawDigits === '')
    return { number: null, formattedNumber: textInput, currentSuffix: suffixPlural, fullText: null }
  const number: number = Number(rawDigits)
  const prefixString = prefix ? prefix + ' ' : ''
  const suffixString = suffix ? ' ' + (number === 1 ? suffix : suffixPlural) : ''
  const text: string = simple ? String(number) : (numberFormatter.format(number) as string)
  const fullText = prefixString + text + suffixString
  return {
    number,
    formattedNumber: text,
    currentSuffix: number === 1 ? suffix : suffixPlural,
    fullText,
  }
}
