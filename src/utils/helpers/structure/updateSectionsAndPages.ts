import { FullStructure } from '../../types'

const updateSectionsAndPages = (newStructure: FullStructure): FullStructure => {
  const sortedSections = Object.values(newStructure.sections).sort(
    (sectionOne, sectionTwo) => sectionOne.details.index - sectionTwo.details.index
  )
  const sortedPages = sortedSections
    .map((section) =>
      Object.values(section.pages).sort((pageOne, pageTwo) => pageOne.number - pageTwo.number)
    )
    .flat()

  // Set if section is or not active (in case no element is visible & active - should be inactive/hidden)
  sortedSections.forEach((section) => {
    section.details.active = Object.values(section.pages).some((page) =>
      Object.values(page.state).some(
        ({ element: { isVisible, isEditable } }) => isVisible && isEditable
      )
    )
  })

  return { ...newStructure, sortedPages, sortedSections }
}

export default updateSectionsAndPages
