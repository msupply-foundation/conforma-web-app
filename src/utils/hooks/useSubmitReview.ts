import { useState } from 'react'
import { useUpdateReviewMutation } from '../generated/graphql'
interface UseSubmitReviewProps {
  reviewId: number
}

const useSubmitReview = ({ reviewId }: UseSubmitReviewProps) => {
  const [submitted, setSubmitted] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const [submitReviewMutation] = useUpdateReviewMutation({
    onCompleted: () => setProcessing(false),
    onError: (submitionError) => {
      setError(submitionError.message)
      setProcessing(false)
    },
  })

  const submit = () => {
    setSubmitted(true)
    setProcessing(true)
    submitReviewMutation({
      variables: { reviewId },
    })
  }

  return {
    error,
    processing,
    submitted,
    submit,
  }
}

export default useSubmitReview
