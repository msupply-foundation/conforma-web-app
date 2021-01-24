import { useEffect, useState } from 'react'
import {
  ApplicationResponse,
  useGetElementsAndResponsesQuery,
  useUpdateApplicationMutation,
} from '../generated/graphql'
import { UseGetApplicationProps } from '../types'

const useSubmitApplication = ({ serialNumber }: UseGetApplicationProps) => {
  const [submitted, setSubmitted] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  // Hook to get existing responses in cache - triggered when user submits application
  const { data, error: responsesError } = useGetElementsAndResponsesQuery({
    variables: {
      serial: serialNumber,
    },
    skip: !submitted,
    fetchPolicy: 'cache-only',
  })

  const [applicationSubmitMutation] = useUpdateApplicationMutation({
    onCompleted: () => {
      setProcessing(false)
    },
    onError: (submissionError) => {
      setProcessing(false)
      setError(submissionError.message)
    },
  })

  useEffect(() => {
    if (responsesError) {
      setProcessing(false)
      setError(responsesError.message)
    }
    if (
      !data?.applicationBySerial?.applicationResponses ||
      data?.applicationBySerial?.applicationResponses.nodes.length === 0
    )
      return

    // Transform in array to be included in update patch
    const responses = data?.applicationBySerial?.applicationResponses.nodes as ApplicationResponse[]
    const responsesPatch = responses.map((response) => {
      return { id: response.id, patch: { value: response?.value } }
    })

    // Send Application in one-block mutation to update Application + Responses
    applicationSubmitMutation({
      variables: {
        serial: serialNumber,
        responses: responsesPatch,
      },
    })
  }, [data, responsesError])

  const submit = () => {
    setSubmitted(true)
    setProcessing(true)
    // TO-DO: Whole Application Validity Check here (Use Nicole's validatePage method)
  }

  return {
    submitted,
    processing,
    error,
    submit,
  }
}

export default useSubmitApplication
