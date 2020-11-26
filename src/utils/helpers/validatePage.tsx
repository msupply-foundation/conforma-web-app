import {
  ApplicationElementStates,
  ElementState,
  ProgressStatus,
  ResponsesFullByCode,
  ResponseFull,
  ValidationMode,
} from '../../utils/types'

import { TemplateElementCategory } from '../../utils/generated/graphql'

export enum PROGRESS_STATUS {
  NOT_VALID = 'NOT_VALID',
  VALID = 'VALID',
  INCOMPLETE = 'INCOMPLETE',
}

export const getCombinedStatus = (
  pages: { status: ProgressStatus }[] | undefined
): ProgressStatus => {
  if (!pages) return PROGRESS_STATUS.VALID
  if (pages.some(({ status }) => status === PROGRESS_STATUS.NOT_VALID))
    return PROGRESS_STATUS.NOT_VALID
  if (pages.some(({ status }) => status === PROGRESS_STATUS.INCOMPLETE))
    return PROGRESS_STATUS.INCOMPLETE
  return PROGRESS_STATUS.VALID
}

interface validatePageProps {
  elementsState: ApplicationElementStates
  responses: ResponsesFullByCode
  sectionIndex: number
  page: number
  validationMode?: ValidationMode
}

/**
 * @function: validate a page - in strict or loose validation mode.
 * Which elements are required to be validated depend on the validation mode:
 * [strict mode] - All visible elements: required (filled or not) or not-required (filled)
 * [loose mode] - Only visible elements with a response (filled)
 */
const validatePage = ({
  elementsState,
  responses,
  sectionIndex,
  page,
  validationMode = 'LOOSE',
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

  // Verify questions are should be considered in the (strict or loose) validation
  const verifyQuestions = visibleQuestions.filter(({ code, isRequired }) => {
    if (responses[code]?.text && responses[code]?.text !== '') return true
    if (isRequired && validationMode === 'STRICT') return true
    return false
  })

  // Generate array with statuses of responses of question to verify
  const responsesStatuses = verifyQuestions.reduce(
    (responsesStatuses: { status: ProgressStatus }[], element: ElementState) => {
      const { isValid } = responses[element.code] as ResponseFull

      return [
        ...responsesStatuses,
        {
          status: isValid ? PROGRESS_STATUS.VALID : PROGRESS_STATUS.NOT_VALID,
        },
      ]
    },
    []
  )

  // Return the result of combined status for the page
  return getCombinedStatus(responsesStatuses)
}

export default validatePage
