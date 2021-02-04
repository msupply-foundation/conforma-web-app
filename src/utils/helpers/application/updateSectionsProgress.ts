import { promises } from 'fs'
import {
  ApplicationElementStates,
  ResponsesByCode,
  RevalidateResult,
  SectionDetails,
  User,
} from '../../types'
import { revalidateAll } from './revalidateAll'

interface GetSectionsProgressProps {
  currentUser: User
  elementsState: ApplicationElementStates
  responsesByCode: ResponsesByCode
  sections: SectionDetails[]
  setSections: (sections: SectionDetails[]) => void
}

const updateSectionsProgress = async ({
  currentUser,
  elementsState,
  responsesByCode,
  sections,
  setSections,
}: GetSectionsProgressProps) => {
  const validatePromises: Promise<RevalidateResult>[] = []
  sections.forEach(async ({ code }) => {
    const validate = revalidateAll({
      elementsState,
      responsesByCode,
      currentUser,
      sectionCode: code,
    })
    validatePromises.push(validate)
  })

  Promise.all(validatePromises).then((values) => {
    const sectionsProgress: SectionDetails[] = []
    values.forEach(({ progress, validityFailures }, index) => {
      const { total, done, valid } = progress

      sectionsProgress.push({
        ...sections[index],
        progress: { total, done, valid, completed: valid && total === done },
        // link?
      })
    })
    setSections(sectionsProgress)
  })
}

export default updateSectionsProgress
