import {
  ApplicationElementStates,
  ResponsesByCode,
  SectionDetails,
  SectionsStructure,
} from '../../types'
import { getPageElements } from './getPageElements'

interface BuildSectionsStructureProps {
  sections: SectionDetails[]
  elementsState: ApplicationElementStates
  responsesByCode: ResponsesByCode
}

export const buildSectionsStructure = ({
  sections,
  elementsState,
  responsesByCode,
}: BuildSectionsStructureProps): SectionsStructure => {
  // Create the sections and pages structure to display each section's element
  // Will also add the responses for each element, and can add reviews if received by props
  return sections.reduce((sectionsStructure: SectionsStructure, section) => {
    const pageNumbers = Array.from(Array(section.totalPages).keys(), (n) => n + 1)
    const pages = pageNumbers.reduce((pages, pageNumber) => {
      const elements = getPageElements({
        elementsState,
        sectionIndex: section.index,
        pageNumber,
      })
      if (elements.length === 0) return pages

      // Will build the array of elements
      const state = elements.map((element) => {
        const response = getResponse(element.code, responsesByCode)
        const elementState = {
          element,
          response,
        }
        return elementState
      })

      const pageName = `Page ${pageNumber}`
      return { ...pages, [pageName]: { number: pageNumber, state } }
    }, {})

    return {
      ...sectionsStructure,
      [section.code]: {
        details: section,
        pages,
      },
    }
  }, {})
}

const getResponse = (code: string, responsesByCode: ResponsesByCode) =>
  responsesByCode && responsesByCode[code] ? responsesByCode[code] : null

export const buildTemplateSectionsStructure = (sections: SectionDetails[]) => {
  return sections.reduce((sectionsStructure: SectionsStructure, section) => {
    return {
      ...sectionsStructure,
      [section.code]: {
        details: section,
        pages: {},
      },
    }
  }, {})
}
