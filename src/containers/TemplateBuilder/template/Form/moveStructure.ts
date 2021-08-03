import { FullTemplateFragment } from '../../../../utils/generated/graphql'

type MoveElement = {
  id: number
  index: number
  page: MovePage
  section: MoveSection
  isLastInPage: boolean
  isFirstInPage: boolean
  nextElement: MoveElement | null
  previousElement: MoveElement | null
}
type MovePage = {
  pageNumber: number
  isFirst: boolean
  isLast: boolean
  section: MoveSection
  elements: MoveElement[]
  startPageBreaks: MoveElement[]
  endPageBreaks: MoveElement[]
}
type MoveSection = {
  id: number
  pages: { [pageNumber: number]: MovePage }
  isFirst: boolean
  isLast: boolean
  lastElementIndex: number
  index: number
  allElements: MoveElement[]
  elements: MoveElement[]
  nextSection: MoveSection | null
  previousSection: MoveSection | null
}

type MoveStructure = {
  firstSectionIndex: number
  lastSectionIndex: number
  sections: { [id: number]: MoveSection }
  elements: { [id: number]: MoveElement }
}

const getMoveStructure = (templateInfo: FullTemplateFragment) => {
  const result: MoveStructure = {
    sections: {},
    elements: {},
    lastSectionIndex: 0,
    firstSectionIndex: 0,
  }

  const templateSections = templateInfo?.templateSections?.nodes || []
  let previousSection: MoveSection | null = null
  templateSections.forEach((templateSection, index) => {
    const templateElements = templateSection?.templateElementsBySectionId?.nodes || []
    const section: MoveSection = {
      id: templateSection?.id || 0,
      pages: {},
      index: templateSection?.index || 0,
      isFirst: index === 0,
      previousSection,
      elements: [],
      nextSection: null,
      allElements: [],
      isLast: templateSections.length - 1 === index,
      lastElementIndex: 0,
    }
    if (previousSection) previousSection.nextSection = section
    previousSection = section

    let pageNumber = 0

    result.sections[templateSection?.id || 0] = section
    result.lastSectionIndex = section.index
    if (index === 0) result.firstSectionIndex = section.index

    let previousElement: MoveElement | null = null

    let previousElementIsPageBreak = true
    let isFirstPage = true

    templateElements.forEach((templateElement, index) => {
      const isLastInSection = index === templateElements.length - 1
      const isPageBreak = templateElement?.elementTypePluginCode === 'pageBreak'

      const isFirstElementAfterPageBreak = !isPageBreak && previousElementIsPageBreak

      if (isFirstElementAfterPageBreak) {
        pageNumber++
        const previousPage = section.pages[pageNumber - 1] || null
        section.pages[pageNumber] = {
          pageNumber,
          section,
          isFirst: isFirstPage,
          isLast: isLastInSection,
          startPageBreaks: previousPage ? previousPage.endPageBreaks : [],
          endPageBreaks: [],
          elements: [],
        }
        isFirstPage = false
      }

      const pageExists = section.pages[pageNumber]

      const element: MoveElement = {
        id: templateElement?.id || 0,
        index: templateElement?.index || 0,
        page: section.pages[pageNumber],
        isFirstInPage: !pageExists || section.pages[pageNumber].elements.length === 0,
        isLastInPage: false,
        previousElement,
        nextElement: null,
        section,
      }

      section.allElements.push(element)

      if (isPageBreak) {
        if (previousElement) previousElement.isLastInPage = true
        if (pageExists) section.pages[pageNumber].endPageBreaks.push(element)
      } else {
        result.elements[templateElement?.id || 0] = element
        section.pages[pageNumber].elements.push(element)
        section.elements.push(element)
        if (previousElement) previousElement.nextElement = element
        previousElement = element
      }

      if (isLastInSection) {
        section.lastElementIndex = element.index
        if (pageExists) section.pages[pageNumber].isLast = isLastInSection
        if (!isPageBreak) element.isLastInPage = true
      }

      previousElementIsPageBreak = isPageBreak
    })
  })

  return result
}

export default getMoveStructure

export { MoveElement, MovePage, MoveSection, MoveStructure }
