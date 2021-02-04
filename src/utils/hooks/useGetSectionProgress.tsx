import { useState, useEffect } from 'react'
import { getFirstErrorLocation, revalidateAll } from '../helpers/application/revalidateAll'
import {
  ApplicationElementStates,
  ResponsesByCode,
  SectionsProgress,
  TemplateSectionPayload,
  User,
} from '../types'

interface UseGetSectionProgressProps {
  loadStart: boolean
  currentUser: User
  serialNumber: string
  templateSections: TemplateSectionPayload[]
  elementsState: ApplicationElementStates
  responsesByCode: ResponsesByCode
}

const useGetSectionsProgress = ({
  loadStart,
  currentUser,
  serialNumber,
  templateSections,
  elementsState,
  responsesByCode,
}: UseGetSectionProgressProps) => {
  const [sections, setSections] = useState<SectionsProgress>()
  const [isLoadingProgress, setIsLoadingProgress] = useState(false)

  useEffect(() => {
    if (loadStart && currentUser && templateSections && elementsState && responsesByCode) {
      setIsLoadingProgress(true)
      runScanSectionProgress()
    }
  }, [loadStart])

  async function runScanSectionProgress() {
    let sectionsProgress: SectionsProgress = {}
    templateSections.forEach(async ({ code, title, index }) => {
      const validate = await revalidateAll({
        elementsState,
        responsesByCode,
        currentUser,
        sectionCode: code,
      })

      const { progress, validityFailures } = validate
      const { total, done, valid } = progress

      sectionsProgress = {
        ...sectionsProgress,
        [index]: {
          info: {
            title,
            code,
          },
          progress: { total, done, valid, completed: valid && total === done },
          link: !(total === done && valid)
            ? getLinkToInProgressLocation(validityFailures)
            : undefined,
        },
      }

      setSections(sectionsProgress)
      if (templateSections.length === Object.keys(sectionsProgress).length)
        setIsLoadingProgress(false)
    })
  }

  const getLinkToInProgressLocation = (validityFailures: any): string => {
    const { firstErrorSectionCode, firstErrorPage } = getFirstErrorLocation(
      validityFailures,
      elementsState
    )
    const section = firstErrorSectionCode ? firstErrorSectionCode : templateSections[0].code
    const page = firstErrorPage ? firstErrorPage : 1
    return `/application/${serialNumber}/${section}/Page${page}`
  }

  return {
    sections,
    isLoadingProgress,
  }
}

export default useGetSectionsProgress
