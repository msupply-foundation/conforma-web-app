import { useState, useEffect } from 'react'
import {
  useGetElementsAndResponsesQuery,
  GetElementsAndResponsesQuery,
  ApplicationResponse,
  TemplateSection,
  TemplateElement,
  Application,
} from '../generated/graphql'
import {
  ResponsesByCode,
  ResponsesFullByCode,
  TemplateElementState,
  ApplicationElementStates,
  ElementState,
} from '../types'
import evaluateExpression from '@openmsupply/expression-evaluator'

interface useGetResponsesAndElementStateProps {
  serialNumber: string
  isApplicationLoaded: boolean
}

const useGetResponsesAndElementState = (props: useGetResponsesAndElementStateProps) => {
  const { serialNumber, isApplicationLoaded } = props
  const [responsesByCode, setResponsesByCode] = useState<ResponsesByCode>()
  const [responsesFullByCode, setResponsesFullByCode] = useState<ResponsesFullByCode>()
  const [elementsExpressions, setElementsExpressions] = useState<TemplateElementState[]>([])
  const [elementsState, setElementsState] = useState<ApplicationElementStates>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { data, loading: apolloLoading, error: apolloError } = useGetElementsAndResponsesQuery({
    variables: { serial: serialNumber },
    skip: !isApplicationLoaded,
  })

  useEffect(() => {
    if (!isApplicationLoaded) {
      return
    }

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

    const templateElements = [] as TemplateElementState[]

    templateSections.forEach((sectionNode) => {
      const elementsInSection = sectionNode.templateElementsBySectionId?.nodes as TemplateElement[]
      elementsInSection.forEach((element) => {
        templateElements.push({ ...element, section: sectionNode.index } as TemplateElementState)
      })
    })

    const currentResponses = {} as ResponsesByCode
    const currentFullResponses = {} as ResponsesFullByCode

    applicationResponses.forEach((response) => {
      const code = response?.templateElement?.code
      if (code) {
        currentResponses[code] = response?.value?.text
        currentFullResponses[code] = { isValid: response?.isValid, ...response?.value }
      }
    })

    setResponsesByCode(currentResponses)
    setResponsesFullByCode(currentFullResponses)
    setElementsExpressions(templateElements)
  }, [data, apolloError])

  useEffect(() => {
    if (responsesByCode && Object.keys(responsesByCode).length > 0)
      evaluateElementExpressions().then((result) => {
        setElementsState(result)
        setLoading(false)
      })
  }, [responsesByCode])

  async function evaluateElementExpressions() {
    const promiseArray: Promise<ElementState>[] = []
    elementsExpressions.forEach((element) => {
      promiseArray.push(evaluateSingleElement(element))
    })
    const evaluatedElements = await Promise.all(promiseArray)
    const elementsState: ApplicationElementStates = {}
    evaluatedElements.forEach((element) => {
      elementsState[element.code] = element
    })
    return elementsState
  }

  async function evaluateSingleElement(element: TemplateElementState): Promise<ElementState> {
    const evaluationParameters = {
      objects: [responsesByCode as ResponsesByCode, responsesFullByCode as ResponsesFullByCode], // TO-DO: Also send user/org objects etc.
      // graphQLConnection: TO-DO
    }
    const isEditable = evaluateExpression(element.isEditable, evaluationParameters)
    const isRequired = evaluateExpression(element.isRequired, evaluationParameters)
    const isVisible = evaluateExpression(element.visibilityCondition, evaluationParameters)
    // TO-DO: Evaluate element paremeters (in 'parameters' field, but unique to each element type)
    const results = await Promise.all([isEditable, isRequired, isVisible])
    const evaluatedElement = {
      id: element.id,
      code: element.code,
      title: element.title,
      parameters: element.parameters,
      elementTypePluginCode: element.elementTypePluginCode,
      section: element.section as number,
      category: element.category,
      isEditable: results[0] as boolean,
      isRequired: results[1] as boolean,
      isVisible: results[2] as boolean,
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
  if (!data?.applicationBySerial) return 'Data undefined'
  const application = data?.applicationBySerial as Application
  if (!application.applicationResponses || !application.template?.templateSections)
    return 'Application missing parameters'
  if (application.template?.templateSections.nodes.length === 0) return 'No sections found'
  if (application.applicationResponses.nodes.length === 0) return 'No responses found'
  application.template?.templateSections.nodes.forEach((section) => {
    const missingElements = section?.templateElementsBySectionId.nodes.some((element) => !element)
    if (missingElements) return 'Application missing elements'
  })
  return null
}
export default useGetResponsesAndElementState
