import { useEffect, useState } from 'react'
import {
  ReviewResponse,
  ReviewStatus,
  ReviewStatusHistory,
  useGetReviewQuery,
  useGetReviewStatusQuery,
  User,
} from '../generated/graphql'
import { SectionsStructure } from '../types'
import useTriggerProcessing from './useTriggerProcessing'
import updateSectionsReviews from '../helpers/review/updateSectionsReviews'

interface UseLoadReviewProps {
  reviewId: number
  isApplicationReady: boolean
  sectionsStructure?: SectionsStructure
}

const useLoadReview = ({ reviewId, isApplicationReady, sectionsStructure }: UseLoadReviewProps) => {
  const [reviewSections, setReviewSections] = useState<SectionsStructure>()
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>()
  const [reviewResponses, setReviewResponses] = useState<ReviewResponse[]>()
  const [reviewer, setReviewer] = useState<User>()
  const [reviewError, setReviewError] = useState<string>()
  const [isProcessingProgress, setIsProcessingProgress] = useState(false)

  const { data, error, loading: reviewLoading } = useGetReviewQuery({
    variables: {
      reviewId,
    },
    skip: !isApplicationReady,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (reviewLoading) {
      setReviewSections(undefined)
      setIsProcessingProgress(true)
    }
  }, [reviewLoading])

  const { error: triggerError, isTriggerProcessing } = useTriggerProcessing({
    isReviewLoaded: !reviewLoading,
    reviewId,
    // triggerType: 'reviewTrigger',
  })

  const { data: statusData, error: statusError, loading: loadingStatus } = useGetReviewStatusQuery({
    variables: {
      reviewId,
    },
    skip: reviewLoading || isTriggerProcessing,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!data) return

    if (!reviewLoading && !data?.review) {
      setReviewError('No review found')
    }
    setReviewSections(undefined)
    setIsProcessingProgress(true)

    if (data?.review?.reviewResponses && sectionsStructure && isApplicationReady) {
      const reviewResponses = data.review.reviewResponses.nodes as ReviewResponse[]
      const reviewer = data.review.reviewer as User
      setReviewResponses(reviewResponses)
      setReviewer(reviewer)
    }
  }, [data])

  useEffect(() => {
    if (!isProcessingProgress || !sectionsStructure || !reviewResponses || !reviewer) return
    const reviewStructure = updateSectionsReviews({
      sectionsStructure,
      reviewResponses,
      reviewer,
    })

    setReviewSections(reviewStructure)
    setIsProcessingProgress(false)
  }, [reviewResponses, reviewer])

  useEffect(() => {
    if (!statusData) return
    const statuses = statusData?.reviewStatusHistories?.nodes as ReviewStatusHistory[]
    if (statuses.length > 1) console.log('More than one status resulted for 1 review!')

    const { status } = statuses[0] // Should only have one result
    setReviewStatus(status as ReviewStatus)
  }, [statusData])

  return {
    loading: reviewLoading && loadingStatus && isTriggerProcessing && isProcessingProgress,
    reviewSections: sectionsStructure || reviewSections,
    reviewStatus,
    error: error
      ? (error.message as string)
      : statusError
      ? (statusError.message as string)
      : reviewError || triggerError,
  }
}

export default useLoadReview
