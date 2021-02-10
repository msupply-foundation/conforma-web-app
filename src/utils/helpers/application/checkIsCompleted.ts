import { SectionsStructure } from '../../types'

const checkIsCompleted = (sectionsStructure: SectionsStructure) => {
  const isCompleted = Object.values(sectionsStructure).every(
    ({ progress }) => progress?.completed && progress.valid
  )

  if (isCompleted) return { isCompleted: true }

  return {
    isCompleted: false,
    firstIncompleteLocation: findFirstIncompleteSection(sectionsStructure),
  }
}

const findFirstIncompleteSection = (sectionsStructure: SectionsStructure) => {
  const firstIncompleteLocation = Object.entries(sectionsStructure)
    .filter(([_, section]) => section.progress)
    .sort(([aKey], [bKey]) => (aKey < bKey ? -1 : 1))
    .find(([_, section]) => !section.progress?.completed || !section.progress.valid)

  if (firstIncompleteLocation) {
    const [_, section] = firstIncompleteLocation
    return section.details.code
  }
}

export default checkIsCompleted
