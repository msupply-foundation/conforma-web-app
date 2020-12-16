import {
  ApplicationElementStates,
  ResponsesByCode,
  RevalidateResult,
  User,
  ValidityFailure,
} from '../types'
import { defaultValidate } from '../../formElementPlugins/defaultValidate'

export const revalidateAll = async (
  elementsState: ApplicationElementStates,
  responsesByCode: ResponsesByCode,
  currentUser: User,
  strict = true,
  shouldUpdateDatabase = true
): Promise<RevalidateResult> => {
  const validate = defaultValidate // To-Do: import custom validation methods

  const elementCodes = Object.keys(elementsState).filter(
    (key) =>
      responsesByCode && // Typescript requires this
      elementsState[key].category === 'QUESTION' &&
      elementsState[key].isVisible === true &&
      // Strict/Loose validation logic:
      ((strict && elementsState[key].isRequired) || responsesByCode[key]?.isValid !== null)
  )

  const validationExpressions = elementCodes.map((code) => {
    const thisResponse = responsesByCode
      ? responsesByCode[code]?.text
        ? responsesByCode[code]?.text
        : ''
      : ''
    const responses = { thisResponse, ...responsesByCode }
    return validate(
      elementsState[code].validation,
      elementsState[code]?.validationMessage as string,
      {
        objects: [responses, currentUser],
        APIfetch: fetch,
      }
    )
  })

  const resultArray = await Promise.all(validationExpressions)
  const validityFailures: ValidityFailure[] = shouldUpdateDatabase
    ? elementCodes.reduce((validityFailures: ValidityFailure[], code, index) => {
        if (!resultArray[index].isValid)
          return [
            ...validityFailures,
            {
              id: (responsesByCode && responsesByCode[code].id) || 0,
              isValid: false,
              code,
            },
          ]
        else return validityFailures
      }, [])
    : []

  return {
    allValid: resultArray.every((element) => element.isValid),
    validityFailures,
  }
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
