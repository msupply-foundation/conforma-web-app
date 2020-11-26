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
  array: { status: ProgressStatus }[] | undefined,
  validatioMode: ValidationMode
): ProgressStatus => {
  if (!array) return PROGRESS_STATUS.VALID
  if (validatioMode === 'STRICT') {
    return array.every(({ status }) => status === PROGRESS_STATUS.VALID)
      ? PROGRESS_STATUS.VALID
      : array.some(({ status }) => status === PROGRESS_STATUS.NOT_VALID)
      ? PROGRESS_STATUS.NOT_VALID
      : PROGRESS_STATUS.INCOMPLETE
  } else {
    return array.some(({ status }) => status === PROGRESS_STATUS.VALID)
      ? PROGRESS_STATUS.VALID
      : array.some(({ status }) => status === PROGRESS_STATUS.NOT_VALID)
      ? PROGRESS_STATUS.NOT_VALID
      : PROGRESS_STATUS.INCOMPLETE
  }
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
 * Filter elements in the page, check which responses are considered in the validation.
 * Which elements are required to be validated depend on the validation mode:
 * [strict mode] - All visible elements: required (empty or not) or not-required but filled
 * [loose mode] - Only visible elements not empty
 */
const validatePage = ({
  elementsState,
  responses,
  sectionIndex,
  page,
  validationMode = 'LOOSE',
}: validatePageProps): ProgressStatus => {
  let count = 1
  const elementsInCurrentPage = Object.values(elementsState)
    .filter(({ section }) => section === sectionIndex)
    .reduce((pageElements: ElementState[], element) => {
      if (element.elementTypePluginCode !== 'pageBreak') count++
      return element.category !== TemplateElementCategory.Question
        ? pageElements
        : [...pageElements, element]
    }, [])

  const responsesStatuses = elementsInCurrentPage.reduce(
    (responsesStatuses: { status: ProgressStatus }[], element: ElementState) => {
      const { text, isValid } = responses[element.code] as ResponseFull
      const { isRequired, isVisible } = element

      return [
        ...responsesStatuses,
        {
          status: getResponseStatus(
            findResponseIsExpected(isVisible, isRequired, text, validationMode),
            text,
            isValid
          ),
        },
      ]
    },
    []
  )

  return getCombinedStatus(responsesStatuses, validationMode)
}

const findResponseIsExpected = (
  isVisible: boolean,
  isRequired: boolean,
  isFilled: string | null | undefined,
  validationMode: ValidationMode
): boolean => {
  return !isVisible
    ? false // Not visible
    : validationMode === 'STRICT'
    ? isRequired
      ? true // Visible, required element
      : isFilled
      ? true // Visible, not required but filled
      : false // Visible and not required
    : !isFilled
    ? false // Unkown if required, Empty & not checking empty
    : isRequired
    ? true // Visible, required & check for empty responses
    : false // Visible, not required
}

const getResponseStatus = (
  expected: boolean,
  text: string | null | undefined,
  isValid: boolean | null | undefined
): ProgressStatus => {
  return expected
    ? isValid
      ? PROGRESS_STATUS.VALID
      : PROGRESS_STATUS.NOT_VALID
    : PROGRESS_STATUS.INCOMPLETE
}

export default validatePage
