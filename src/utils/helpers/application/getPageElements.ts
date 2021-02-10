import { TemplateElementCategory } from '../../generated/graphql'
import {
  ApplicationElementStates,
  PageElements,
  PageElementsStatuses,
  ResponseFull,
} from '../../types'
import { PROGRESS_STATUS } from './validatePage'
interface GetPageElementsProps {
  elementsState: ApplicationElementStates
  sectionIndex: number
  pageNumber: number
}

export const getPageElements = ({
  elementsState,
  sectionIndex,
  pageNumber,
}: GetPageElementsProps) => {
  const result = Object.values(elementsState)
    .filter(({ isVisible }) => isVisible)
    .filter((element) => sectionIndex === element.sectionIndex && pageNumber === element.page)
    .sort((a, b) => a.elementIndex - b.elementIndex)

  return result
}

export const getPageElementsStatuses = (pageState: PageElements) => {
  // Filter visible elements in the current page
  const visibleQuestions = pageState.filter(({ element: { isVisible, category } }) => {
    return isVisible && category === TemplateElementCategory.Question
  })
  // Generate array with current status of responses for each question to verify
  const pageResponsesStatuses = visibleQuestions.reduce(
    (responsesStatuses: PageElementsStatuses, { element: { code, isRequired }, response }) => {
      const { text, isValid } = response as ResponseFull
      const emptyResponse = !text || isValid === null
      if (isRequired && emptyResponse)
        return { ...responsesStatuses, [code]: PROGRESS_STATUS.INCOMPLETE }
      // If not required and empty response -> Should return as valid
      else if (emptyResponse) return { ...responsesStatuses, [code]: PROGRESS_STATUS.VALID }
      return {
        ...responsesStatuses,
        [code]: isValid ? PROGRESS_STATUS.VALID : PROGRESS_STATUS.NOT_VALID,
      }
    },
    {}
  )

  // Return object with all required/filled elements statuses
  return pageResponsesStatuses
}
