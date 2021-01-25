import { useEffect, useState } from 'react'
import { ApolloError } from '@apollo/client'
import { ReviewResponse, useGetReviewQuery, User } from '../generated/graphql'
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
  const [loading, setLoading] = useState(true)
  const [reviewError, setReviewError] = useState<string>()

  const {
    error: applicationError,
    application,
    templateSections,
    isApplicationLoaded,
  } = useLoadApplication({
    serialNumber,
  })

  const { triggerProcessing, error: triggerError } = useTriggerProcessing({
    checkTrigger: isApplicationLoaded,
    reviewId,
    // triggerType: 'reviewTrigger',
  })

  const { error: responsesError, responsesByCode, elementsState } = useGetResponsesAndElementState({
    serialNumber,
    isApplicationLoaded,
  })

  const { data, error, loading: apolloLoading } = useGetReviewQuery({
    variables: {
      reviewId,
    },
    skip: triggerProcessing || !isApplicationLoaded || !elementsState,
  })

  useEffect(() => {
    if (application) setApplicationName(application.name)
  }, [application])

  useEffect(() => {
    if (!apolloLoading && !data?.review) {
      setReviewError('No review found')
    }

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
      setLoading(false)
    }
  }, [data])

  return {
    applicationName,
    reviewSections,
    responsesByCode,
    loading: loading || triggerProcessing,
    error: applicationError || responsesError || reviewError || triggerError,
  }
}

export default useLoadReview
