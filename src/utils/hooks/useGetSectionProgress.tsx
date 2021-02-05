import { useState, useEffect } from 'react'
import updateSectionsProgress from '../helpers/application/updateSectionsProgress'
import { ApplicationElementStates, ResponsesByCode, SectionDetails, User } from '../types'

interface UseGetSectionProgressProps {
  currentUser: User | null
  sections: SectionDetails[] | undefined
  elementsState: ApplicationElementStates | undefined
  responsesByCode: ResponsesByCode | undefined
}

const useGetSectionsProgress = ({
  currentUser,
  sections,
  elementsState,
  responsesByCode,
}: UseGetSectionProgressProps) => {
  const [sectionsProgress, setSectionsProgress] = useState<SectionDetails[]>()
  const [isLoadingProgress, setIsLoadingProgress] = useState(false)

  const isDoneOrProcessing = sectionsProgress || isLoadingProgress

  if (!isDoneOrProcessing && currentUser && elementsState && responsesByCode && sections) {
    setIsLoadingProgress(true)
    updateSectionsProgress({
      currentUser,
      elementsState,
      responsesByCode,
      sections,
      setSections: setSectionsProgress,
    })
  }

  useEffect(() => {
    if (sectionsProgress) setIsLoadingProgress(false)
  }, [sectionsProgress])

  return {
    sectionsProgress,
    isLoadingProgress,
  }
}

export default useGetSectionsProgress
