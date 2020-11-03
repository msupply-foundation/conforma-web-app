import { useState, useEffect } from 'react'
import {
  ApplicationResponse,
  useGetApplicationQuery,
  GetApplicationQuery,
  useGetResponsesQuery,
} from '../generated/graphql'
import { ResponsesByCode } from '../types'
import { evaluateExpression } from '@openmsupply/expression-evaluator'

interface useLoadApplicationProps {
  serialNumber: string
}

const useGetResponsesByCode = (props: useLoadApplicationProps) => {
  const { serialNumber } = props
  const [responsesByCode, setResponsesByCode] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { data, loading: apolloLoading, error: apolloError } = useGetResponsesQuery({
    variables: { serial: serialNumber },
  })

  useEffect(() => {
    // const error = checkForApplicationErrors(data)

    if (error) {
      setError(error)
      setLoading(false)
      return
    }

    if (apolloError) return

    const applicationResponses = data?.applicationBySerial?.applicationResponses?.nodes

    console.log('Responses:', applicationResponses)

    const currentResponses = {} as ResponsesByCode

    if (applicationResponses) {
      applicationResponses.forEach((response: any) => {
        const code = response?.templateElement?.code
        if (code) {
          currentResponses[code] = {
            category: response.templateElement.category,
            isRequired: response.templateElement.isRequired,
            isEditable: response.templateElement.isEditable,
            isValid: evaluateExpression(response.templateElement.validation),
            isVisible: response.templateElement.visibilityCondition,
            validationMessage: response.templateElement.validationMessage,
            responseId: response.id,
            responseJSON: response?.value,
            responseValue: response?.value?.text,
          }
        }
      })
    }

    setResponsesByCode(currentResponses)
    setLoading(false)
  }, [data, apolloError])

  return {
    apolloError,
    apolloLoading,
    loading,
    error,
    responsesByCode,
  }
}

// function checkForApplicationErrors(data: GetApplicationQuery | undefined) {
//   if (data?.applications) {
//     if (data.applications.nodes.length === 0) return 'No applications found'
//     if (data.applications.nodes.length > 1)
//       return 'More than one application returned. Only one expected!'
//   }
//   return null
// }
export default useGetResponsesByCode
