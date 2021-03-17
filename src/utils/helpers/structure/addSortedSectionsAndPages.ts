import { FullStructure } from '../../types'

const addSortedSectionsAndPages = (newStructure: FullStructure): FullStructure => {
  const sortedSections = Object.values(newStructure.sections).sort(
    (sectionOne, sectionTwo) => sectionOne.details.index - sectionTwo.details.index
  )
  const sortedPages = sortedSections
    .map((section) =>
      Object.values(section.pages).sort((pageOne, pageTwo) => pageOne.number - pageTwo.number)
    )
    .flat()

  return { ...newStructure, sortedPages, sortedSections }
}

export default addSortedSectionsAndPages
