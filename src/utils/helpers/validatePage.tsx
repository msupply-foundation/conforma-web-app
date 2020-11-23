import {
  ApplicationElementStates,
  ElementState,
  ProgressStatus,
  ResponsesFullByCode,
  ResponseFull,
} from '../../utils/types'

import { TemplateElementCategory } from '../../utils/generated/graphql'

export const PROGRESS_STATUS: { [key: string]: ProgressStatus } = {
  NOT_VALID: 'NOT_VALID',
  VALID: 'VALID',
  INCOMPLETE: 'INCOMPLETE',
}

export const getCombinedStatus = (
  array: { status: ProgressStatus }[] | undefined
): ProgressStatus => {
  if (!array) return PROGRESS_STATUS.VALID
  return array.every(({ status }) => status === PROGRESS_STATUS.VALID)
    ? PROGRESS_STATUS.VALID
    : array.every(({ status }) => status === PROGRESS_STATUS.NOT_VALID)
    ? PROGRESS_STATUS.NOT_VALID
    : PROGRESS_STATUS.INCOMPLETE
}

interface validatePageProps {
  elementsState: ApplicationElementStates
  responses: ResponsesFullByCode
  sectionIndex: number
  page: number
  checkEmpty?: boolean
}

const validatePage = ({
  elementsState,
  responses,
  sectionIndex,
  page,
  checkEmpty = false,
}: validatePageProps): ProgressStatus => {
  let count = 1
  const elementsInCurrentPage = Object.values(elementsState)
    .filter(({ section }) => section === sectionIndex)
    .reduce((pageElements: ElementState[], element) => {
      if (element.elementTypePluginCode === 'pageBreak') count++
      if (count !== page) return pageElements
      if (element.category === TemplateElementCategory.Question) return [...pageElements, element]
      return pageElements
    }, [])

  const responsesStatuses = elementsInCurrentPage.reduce(
    (responsesStatuses: { status: ProgressStatus }[], element: ElementState) => {
      const { text, isValid } = responses[element.code] as ResponseFull
      const { isRequired, isVisible } = element

      const findResponseIsExpected = (
        isVisible: boolean,
        isRequired: boolean,
        isFilled: string | null | undefined,
        checkEmpty: boolean
      ): boolean => {
        return !isVisible
          ? false // Not visible
          : checkEmpty
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
            : !text || text.length === 0
            ? PROGRESS_STATUS.INCOMPLETE
            : PROGRESS_STATUS.NOT_VALID
          : PROGRESS_STATUS.INCOMPLETE
      }

      const isRensponseExpected = findResponseIsExpected(isVisible, isRequired, text, checkEmpty)
      return [
        ...responsesStatuses,
        { status: getResponseStatus(isRensponseExpected, text, isValid) },
      ]
    },
    []
  )

  return getCombinedStatus(responsesStatuses)
}

export default validatePage
