import { ReviewResponse, User } from '../../generated/graphql'
import {
  ApplicationElementStates,
  ResponseFull,
  ResponsesByCode,
  SectionStructure,
  TemplateSectionPayload,
} from '../../types'
import getPageElements from './getPageElements'

interface BuildSectionsStructureProps {
  templateSections: TemplateSectionPayload[]
  elementsState: ApplicationElementStates
  responsesByCode: ResponsesByCode
  reviewResponses?: ReviewResponse[]
  reviewer?: User
}

const buildSectionsStructure = ({
  templateSections,
  elementsState,
  responsesByCode,
  reviewResponses,
  reviewer,
}: BuildSectionsStructureProps): SectionStructure => {
  // Create the sections and pages structure to display each section's element
  // Will also add the responses for each element, and can add reviews if received by props
  return templateSections
    .sort((a, b) => a.index - b.index)
    .map((section) => {
      let reviewInSection = false
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
          if (!response || !reviewResponses) return elementState
          const reviewResponse = getReviewResponse(response, reviewResponses)
          if (reviewResponse) reviewInSection = true
          return {
            ...elementState,
            review: reviewResponse,
          }
        })

        const pageName = `Page ${pageNumber}`
        return { ...pages, [pageName]: elementsFull }
      }, {})

      const sectionState = {
        section: {
          title: section.title,
          code: section.code,
        },
        pages,
      }

      if (!reviewer || !reviewInSection) return sectionState
      const { id, firstName, lastName } = reviewer as User
      return {
        ...sectionState,
        assigned: { id, firstName: firstName as string, lastName: lastName as string },
      }
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

  if (reviewResponse) {
    const { id, reviewResponseDecision: decision, comment } = reviewResponse
    return {
      id,
      decision: decision ? decision : undefined,
      comment: comment ? comment : '',
    }
  } else return undefined
}

export default buildSectionsStructure
