import { useEffect, useState } from 'react'
import { ApolloError } from '@apollo/client'
import { ReviewResponse, useGetReviewQuery } from '../generated/graphql'
import { SectionStructure } from '../types'
import useLoadApplication from './useLoadApplication'
import useGetResponsesAndElementState from './useGetResponsesAndElementState'
import useTriggerProcessing from './useTriggerProcessing'
import buildSectionsStructure from '../helpers/buildSectionsStructure'

interface UseLoadReviewProps {
  reviewId: number
  serialNumber: string
}

const useLoadReview = ({ reviewId, serialNumber }: UseLoadReviewProps) => {
  const [applicationName, setApplicationName] = useState<string>('')
  const [reviewSections, setReviewSections] = useState<SectionStructure>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const {
    error: applicationError,
    application,
    templateSections,
    isApplicationLoaded,
  } = useLoadApplication({
    serialNumber,
  })

  const { triggerProcessing, error: triggerError } = useTriggerProcessing({
    reviewId,
    // triggerType: 'reviewTrigger',
  })

  const { error: responsesError, responsesByCode, elementsState } = useGetResponsesAndElementState({
    serialNumber,
    isApplicationLoaded,
  })

  const { data, error: apolloError, loading: apolloLoading } = useGetReviewQuery({
    variables: {
      reviewId,
    },
    skip: triggerProcessing || !isApplicationLoaded || !elementsState,
  })

  useEffect(() => {
    if (applicationError) {
      const error = applicationError as ApolloError
      setError(error.message)
      return
    }
    if (application) setApplicationName(application.name)
  }, [applicationError, application])

  useEffect(() => {
    if (responsesError) {
      setError(responsesError)
      return
    }
    if (apolloError) {
      setError(apolloError.message)
      return
    }
    if (data?.review?.reviewResponses && elementsState && responsesByCode) {
      const reviewResponses = data?.review?.reviewResponses.nodes as ReviewResponse[]
      const sectionsStructure = buildSectionsStructure({
        templateSections,
        elementsState,
        responsesByCode,
        reviewResponses,
      })

      setReviewSections(sectionsStructure)
      setLoading(false)
    }
  }, [responsesError, apolloError, data])

  return {
    applicationName,
    reviewSections,
    responsesByCode,
    loading: loading || triggerProcessing,
    error: error || triggerError,
  }
}

export default useLoadReview
