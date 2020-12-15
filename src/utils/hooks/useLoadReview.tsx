import { useEffect, useState } from 'react'
import { ApolloError } from '@apollo/client'
import {
  ApplicationResponse,
  ReviewResponse,
  TemplateElement,
  useGetReviewQuery,
} from '../generated/graphql'
import { ApplicationElementStates, SectionElementStates } from '../types'
import useLoadApplication from './useLoadApplication'
import useGetResponsesAndElementState from './useGetResponsesAndElementState'
import getPageElements from '../helpers/getPageElements'

interface UseLoadReviewProps {
  reviewId: number
  serialNumber: string
}

const useLoadReview = ({ reviewId, serialNumber }: UseLoadReviewProps) => {
  const [applicationName, setApplicationName] = useState<string>('')
  const [reviewSections, setReviewSections] = useState<SectionElementStates[]>()
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

  const { error: responsesError, responsesByCode, elementsState } = useGetResponsesAndElementState({
    serialNumber,
    isApplicationLoaded,
  })

  const { data, error: apolloError, loading: apolloLoading } = useGetReviewQuery({
    variables: {
      reviewId,
    },
    skip: !isApplicationLoaded || !elementsState,
  })

  const getResponse = (code: string) =>
    responsesByCode && responsesByCode[code] ? responsesByCode[code] : null
  }

  useEffect(() => {
    if (applicationError) {
      const error = applicationError as ApolloError
      setError(error.message)
      return
    }
    if (application) setApplicatioName(application.name)
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
    if (data && data.review && data.review.reviewResponses) {
      // TODO: See if this code can be merged with one in ApplicationOverview - very similar
      const reviewBySection: SectionElementStates[] = templateSections
        .sort((a, b) => a.index - b.index)
        .map((section) => {
          const sectionDetails = {
            title: section.title,
            code: section.code,
          }
          const pageNumbers = Array.from(Array(section.totalPages).keys(), (n) => n + 1)
          const pages = pageNumbers.reduce((pages, pageNumber) => {
            const elements = getPageElements({
              elementsState: elementsState as ApplicationElementStates,
              sectionIndex: section.index,
              pageNumber: pageNumber,
            })
            if (elements.length === 0) return pages
            const reviewResponses = data?.review?.reviewResponses.nodes as ReviewResponse[]

            const elementsReviews = elements.map((element) => {
              const response = getResponse(element.code)
              const review = response
                ? reviewResponses.find(({ applicationResponse }) => {
                    return response.id === applicationResponse?.id
                  })
                : undefined

              const elementState = {
                element,
                response,
              }
              if (!review) return elementState
              return {
                ...elementState,
                review: {
                  decision: review.decision ? review.decision : undefined,
                  comment: review.comment ? review.comment : '',
                },
              }
            })
            const pageName = `Page ${pageNumber}`
            return { ...pages, [pageName]: elementsReviews }
          }, {})
          return { section: sectionDetails, pages }
        })
      setReviewSections(reviewBySection)
      setLoading(false)
    }
  }, [responsesError, apolloError, data])

  return {
    applicationName,
    loading,
    error,
    reviewSections,
  }
}

export default useLoadReview
