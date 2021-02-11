import { Page, SectionsStructure } from '../../types'

interface GetElementsInStructureProps {
  sectionsStructure: SectionsStructure
  sectionCode: string
  page: number
}
export const getElementsInStructure = ({
  sectionsStructure,
  sectionCode,
  page,
}: GetElementsInStructureProps): Page | undefined => {
  return Object.values(sectionsStructure[sectionCode].pages).find(({ number }) => number == page)
}
