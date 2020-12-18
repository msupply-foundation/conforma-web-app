import { ReviewResponse } from '../generated/graphql'
import {
  ApplicationElementStates,
  ResponseFull,
  ResponsesByCode,
  SectionStructure,
  TemplateSectionPayload,
} from '../types'
import getPageElements from './getPageElements'

interface BuildSectionsStructureProps {
  templateSections: TemplateSectionPayload[]
  elementsState: ApplicationElementStates
  responsesByCode: ResponsesByCode
  reviewResponses?: ReviewResponse[]
}

const buildSectionsStructure = ({
  templateSections,
  elementsState,
  responsesByCode,
  reviewResponses,
}: BuildSectionsStructureProps): SectionStructure => {
  // Create the sections and pages structure to display each section's element
  // Will also add the responses for each element, and can add reviews if received by props
  return templateSections
    .sort((a, b) => a.index - b.index)
    .map((section) => {
      const sectionDetails = {
        title: section.title,
        code: section.code,
      }
      const pageNumbers = Array.from(Array(section.totalPages).keys(), (n) => n + 1)
      const pages = pageNumbers.reduce((pages, pageNumber) => {
        const elements = getPageElements({
          elementsState,
          sectionIndex: section.index,
          pageNumber,
        })
        if (elements.length === 0) return pages

        // Will build the array of elements in a page
        // with response OR response & reviewResponse
        const elementsFull = elements.map((element) => {
          const response = getResponse(element.code, responsesByCode)
          const elementState = {
            element,
            response,
          }
          if (!reviewResponses) return elementState
          const reviewResponse = getReviewResponse(response, reviewResponses)
          return {
            ...elementState,
            review: reviewResponse,
          }
        })
        const pageName = `Page ${pageNumber}`
        return { ...pages, [pageName]: elementsFull }
      }, {})
      return { section: sectionDetails, pages }
    })
}

const getResponse = (code: string, responsesByCode: ResponsesByCode) =>
  responsesByCode && responsesByCode[code] ? responsesByCode[code] : null

const getReviewResponse = (response: ResponseFull | null, reviewResponses: ReviewResponse[]) => {
  const reviewResponse = response
    ? reviewResponses.find(({ applicationResponse }) => {
        return response.id === applicationResponse?.id
      })
    : undefined
  return reviewResponse
    ? {
        decision: reviewResponse.decision ? reviewResponse.decision : undefined,
        comment: reviewResponse.comment ? reviewResponse.comment : '',
      }
    : undefined
}

export default buildSectionsStructure
