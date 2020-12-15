import {
  ApplicationElementStates,
  ResponsesByCode,
  RevalidateResult,
  ValidityFailure,
} from '../types'
import { defaultValidate } from '../../formElementPlugins/defaultValidate'

export const revalidateAll = async (
  elementsState: ApplicationElementStates | undefined,
  responsesByCode: ResponsesByCode | undefined,
  strict = true,
  shouldUpdateDatabase = true
): Promise<RevalidateResult> => {
  const validate = defaultValidate // To-Do: import custom validation methods

  if (elementsState) {
    const elementCodes = Object.keys(elementsState).filter(
      (key) =>
        responsesByCode && // Typescript requires this
        elementsState[key].category === 'QUESTION' &&
        elementsState[key].isVisible === true &&
        // Strict/Loose validation logic:
        ((strict && elementsState[key].isRequired) || responsesByCode[key]?.isValid !== null)
    )

    const validationExpressions = elementCodes.map((code) => elementsState[code].validation)

    const evaluatedValidations = []

    for (let i = 0; i < elementCodes.length; i++) {
      const code = elementCodes[i]
      const thisResponse = responsesByCode
        ? responsesByCode[code]?.text
          ? responsesByCode[code]?.text
          : ''
        : ''
      const responses = { thisResponse, ...responsesByCode }
      const expression = validationExpressions[i]
      evaluatedValidations.push(
        validate(expression, elementsState[code]?.validationMessage as string, {
          objects: [responses],
          APIfetch: fetch,
        })
      )
    }
    const resultArray = await Promise.all(evaluatedValidations)
    // console.log('Result', resultArray)
  const validityFailures: ValidityFailure[] = shouldUpdateDatabase
      ? elementCodes.reduce((validityFailures: ValidityFailure[], code, index) => {
          if (!resultArray[index].isValid) {
            return [
              ...validityFailures,
              {
                id: (responsesByCode && responsesByCode[code].id) || 0,
                isValid: false,
                code,
              },
            ]
          } else return validityFailures
        }, [])
      : []

    return {
      allValid: resultArray.every((element) => element.isValid),
      validityFailures,
    }
  }
  // Typescript requires final return -- it should never be reached
  return { allValid: false, validityFailures: [] }
}

export const getFirstErrorLocation = (
  validityFailures: ValidityFailure[],
  elementsState: ApplicationElementStates
) => {
  let firstErrorSectionIndex = Infinity
  let firstErrorPage = Infinity
  let firstErrorSectionCode = ''
  validityFailures.forEach((failure: ValidityFailure) => {
    const { code } = failure
    const sectionIndex = elementsState[code].sectionIndex
    const page = elementsState[code].page
    if (sectionIndex < firstErrorSectionIndex) {
      firstErrorSectionIndex = sectionIndex
      firstErrorPage = page
      firstErrorSectionCode = elementsState[code].sectionCode
    } else
      firstErrorPage =
        sectionIndex === firstErrorSectionIndex && page < firstErrorPage ? page : firstErrorPage
  })
  return { firstErrorSectionIndex, firstErrorSectionCode, firstErrorPage }
}
