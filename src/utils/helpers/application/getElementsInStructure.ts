import { PageElements, SectionsStructure } from '../../types'

interface GetElementsInStructureProps {
  sectionsStructure: SectionsStructure
  sectionCode: string
  page: string
}
export const getElementsInStructure = ({
  sectionsStructure,
  sectionCode,
  page,
}: GetElementsInStructureProps): PageElements | undefined => {
  return sectionsStructure[sectionCode].pages['Page ' + page]
}
