import {
  ApplicationElementStates,
  ElementState,
  ProgressStatus,
  ResponsesFullByCode,
  ResponseFull,
} from '../../utils/types'

import { TemplateElementCategory } from '../../utils/generated/graphql'

export enum PROGRESS_STATUS {
  NOT_VALID = 'NOT_VALID',
  VALID = 'VALID',
  INCOMPLETE = 'INCOMPLETE',
}

export const getCombinedStatus = (pages: ProgressStatus[] | undefined): ProgressStatus => {
  console.log('pages', pages)

  if (!pages) return PROGRESS_STATUS.VALID
  console.log('not empty')

  if (pages.some((status) => status === PROGRESS_STATUS.NOT_VALID)) return PROGRESS_STATUS.NOT_VALID
  console.log('no INVALID')

  if (pages.some((status) => status === PROGRESS_STATUS.INCOMPLETE))
    return PROGRESS_STATUS.INCOMPLETE

  console.log('no INCOMPLETE')

  return PROGRESS_STATUS.VALID
}

interface validatePageProps {
  elementsState: ApplicationElementStates
  responses: ResponsesFullByCode
  sectionIndex: number
  page: number
  // validationMode?: ValidationMode
}

/**
 * @function: validate a page
 * Returns page validation status (VALID, NOT_VALID or INCOMPLETE) after checking statuses
 * of all required question and other filled question:
 * NOT_VALID: Any question has an invalid response
 * INCOMPLETE: At least one required question is empty (and no other invalid questions)
 * VALID: All required questions (and other filled questions) have valid responses
 */
const validatePage = ({
  elementsState,
  responses,
  sectionIndex,
  page,
}: validatePageProps): ProgressStatus => {
  let count = 1

  // Filter visible elements in the current page
  const visibleQuestions = Object.values(elementsState)
    .filter(({ section, isVisible }) => isVisible && section === sectionIndex)
    .reduce((pageElements: ElementState[], element) => {
      if (element.elementTypePluginCode === 'pageBreak') count++
      const isInCurrrentPage = count === page

      // Add to array question that are in the current page
      return element.category === TemplateElementCategory.Question && isInCurrrentPage
        ? [...pageElements, element]
        : pageElements
    }, [])

  // Generate array with current status of responses for each question to verify
  const responsesStatuses = visibleQuestions.reduce(
    (responsesStatuses: ProgressStatus[], { code, isRequired }: ElementState) => {
      const { text, isValid } = responses[code] as ResponseFull
      const emptyResponse = !text || isValid === null
      if (isRequired && emptyResponse) return [...responsesStatuses, PROGRESS_STATUS.INCOMPLETE]
      // If not required and empty response -> Should return as valid
      else if (emptyResponse) return [...responsesStatuses, PROGRESS_STATUS.VALID]
      return [...responsesStatuses, isValid ? PROGRESS_STATUS.VALID : PROGRESS_STATUS.NOT_VALID]
    },
    []
  )

  // Return the result of combined status for the page
  return getCombinedStatus(responsesStatuses)
}

export default validatePage
