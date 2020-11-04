import { useState, useEffect } from 'react'
import {
  ApplicationResponse,
  useGetApplicationQuery,
  GetApplicationQuery,
  useGetElementsAndResponsesQuery,
} from '../generated/graphql'
import { ResponsesByCode, ResponsesFullByCode, ApplicationElementState } from '../types'
import evaluateExpression from '@openmsupply/expression-evaluator'

interface useLoadApplicationProps {
  serialNumber: string
}

const useGetResponsesAndElementState = (props: useLoadApplicationProps) => {
  const { serialNumber } = props
  const [responsesByCode, setResponsesByCode] = useState({})
  const [responsesFullByCode, setResponsesFullByCode] = useState({})
  const [elementsExpressions, setElementsExpressions] = useState([])
  const [elementsState, setElementsState] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { data, loading: apolloLoading, error: apolloError } = useGetElementsAndResponsesQuery({
    variables: { serial: serialNumber },
  })

  useEffect(() => {
    const error = checkForApplicationErrors(data)

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
    const currentFullResponses = {} as ResponsesFullByCode
    // const currentElementsExpressions = {} as ApplicationElementState

    if (applicationResponses) {
      applicationResponses.forEach((response: any) => {
        const code = response?.templateElement?.code
        if (code) {
          currentResponses[code] = response?.value?.text
          currentFullResponses[code] = response?.value
        }
      })
    }

    console.log('Current Responses', currentResponses)

    setResponsesByCode(currentResponses)
    setResponsesFullByCode(currentFullResponses)
    setElementsExpressions(templateElements)
    setLoading(false)
  }, [data, apolloError])

  useEffect(() => {
    evaluateElementExpressions().then((result: any) => setElementsState(result))
  }, [responsesByCode])

  async function evaluateElementExpressions() {
    const promiseArray: Promise<any>[] = []
    elementsExpressions.forEach((element) => {
      promiseArray.push(evaluateSingleElement(element))
    })
    const evaluatedElements = await Promise.all(promiseArray)
    const elementsState: any = {}
    evaluatedElements.forEach((element) => {
      elementsState[element.code] = {
        id: element.id,
        category: element.category,
        isEditable: element.isEditable,
        isRequired: element.isRequired,
        isVisible: element.isVisible,
        // isValid: element.isValid,
      }
    })
    return elementsState
  }

  async function evaluateSingleElement(element: any) {
    const evaluationParameters = {
      objects: [responsesByCode, responsesFullByCode], // TO-DO: Also send user/org objects etc.
      // graphQLConnection: TO-DO
    }
    const isEditable = evaluateExpression(element.isEditable)
    const isRequired = evaluateExpression(element.isRequired)
    const isVisible = evaluateExpression(element.visibilityCondition)
    // const isValid = evaluateExpression(element.validation)
    const results = await Promise.all([isEditable, isRequired, isVisible])
    const evaluatedElement = {
      code: element.code,
      id: element.id,
      category: element.category,
      isEditable: results[0],
      isRequired: results[1],
      isVisible: results[2],
      // isValid: results[3],
    }
    return evaluatedElement
  }

  return {
    error,
    loading,
    responsesByCode,
    responsesFullByCode,
    elementsState,
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
export default useGetResponsesAndElementState
