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

  async function runScanSectionProgress() {
    let sectionsProgress: SectionsProgress = {}
    templateSections.forEach(async ({ code, title, index }) => {
      const validate = await revalidateAll({
        elementsState,
        responsesByCode,
        currentUser,
        sectionCode: code,
        strict: false, // Do we still need this flag?
        shouldUpdateDatabase: false,
      })

      const { total, done } = validate.progress
      sectionsProgress = {
        ...sectionsProgress,
        [index]: {
          info: {
            title,
            code,
          },
          progress: { total, done, invalid: !validate.allValid },
          link: getLinkToSection(validate.allValid, validate.validityFailures),
        },
      }
      setSections(sectionsProgress)
    })
  }

  const getLinkToSection = (valid: boolean, validityFailures: any): string => {
    if (valid) {
      const firstSection = templateSections[0].code
      return `/application/${serialNumber}/${firstSection}/Page1`
    } else {
      const { firstErrorSectionCode, firstErrorPage } = getFirstErrorLocation(
        validityFailures,
        elementsState
      )
      return `/application/${serialNumber}/${firstErrorSectionCode}/Page${firstErrorPage}`
    }
  }

  useEffect(() => {
    if (loadStart && currentUser && templateSections && elementsState && responsesByCode) {
      setIsLoadingProgress(true)
      runScanSectionProgress().then(() => setIsLoadingProgress(false))
    }
  }, [loadStart])

  return {
    sections,
    isLoadingProgress,
  }
}

export default useGetSectionsProgress
