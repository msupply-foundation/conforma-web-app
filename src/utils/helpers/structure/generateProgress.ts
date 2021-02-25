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
  let firstInvalidSectionCode = ''
  let firstInvalidSectionIndex = Infinity
  let firstInvalidPageInSection = Infinity
  let firstInvalidSectionCodeStrict = ''
  let firstInvalidSectionIndexStrict = Infinity
  let firstInvalidPageInSectionStrict = Infinity
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
      if (
        !page.progress.valid &&
        section.details.index <= firstInvalidSectionIndex &&
        page.number < firstInvalidPageInSection
      ) {
        firstInvalidPageInSection = page.number
        firstInvalidSectionIndex = section.details.index
        firstInvalidSectionCode = section.details.code
        firstInvalidPageInSectionStrict = page.number
        firstInvalidSectionIndexStrict = section.details.index
        firstInvalidSectionCodeStrict = section.details.code
      } else if (
        page.progress.doneRequired < page.progress.totalRequired &&
        section.details.index <= firstInvalidSectionIndexStrict &&
        page.number < firstInvalidPageInSectionStrict
      ) {
        firstInvalidPageInSectionStrict = page.number
        firstInvalidSectionIndexStrict = section.details.index
        firstInvalidSectionCodeStrict = section.details.code
      }
    })
    section.progress = getSectionProgress(Object.values(section.pages))
  })
  structure.info.firstInvalidPage = firstInvalidSectionCode
    ? {
        sectionCode: firstInvalidSectionCode,
        pageName: `Page ${firstInvalidPageInSection}`,
        sectionIndex: firstInvalidSectionIndex,
        pageNumber: firstInvalidPageInSection,
      }
    : null
  structure.info.firstInvalidPageStrict = firstInvalidSectionCodeStrict
    ? {
        sectionCode: firstInvalidSectionCodeStrict,
        pageName: `Page ${firstInvalidPageInSectionStrict}`,
        sectionIndex: firstInvalidSectionIndexStrict,
        pageNumber: firstInvalidPageInSectionStrict,
      }
    : null
}
