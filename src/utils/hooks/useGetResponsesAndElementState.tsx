import { useState, useEffect } from 'react'
import {
  useGetElementsAndResponsesQuery,
  GetElementsAndResponsesQuery,
  ApplicationResponse,
  TemplateSection,
  TemplateElement,
} from '../generated/graphql'
import {
  ResponsesByCode,
  ResponsesFullByCode,
  TemplateElementState,
  EvaluatedElement,
} from '../types'
import evaluateExpression from '@openmsupply/expression-evaluator'

const useGetResponsesAndElementState = (props: { serialNumber: string }) => {
  const { serialNumber } = props
  const [responsesByCode, setResponsesByCode] = useState({})
  const [responsesFullByCode, setResponsesFullByCode] = useState({})
  const [elementsExpressions, setElementsExpressions] = useState([{}])
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

    const applicationResponses = data?.applicationBySerial?.applicationResponses
      .nodes as ApplicationResponse[]

    const templateSections = data?.applicationBySerial?.template?.templateSections
      .nodes as TemplateSection[]

    const templateElements: TemplateElementState[] = []

    templateSections.forEach((sectionNode) => {
      const elementsInSection = sectionNode.templateElementsBySectionId?.nodes as TemplateElement[]
      elementsInSection.forEach((element) => {
        templateElements.push(element as TemplateElementState) // No idea why ...[spread] doesn't work here.
      })
    })

    const currentResponses = {} as ResponsesByCode
    const currentFullResponses = {} as ResponsesFullByCode

    applicationResponses.forEach((response) => {
      const code = response?.templateElement?.code
      if (code) {
        currentResponses[code] = response?.value?.text
        currentFullResponses[code] = response?.value
      }
    })

    setResponsesByCode(currentResponses)
    setResponsesFullByCode(currentFullResponses)
    setElementsExpressions(templateElements)
    setLoading(false)
  }, [data, apolloError])

  useEffect(() => {
    evaluateElementExpressions().then((result) => setElementsState(result))
  }, [responsesByCode])

  async function evaluateElementExpressions() {
    const promiseArray: Promise<EvaluatedElement>[] = []
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

  async function evaluateSingleElement(element: any): Promise<EvaluatedElement> {
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
      isEditable: results[0] as boolean,
      isRequired: results[1] as boolean,
      isVisible: results[2] as boolean,
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

function checkForApplicationErrors(data: GetElementsAndResponsesQuery | undefined) {
  if (data?.applicationBySerial?.applicationResponses?.nodes) return 'Data undefined'
  if (data?.applicationBySerial?.applicationResponses?.nodes.length === 0)
    return 'No responses found'
  return null
}
export default useGetResponsesAndElementState
