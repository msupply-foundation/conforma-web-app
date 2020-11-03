import { useState, useEffect } from 'react'
import {
  ApplicationResponse,
  useGetApplicationQuery,
  GetApplicationQuery,
  useGetElementsAndResponsesQuery,
} from '../generated/graphql'
import { ResponsesByCode, ApplicationElementState } from '../types'
import evaluateExpression from '@openmsupply/expression-evaluator'

interface useLoadApplicationProps {
  serialNumber: string
}

const useGetResponsesByCode = (props: useLoadApplicationProps) => {
  const { serialNumber } = props
  const [responsesByCode, setResponsesByCode] = useState({})
  const [elementsExpressions, setElementsExpressions] = useState([])
  const [elementsState, setElementsState] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { data, loading: apolloLoading, error: apolloError } = useGetElementsAndResponsesQuery({
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

    const templateSections = data?.applicationBySerial?.template?.templateSections?.nodes

    const templateElements: any = []

    templateSections?.forEach((sectionNode) => {
      sectionNode?.templateElementsBySectionId?.nodes.forEach((element) => {
        templateElements.push(element) // No idea why ...[spread] doesn't work here.
      })
    })

    const currentResponses = {} as ResponsesByCode
    // const currentElementsExpressions = {} as ApplicationElementState

    if (applicationResponses) {
      applicationResponses.forEach((response: any) => {
        const code = response?.templateElement?.code
        if (code) {
          currentResponses[code] = response?.value?.text
        }
      })
    }

    console.log('Current Responses', currentResponses)

    setResponsesByCode(currentResponses)
    setElementsExpressions(templateElements)
    setLoading(false)
  }, [data, apolloError])

  return {
    error,
    loading,
    responsesByCode,
    elementsExpressions,
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
