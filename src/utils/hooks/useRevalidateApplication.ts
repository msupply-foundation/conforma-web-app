import { useEffect } from 'react'
import { SectionsStructure, User } from '../types'
import useGetResponsesAndElementState from './useGetResponsesAndElementState'
import useGetSectionsProgress from './useGetSectionProgress'

interface UseRevalidateApplicationProps {
  serialNumber: string
  currentUser: User
  sectionsStructure: SectionsStructure
  isApplicationReady: boolean
  isRevalidated: boolean
  setIsRevalidated: Function
}
const useRevalidateApplication = ({
  serialNumber,
  currentUser,
  sectionsStructure,
  isApplicationReady,
  isRevalidated,
  setIsRevalidated,
}: UseRevalidateApplicationProps) => {
  const { error, responsesByCode, elementsState } = useGetResponsesAndElementState({
    serialNumber,
    currentUser,
    isApplicationReady,
  })

  // Run evaluation on each section to check progress (and validity)
  const { evaluatedSections, isProcessing } = useGetSectionsProgress({
    currentUser,
    sectionsStructure,
    elementsState,
    responsesByCode,
    isStructureLoaded: !isRevalidated,
  })

  useEffect(() => {
    if (!isRevalidated && evaluatedSections !== undefined) {
      console.log('isRevalidated')
      setIsRevalidated(true)
    }
  }, [isRevalidated, evaluatedSections])

  return {
    error,
    evaluatedSections,
    isProcessing,
  }
}

export default useRevalidateApplication
