import { ApplicationElementStates, ElementState } from '../types'

interface GetPageElementsProps {
  elementsState: ApplicationElementStates
  sectionIndex: number
  pageNumber: number
}

const getPageElements = ({ elementsState, sectionIndex, pageNumber }: GetPageElementsProps) => {
  const result = Object.values(elementsState)
    .filter((element) => sectionIndex === element.sectionIndex && pageNumber === element.page)
    .sort((a, b) => a.elementIndex - b.elementIndex)

  return result
}

export default getPageElements
