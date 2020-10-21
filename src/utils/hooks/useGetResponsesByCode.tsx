import { useState, useEffect } from 'react'
import {
  Application,
  ApplicationResponse,
  ApplicationSection,
  useGetApplicationQuery,
  GetApplicationQuery,
} from '../generated/graphql'
import { ResponsesByCode } from '../types'

interface useLoadApplicationProps {
  serialNumber: string
}

const useGetResponsesByCode = (props: useLoadApplicationProps) => {
  const { serialNumber } = props
  const [responsesByCode, setResponsesByCode] = useState({})
  const [error, setError] = useState('')
  const { data, loading: apolloLoading, error: apolloError } = useGetApplicationQuery({
    variables: { serial: serialNumber },
  })

  useEffect(() => {
    const error = checkForApplicationErrors(data)

    if (error) {
      setError(error)
      return
    }

    if (data?.applications) {
      if (data.applications.nodes.length === 0) return
      if (data.applications.nodes.length > 1)
        console.log('More than one application returned. Only one expected!')

      const applicationResponses = data.applications.nodes[0]?.applicationResponses
        .nodes as ApplicationResponse[]

      const currentResponses = {} as ResponsesByCode

      applicationResponses.forEach((response) => {
        const code = response?.templateElement?.code
        if (code) currentResponses[code] = response?.value?.text || response?.value
      })

      setResponsesByCode(currentResponses)
    }
  }, [data, apolloError])

  return {
    apolloError,
    apolloLoading,
    error,
    responsesByCode,
  }
}

function checkForApplicationErrors(data: GetApplicationQuery | undefined) {
  if (data?.applications) {
    if (data.applications.nodes.length === 0) return 'No applications found'
    if (data.applications.nodes.length > 1)
      return 'More than one application returned. Only one expected!'
  }
  return null
}
export default useGetResponsesByCode
