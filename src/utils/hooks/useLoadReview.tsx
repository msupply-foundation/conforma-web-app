import { useEffect, useState } from 'react'
import {
  ReviewResponse,
  ReviewStatus,
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
  const [isReviewLoaded, setIsReviewLoaded] = useState(false)
  const [reviewError, setReviewError] = useState<string>()
  const [checkTrigger, setCheckTrigger] = useState(false)

  const {
    error: applicationError,
    application,
    templateSections,
    isApplicationLoaded,
  } = useLoadApplication({
    serialNumber,
  })

  const { error: responsesError, responsesByCode, elementsState } = useGetResponsesAndElementState({
    serialNumber,
    isApplicationLoaded,
  })

  const { data, error, loading } = useGetReviewQuery({
    variables: {
      reviewId,
    },
    skip: !isApplicationLoaded || !elementsState,
    fetchPolicy: 'network-only',
  })

  const { triggerProcessing, error: triggerError } = useTriggerProcessing({
    checkTrigger,
    reviewId,
    // triggerType: 'reviewTrigger',
  })

  const { data: statusData, error: statusError, loading: statusLoading } = useGetReviewStatusQuery({
    variables: {
      reviewId,
    },
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
        templateSections,
        elementsState,
        responsesByCode,
        reviewResponses,
        reviewer,
      })

      setReviewSections(sectionsStructure)
      setCheckTrigger(true)
    }
  }, [data])

  useEffect(() => {
    if (!statusData) return
    const statuses = statusData?.reviewStatusHistories?.nodes as ReviewStatus[]
    if (statuses.length > 1) console.log('More than one status resulted for 1 review!')
    const status = statuses[0] // Should only have one result
    setReviewStatus(status)
    setIsReviewLoaded(true)
  }, [statusData])

  return {
    applicationName,
    isReviewLoaded,
    reviewSections,
    responsesByCode,
    loading: loading || statusLoading || triggerProcessing,
    error: error
      ? (error.message as string)
      : statusError
      ? (statusError.message as string)
      : applicationError || responsesError || reviewError || triggerError,
  }
}

export default useLoadReview
