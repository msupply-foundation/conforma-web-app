import {
  ApplicationSection,
  ApplicationSectionsConnection,
  TemplateElement,
  TemplateSection,
  TemplateSectionsConnection,
} from '../../generated/graphql'
import { SectionDetails } from '../../types'

export const getTemplateSections = (sectionsConnection: TemplateSectionsConnection) => {
  const sections = sectionsConnection?.nodes as TemplateSection[]
  return getSectionDetailsArray(sections)
}

export const getApplicationSections = (sectionsConnection: ApplicationSectionsConnection) => {
  const applicationSections = sectionsConnection?.nodes as ApplicationSection[]
  const sections = applicationSections
    .map(({ templateSection }: ApplicationSection) => templateSection as TemplateSection)
    .sort((a, b) => (a.index as number) - (b.index as number))
  return getSectionDetailsArray(sections)
}

const getSectionDetailsArray = (sectionsList: TemplateSection[]): SectionDetails[] =>
  sectionsList.map((section) => {
    const { id, code, title, index, templateElementsBySectionId } = section as TemplateSection
    const elements = templateElementsBySectionId.nodes as TemplateElement[]
    const pageBreaks = elements.filter(
      ({ elementTypePluginCode }) => elementTypePluginCode === 'pageBreak'
    )
    const totalPages = pageBreaks.length + 1

    return {
      id,
      code: code as string,
      title: title as string,
      index: index as number,
      totalPages,
    }
  })
