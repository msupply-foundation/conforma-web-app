import { useState, useEffect } from 'react'
import updateSectionsProgress from '../helpers/application/updateSectionsProgress'
import {
  ApplicationElementStates,
  EvaluatedSections,
  ResponsesByCode,
  SectionsStructure,
  User,
} from '../types'

interface UseGetSectionProgressProps {
  currentUser: User | null
  sectionsStructure?: SectionsStructure
  elementsState?: ApplicationElementStates
  responsesByCode?: ResponsesByCode
  isStructureLoaded: boolean
}

const useGetSectionsProgress = ({
  currentUser,
  sectionsStructure,
  elementsState,
  responsesByCode,
  isStructureLoaded,
}: UseGetSectionProgressProps) => {
  const [evaluatedSections, setEvaluatedSections] = useState<EvaluatedSections>()
  const [isProcessing, setIsProcessing] = useState(false)

  const isDoneOrProcessing = evaluatedSections !== undefined || isProcessing

  if (
    !isDoneOrProcessing &&
    isStructureLoaded &&
    currentUser &&
    elementsState &&
    responsesByCode &&
    sectionsStructure
  ) {
    setIsProcessing(true)
    updateSectionsProgress({
      currentUser,
      elementsState,
      responsesByCode,
      sections: sectionsStructure,
      setSections: setEvaluatedSections,
    })
  }

  useEffect(() => {
    if (evaluatedSections !== undefined) setIsProcessing(false)
  }, [evaluatedSections])

  return {
    evaluatedSections,
    isProcessing,
  }
}

export default useGetSectionsProgress
