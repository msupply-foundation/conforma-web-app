import { FullStructure } from '../../types'

interface CheckPageIsAccessible {
  fullStructure: FullStructure
  firstIncomplete: { sectionCode: string; pageNumber: number }
  current: { sectionCode: string; pageNumber: number }
}

const checkPageIsAccessible = ({
  fullStructure,
  firstIncomplete,
  current: { sectionCode, pageNumber },
}: CheckPageIsAccessible) => {
  const firstIncompleteSectionIndex =
    fullStructure.sections[firstIncomplete.sectionCode].details.index
  const currentSectionIndex = fullStructure.sections[sectionCode].details.index

  return (
    currentSectionIndex < firstIncompleteSectionIndex ||
    (currentSectionIndex === firstIncompleteSectionIndex &&
      pageNumber <= firstIncomplete.pageNumber)
  )
}

export default checkPageIsAccessible
