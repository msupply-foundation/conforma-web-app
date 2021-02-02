import {
  ApplicationElementStates,
  ResponsesByCode,
  RevalidateResult,
  User,
  ValidityFailure,
} from '../../types'
import validate from '../../../formElementPlugins/defaultValidate'

interface RevalidateAllProps {
  elementsState: ApplicationElementStates
  responsesByCode: ResponsesByCode
  currentUser: User
  sectionCode?: string
  strict?: boolean
  shouldUpdateDatabase?: boolean
}
export const revalidateAll = async ({
  elementsState,
  responsesByCode,
  currentUser,
  sectionCode,
  strict = true,
  shouldUpdateDatabase = true,
}: RevalidateAllProps): Promise<RevalidateResult> => {
  // Filter section (when runnin per sections)
  const elementCodes = sectionCode
    ? Object.keys(elementsState).filter((key) => elementsState[key].sectionCode === sectionCode)
    : Object.keys(elementsState)

  // Now filter only questions, visible and which ones should be valid
  const filteredQuestions = elementCodes.filter(
    (key) =>
      responsesByCode && // Typescript requires this
      elementsState[key].category === 'QUESTION' &&
      elementsState[key].isVisible === true &&
      // Strict/Loose validation logic:
      (elementsState[key].isRequired || responsesByCode[key]?.isValid !== null)
  )

  const validationExpressions = filteredQuestions.map((code) => {
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
        objects: { responses, currentUser },
        APIfetch: fetch,
      }
    )
  })

  const resultArray = await Promise.all(validationExpressions)

  // Also make empty responses invalid for required questions
  const strictResultArray = resultArray.map((element, index) => {
    const code = filteredQuestions[index]
    return elementsState[code].isRequired &&
      (!responsesByCode[code]?.text ||
        responsesByCode[code].text === null ||
        responsesByCode[code].text === '')
      ? { ...element, isValid: false }
      : element
  })

  const validityFailures: ValidityFailure[] = shouldUpdateDatabase
    ? filteredQuestions.reduce((validityFailures: ValidityFailure[], code, index) => {
        if (!strictResultArray[index].isValid)
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

  const progress = {
    total: filteredQuestions.length,
    done: resultArray.filter((_, index) => {
      const code = filteredQuestions[index]
      return !responsesByCode[code]?.text ||
        responsesByCode[code].text === null ||
        responsesByCode[code].text === ''
        ? false
        : true
    }).length,
    invalid: resultArray.some((element) => !element.isValid),
  }

  return {
    allValid: strictResultArray.every((element) => element.isValid),
    validityFailures,
    progress,
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
