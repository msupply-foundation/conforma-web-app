import { useEffect, useState } from 'react'
import {
  ReviewResponse,
  ReviewStatus,
  ReviewStatusHistory,
  useGetReviewQuery,
  useGetReviewStatusQuery,
  User,
} from '../generated/graphql'
import { SectionStructure } from '../types'
import useLoadApplication from './useLoadApplication'
import useGetResponsesAndElementState from './useGetResponsesAndElementState'
import useTriggerProcessing from './useTriggerProcessing'
import buildSectionsStructure from '../helpers/application/buildSectionsStructure'

interface UseLoadReviewProps {
  reviewId: number
  serialNumber: string
}

const useLoadReview = ({ reviewId, serialNumber }: UseLoadReviewProps) => {
  const [applicationName, setApplicationName] = useState<string>('')
  const [reviewSections, setReviewSections] = useState<SectionStructure>()
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>()
  const [isReviewReady, setIsReviewReady] = useState(false)
  const [isReviewLoaded, setIsReviewLoaded] = useState(false)
  const [reviewError, setReviewError] = useState<string>()

  const { error: applicationError, application, sections, isApplicationReady } = useLoadApplication(
    {
      serialNumber,
    }
  )

  const { error: responsesError, responsesByCode, elementsState } = useGetResponsesAndElementState({
    serialNumber,
    isApplicationReady,
  })

  const { data, error, loading } = useGetReviewQuery({
    variables: {
      reviewId,
    },
    skip: !isApplicationReady || !elementsState,
    fetchPolicy: 'network-only',
  })

  const { error: triggerError, isTriggerProcessing } = useTriggerProcessing({
    isReviewLoaded: isReviewReady,
    reviewId,
    // triggerType: 'reviewTrigger',
  })

  const { data: statusData, error: statusError } = useGetReviewStatusQuery({
    variables: {
      reviewId,
    },
    skip: !isReviewLoaded || isTriggerProcessing,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!data) return

    if (!loading && !data?.review) {
      setReviewError('No review found')
    }

    if (application) setApplicationName(application.name)
    if (data?.review?.reviewResponses && elementsState && responsesByCode) {
      const reviewResponses = data.review.reviewResponses.nodes as ReviewResponse[]
      const reviewer = data.review.reviewer as User
      const sectionsStructure = buildSectionsStructure({
        sections,
        elementsState,
        responsesByCode,
        reviewResponses,
        reviewer,
      })

      setReviewSections(sectionsStructure)
      setIsReviewLoaded(true)
    }
  }, [data])

  useEffect(() => {
    if (!statusData) return
    const statuses = statusData?.reviewStatusHistories?.nodes as ReviewStatusHistory[]
    if (statuses.length > 1) console.log('More than one status resulted for 1 review!')

    const { status } = statuses[0] // Should only have one result
    setReviewStatus(status as ReviewStatus)
    setIsReviewReady(true)
  }, [statusData])

  return {
    applicationName,
    isReviewReady,
    reviewSections,
    reviewStatus,
    responsesByCode,
    error: error
      ? (error.message as string)
      : statusError
      ? (statusError.message as string)
      : applicationError || responsesError || reviewError || triggerError,
  }
}

export default useLoadReview
