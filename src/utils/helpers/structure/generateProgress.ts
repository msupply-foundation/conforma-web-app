import { TemplateElementCategory } from '../../generated/graphql'
import { ElementStateNEW, FullStructure, PageNEW, Progress, SectionStateNEW } from '../../types'

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

const getSectionProgress = (pages: PageNEW[]): Progress =>
  pages.reduce(
    (sectionProgress: Progress, { progress }) => {
      if (!progress) return sectionProgress
      sectionProgress.doneNonRequired += progress.doneNonRequired || 0
      sectionProgress.totalNonRequired += progress.totalNonRequired || 0
      sectionProgress.doneRequired += progress.doneRequired || 0
      sectionProgress.totalRequired += progress.totalRequired || 0
      sectionProgress.totalSum = sectionProgress.totalRequired + sectionProgress.doneNonRequired
      sectionProgress.completed = calculateCompleted(
        sectionProgress.totalSum,
        sectionProgress.doneRequired,
        sectionProgress.doneNonRequired
      )
      if (!progress.valid) sectionProgress.valid = false
      return sectionProgress
    },
    { ...initialProgress }
  )

export const generateResponsesProgress = (structure: FullStructure) => {
  let firstInvalidSectionCodeStrict = ''
  let firstInvalidSectionIndexStrict = Infinity
  let firstInvalidPageInSectionStrict = Infinity
  const updateFirstInvalid = (section: SectionStateNEW, page: PageNEW) => {
    if (
      section.details.index <= firstInvalidSectionIndexStrict &&
      page.number < firstInvalidPageInSectionStrict &&
      (!page.progress.valid || page.progress.doneRequired < page.progress.totalRequired)
    ) {
      firstInvalidPageInSectionStrict = page.number
      firstInvalidSectionIndexStrict = section.details.index
      firstInvalidSectionCodeStrict = section.details.code
    }
  }
  Object.values(structure.sections).forEach((section) => {
    Object.values(section.pages).forEach((page) => {
      page.progress = { ...initialProgress }
      page.state
        .filter(({ element }) => {
          const { category, isVisible, isEditable } = element as ElementStateNEW
          return isVisible && isEditable && category === TemplateElementCategory.Question
        })
        .forEach(({ element, response }) => {
          const { progress } = page
          const { isRequired } = element as ElementStateNEW
          if (isRequired) progress.totalRequired++
          else progress.totalNonRequired++
          if (response?.text) {
            if (isRequired) progress.doneRequired++
            else progress.doneNonRequired++
          }
          if (typeof response !== 'undefined' && response?.isValid == false) progress.valid = false
          progress.totalSum = progress.totalRequired + progress.doneNonRequired
          progress.completed = calculateCompleted(
            progress.totalSum,
            progress.doneRequired,
            progress.doneNonRequired
          )
        })
      updateFirstInvalid(section, page)
    })
    section.progress = getSectionProgress(Object.values(section.pages))
  })
  structure.info.firstInvalidPageStrict = firstInvalidSectionCodeStrict
    ? {
        sectionCode: firstInvalidSectionCodeStrict,
        pageName: `Page ${firstInvalidPageInSectionStrict}`,
        sectionIndex: firstInvalidSectionIndexStrict,
        pageNumber: firstInvalidPageInSectionStrict,
      }
    : null
}
