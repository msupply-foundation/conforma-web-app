import {
  ApplicationElementStates,
  ResponsesByCode,
  RevalidateResult,
  SectionsStructure,
  User,
  ValidityFailure,
} from '../../types'
import { revalidateAll } from '../validation/revalidateAll'

interface GetSectionsProgressProps {
  currentUser: User
  elementsState: ApplicationElementStates
  responsesByCode: ResponsesByCode
  sections: SectionsStructure
  setSections: (props: {
    sectionsWithProgress: SectionsStructure
    elementsToUpdate: ValidityFailure[]
  }) => void
}

/**
 * @function updateSectionsProgress
 * Update sections strucutre to add progress on each section.
 * After the setions structure is built (by useLoadSectionsStructure)
 * this utility function runs revalidateAll and retrieve each section
 * progress to display in the UI of a Application in Draft/Changes required.
 * @param param0
 */
const updateSectionsProgress = async ({
  currentUser,
  elementsState,
  responsesByCode,
  sections,
  setSections,
}: GetSectionsProgressProps) => {
  const validatePromises: Promise<RevalidateResult>[] = []
  Object.keys(sections).forEach((code) => {
    const validate = revalidateAll({
      elementsState,
      responsesByCode,
      currentUser,
      sectionCode: code,
    })
    validatePromises.push(validate)
  })

  Promise.all(validatePromises).then((values) => {
    const elementsToUpdate: ValidityFailure[] = []
    values.forEach(({ validityFailures, sectionCode, progress }) => {
      if (sectionCode) sections[sectionCode].progress = progress
      else console.log('Problem to add progress to section', sectionCode)
      validityFailures.forEach((changedElement) => elementsToUpdate.push(changedElement))
    })
    setSections({
      sectionsWithProgress: sections,
      elementsToUpdate,
    })
  })
}

export default updateSectionsProgress
