import { TemplateElementCategory } from '../../generated/graphql'
import { ElementStateNEW, FullStructure, PageNEW, Progress } from '../../types'

const initialProgress = {
  doneNonRequired: 0,
  doneRequired: 0,
  completed: false,
  totalNonRequired: 0,
  totalRequired: 0,
  totalSum: 0,
  valid: true,
}

const calculateCompleted = (totalSum: number, doneRequired: number, doneNonRequired: number) => {
  const totalDone = doneRequired + doneNonRequired
  return totalSum === totalDone
}

const getSectionProgress = (pages: PageNEW[]): Progress => {
  return pages.reduce((sectionProgress: Progress, { progress }) => {
    if (!progress) return sectionProgress
    let {
      doneNonRequired,
      doneRequired,
      completed,
      totalNonRequired,
      totalRequired,
      totalSum,
      valid,
    } = sectionProgress
    doneNonRequired += progress.doneNonRequired || 0
    totalNonRequired += progress.totalNonRequired || 0
    doneRequired += progress.doneRequired || 0
    totalRequired += progress.totalRequired || 0
    totalSum = totalRequired + doneNonRequired
    completed = calculateCompleted(totalSum, doneRequired, doneNonRequired)
    if (!progress.valid) valid = false
    return {
      doneNonRequired,
      doneRequired,
      completed,
      totalNonRequired,
      totalRequired,
      totalSum,
      valid,
    }
  }, initialProgress)
}

export const generateResponsesProgress = (structure: FullStructure) => {
  Object.values(structure.sections).forEach((section) => {
    Object.values(section.pages).forEach((page) => {
      const progress: Progress = initialProgress
      page.state
        .filter(({ element }) => {
          const { category, isVisible, isEditable } = element as ElementStateNEW
          return isVisible && isEditable && category === TemplateElementCategory.Question
        })
        .forEach(({ element, response }) => {
          const { isRequired } = element as ElementStateNEW
          if (isRequired) progress.totalRequired++
          else progress.totalNonRequired++
          if (response?.text) {
            if (isRequired) progress.doneRequired++
            else progress.doneNonRequired++
          }
          if (response !== null && !response?.isValid) progress.valid = false
          progress.totalSum = progress.totalRequired + progress.doneNonRequired
          progress.completed = calculateCompleted(
            progress.totalSum,
            progress.doneRequired,
            progress.doneNonRequired
          )
        })
      page.progress = progress
    })
    section.progress = getSectionProgress(Object.values(section.pages))
    section.invalidPage =
      Object.values(section.pages).find(({ progress }) => progress && !progress.valid)?.number ||
      undefined
  })
}
