import { useEffect, useState } from 'react'
import updateSectionsProgress from '../helpers/application/updateSectionsProgress'
import { ValidatedSections, SectionsStructure, User } from '../types'
import useGetResponsesAndElementState from './useGetResponsesAndElementState'

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
  const [validatedSections, setValidatedSections] = useState<ValidatedSections>()
  const [isProcessing, setIsProcessing] = useState(false)

  const { error, loading, responsesByCode, elementsState } = useGetResponsesAndElementState({
    serialNumber,
    currentUser,
    isApplicationReady,
  })

  const isDoneOrProcessing = !loading || isProcessing || validatedSections !== undefined

  if (
    !isDoneOrProcessing &&
    !isRevalidated &&
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
      setSections: setValidatedSections,
    })
  }

  // TODO: Needs to set validatedSections to undefined at some point?

  useEffect(() => {
    if (!isRevalidated && validatedSections !== undefined) {
      setIsProcessing(false)
      setIsRevalidated(true)
    }
  }, [isRevalidated, validatedSections])

  return {
    error,
    validatedSections,
    isProcessing,
  }
}

export default useRevalidateApplication
