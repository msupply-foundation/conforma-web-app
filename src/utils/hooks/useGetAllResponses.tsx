import { useState, useEffect } from 'react'
import {
  Application,
  ApplicationResponse,
  ApplicationSection,
  useGetApplicationQuery,
} from '../generated/graphql'
import { ResponsesByCode } from '../types'

interface useLoadApplicationProps {
  serialNumber: number
}

const useGetAllResponses = (props: useLoadApplicationProps) => {
  const { serialNumber } = props
  const [responsesByCode, setResponsesByCode] = useState({})
  const { data, loading, error } = useGetApplicationQuery({
    variables: { serial: serialNumber },
  })

  useEffect(() => {
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
  }, [data, error])

  return {
    error,
    loading,
    responsesByCode,
  }
}

export default useGetAllResponses
