import { useState } from 'react'
import { Trigger, useUpdateApplicationMutation } from '../generated/graphql'

interface useUpdateApplicationProps {
  applicationSerial: string
  applicationTrigger: Trigger
}

const useUpdateApplication = ({
  applicationSerial,
  applicationTrigger,
}: useUpdateApplicationProps) => {
  const [submitted, setSubmitted] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [applicationSubmitMutation] = useUpdateApplicationMutation({
    onCompleted: () => {
      setProcessing(false)
      setSubmitted(true)
    },
  })

  const submit = () => {
    setProcessing(true)
    applicationSubmitMutation({
      variables: {
        serial: applicationSerial,
        applicationTrigger,
      },
    })
  }

  return {
    submitted,
    processing,
    error,
    submit,
  }
}

export default useUpdateApplication
