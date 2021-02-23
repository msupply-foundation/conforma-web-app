import { ElementStateNEW, FullStructure, Progress } from '../../types'

const generateProgressInStructure = (structure: FullStructure) => {
  Object.entries(structure.sections).forEach(([code, section]) => {
    Object.entries(section.pages).forEach(([pageName, page]) => {
      const progress: Progress = {
        doneNonRequired: 0,
        doneRequired: 0,
        completed: false,
        totalNonRequired: 0,
        totalRequired: 0,
        totalSum: 0,
        valid: true,
      }
      page.state
        .filter(({ element }) => {
          const { isVisible, isEditable } = element as ElementStateNEW
          return isVisible && isEditable
        })
        .forEach(({ element, response, review }) => {
          const { isRequired } = element as ElementStateNEW
          if (isRequired) progress.totalRequired++
          else progress.totalNonRequired++
          if (response?.text) {
            if (isRequired) progress.doneRequired++
            else progress.doneNonRequired++
          }
          if (response !== null && !response.isValid) progress.valid = false
        })
    })
  })
}

export default generateProgressInStructure
