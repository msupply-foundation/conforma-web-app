import { Page, ResponseFull, SectionsStructure } from '../../types'

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

export const getResponsesInStrucutre = (sectionsStructure: SectionsStructure) => {
  return Object.values(sectionsStructure).reduce((responses: ResponseFull[], { pages }) => {
    Object.values(pages).forEach(({ state }) => {
      responses.concat(
        state
          .filter(({ response }) => response != null)
          .map(({ response }) => response as ResponseFull)
      )
    })
    return responses
  }, [])
}
