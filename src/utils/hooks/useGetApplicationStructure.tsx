import { useState, useEffect } from 'react'
import { EvaluationOptions, FullStructure } from '../types'
import {
  ApplicationResponse,
  ApplicationResponseStatus,
  ApplicationStatus,
  useGetAllResponsesQuery,
} from '../generated/graphql'
import { useUserState } from '../../contexts/UserState'
import {
  addEvaluatedResponsesToStructure,
  addElementsById,
  updateSectionsAndPages,
  addApplicationResponses,
  addChangeRequestForApplicant,
  generateApplicantChangesRequestedProgress,
  generateApplicantResponsesProgress,
} from '../helpers/structure'
import { useRouter } from './useRouter'

interface UseGetApplicationStructureProps {
  structure: FullStructure
  shouldRevalidate?: boolean
  minRefetchTimestampForRevalidation?: number
  firstRunValidation?: boolean
  shouldCalculateProgress?: boolean
  shouldGetDraftResponses?: boolean
  forceRun?: boolean
}

const useGetApplicationStructure = ({
  structure,
  shouldRevalidate = false,
  minRefetchTimestampForRevalidation = 0,
  firstRunValidation = true,
  shouldCalculateProgress = structure.info.current.status !== ApplicationStatus.Completed,
  shouldGetDraftResponses = true,
  forceRun = false,
}: UseGetApplicationStructureProps) => {
  const {
    info: { serial },
  } = structure
  const {
    userState: { currentUser },
  } = useUserState()
  const [fullStructure, setFullStructure] = useState<FullStructure>()
  const [firstRunProcessValidation, setFirstRunProcessValidation] = useState(
    firstRunValidation && structure.info.current?.status === ApplicationStatus.Draft
  )

  const { currentPageType } = useRouter()

  const [lastRefetchedTimestamp, setLastRefetchedTimestamp] = useState<number>(0)
  const [lastProcessedTimestamp, setLastProcessedTimestamp] = useState<number>(0)

  const { data, error } = useGetAllResponsesQuery({
    variables: {
      serial,
      responseStatuses: shouldGetDraftResponses
        ? [ApplicationResponseStatus.Submitted, ApplicationResponseStatus.Draft]
        : [ApplicationResponseStatus.Submitted],
    },
    skip: !serial,
    fetchPolicy: 'network-only',
  })

  // TODO - might need a use effect if serial is changes (navigated to another application from current page)

  useEffect(() => {
    if (!data) return
    setLastRefetchedTimestamp(Date.now())
  }, [data])

  useEffect(() => {
    if (error) return

    if (!data) return

    const isDataUpToDate = lastProcessedTimestamp > lastRefetchedTimestamp
    const shouldRevalidationWaitForRefetech =
      minRefetchTimestampForRevalidation > lastRefetchedTimestamp
    const shouldRevalidateThisRun = shouldRevalidate && !shouldRevalidationWaitForRefetech

    if (isDataUpToDate && !shouldRevalidateThisRun && !forceRun && currentPageType !== 'summary')
      return

    const shouldDoValidation = shouldRevalidateThisRun || firstRunProcessValidation
    const applicationResponses = data?.applicationBySerial?.applicationResponses
      ?.nodes as ApplicationResponse[]

    const evaluationOptions: EvaluationOptions = ['isEditable', 'isVisible', 'isRequired']

    if (shouldDoValidation) evaluationOptions.push('isValid')

    addEvaluatedResponsesToStructure({
      structure,
      applicationResponses,
      currentUser,
      currentPageType,
      evaluationOptions,
    }).then((newStructure: FullStructure) => {
      if (shouldDoValidation) {
        newStructure.lastValidationTimestamp = Date.now()
      }

      newStructure = addElementsById(newStructure)
      newStructure = updateSectionsAndPages(newStructure)

      // even though response is already added to element, we need to add Latest and Previous application response
      addApplicationResponses(newStructure, applicationResponses)

      if (shouldCalculateProgress) {
        addChangeRequestForApplicant(newStructure)

        generateApplicantChangesRequestedProgress(newStructure)

        // generateResponseProgress uses change statuses calculated in generateApplicantChangesRequestedProgress
        generateApplicantResponsesProgress(newStructure)

        // For change requests we treat application as not linear
        newStructure.info.isLinear =
          newStructure.info.isLinear && !newStructure.info.isChangeRequest
      }

      newStructure.info.currentPageType = currentPageType

      setLastProcessedTimestamp(Date.now())
      setFirstRunProcessValidation(false)
      setFullStructure(newStructure)
    })
  }, [
    lastRefetchedTimestamp,
    shouldRevalidate,
    minRefetchTimestampForRevalidation,
    error,
    structure,
    currentPageType,
  ])

  return {
    fullStructure,
    error: error?.message,
  }
}

export default useGetApplicationStructure
