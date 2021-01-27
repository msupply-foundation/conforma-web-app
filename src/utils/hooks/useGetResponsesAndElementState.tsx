import { useState, useEffect } from 'react'
import {
  useGetElementsAndResponsesQuery,
  GetElementsAndResponsesQuery,
  ApplicationResponse,
  TemplateSection,
  TemplateElement,
  Application,
} from '../generated/graphql'
import { useUserState } from '../../contexts/UserState'
import {
  ResponsesByCode,
  TemplateElementState,
  ApplicationElementStates,
  ElementState,
  UseGetApplicationProps,
} from '../types'
import evaluateExpression from '@openmsupply/expression-evaluator'

const useGetResponsesAndElementState = ({
  serialNumber,
  isApplicationReady,
}: UseGetApplicationProps) => {
  const [responsesByCode, setResponsesByCode] = useState<ResponsesByCode>()
  const [elementsExpressions, setElementsExpressions] = useState<TemplateElementState[]>([])
  const [elementsState, setElementsState] = useState<ApplicationElementStates>()
  const [responsesError, setResponsesError] = useState<string>()
  const [loading, setLoading] = useState(true)
  const {
    userState: { currentUser },
  } = useUserState()
  const { data, error: apolloError } = useGetElementsAndResponsesQuery({
    variables: { serial: serialNumber },
    skip: !isApplicationReady,
  })

  useEffect(() => {
    if (!isApplicationReady) {
      return
    }

    const error = checkForApplicationErrors(data)

    if (error) {
      setResponsesError(error)
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
      let count = 1
      const elementsInSection = sectionNode.templateElementsBySectionId?.nodes as TemplateElement[]
      elementsInSection.forEach((element) => {
        if (element.elementTypePluginCode === 'pageBreak') count++
        else
          templateElements.push({
            ...element,
            pluginCode: element.elementTypePluginCode,
            sectionIndex: sectionNode.index,
            sectionCode: sectionNode.code,
            elementIndex: element.index,
            page: count,
          } as TemplateElementState)
      })
    })

    const currentResponses = {} as ResponsesByCode

    applicationResponses.forEach((response) => {
      const code = response.templateElement?.code
      if (code) {
        currentResponses[code] = {
          id: response.id,
          isValid: response?.isValid,
          ...response?.value,
        }
      }
    })

    setResponsesByCode(currentResponses)
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
      objects: { responses: responsesByCode, currentUser },
      // TO-DO: Also send org objects etc.
      // graphQLConnection: TO-DO
    }
    const isEditable = evaluateExpression(element.isEditable, evaluationParameters)
    const isRequired = evaluateExpression(element.isRequired, evaluationParameters)
    const isVisible = evaluateExpression(element.visibilityCondition, evaluationParameters)
    // TO-DO: Evaluate element parameters (in 'parameters' field, but unique to each element type)
    const results = await Promise.all([isEditable, isRequired, isVisible])
    const evaluatedElement = {
      id: element.id,
      code: element.code,
      title: element.title,
      category: element.category,
      parameters: element.parameters,
      pluginCode: element.pluginCode,
      sectionIndex: element.sectionIndex,
      sectionCode: element.sectionCode,
      elementIndex: element.elementIndex,
      validation: element.validation,
      validationMessage: element.validationMessage,
      page: element.page,
      isEditable: results[0] as boolean,
      isRequired: results[1] as boolean,
      isVisible: results[2] as boolean,
    }

    return evaluatedElement
  }

  return {
    error: apolloError ? (apolloError.message as string) : responsesError,
    loading,
    responsesByCode,
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
