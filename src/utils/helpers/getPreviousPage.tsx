import { CurrentPage, TemplateSectionPayload } from '../types'

interface GetPreviousPageProps {
  templateSections: TemplateSectionPayload[]
  sectionCode: string
  pageNumber: number
}

const getPreviousPage = ({
  templateSections,
  sectionCode,
  pageNumber,
}: GetPreviousPageProps): CurrentPage | undefined => {
  const currentSection = getCurrentSection(templateSections, sectionCode)

  // Check for first page/section, which don't have a previous page
  if (!currentSection || (currentSection.index === 0 && pageNumber === 1)) return undefined

  const previousPage = pageNumber - 1
  // Check if previous page is in the same section
  const section =
    previousPage > 0 ? currentSection : getPreviousSection(templateSections, currentSection.index)

  if (!section) {
    console.log('Problem to check previous page - section not found!')
    return undefined
  }

  const page = pageNumber - 1 > 0 ? pageNumber - 1 : section.totalPages

  return { section, page }
}

const getCurrentSection = (templateSections: TemplateSectionPayload[], sectionCode: string) =>
  templateSections.find(({ code }) => code === sectionCode)

// TODO: If we allow gaps between section index this needs improvement!
const getPreviousSection = (templateSections: TemplateSectionPayload[], currentIndex: number) =>
  templateSections.find(({ index }) => index === currentIndex - 1)

export default getPreviousPage
