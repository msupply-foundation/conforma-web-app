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
} from '../types'
import evaluateElementExpressions from '../helpers/evaluateElementExpressions'

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
      let countPages = 1
      elementsInSection.forEach((element) => {
        const section = {
          index: sectionNode.index,
          page: countPages,
        }
        if (element.elementTypePluginCode === 'pageBreak') countPages++
        templateElements.push({ ...element, section } as TemplateElementState)
      })
    })

    const currentResponses = {} as ResponsesByCode
    const currentFullResponses = {} as ResponsesFullByCode

    applicationResponses.forEach((response) => {
      const code = response.templateElement?.code
      if (code) {
        currentResponses[code] = response?.value?.text
        currentFullResponses[code] = {
          id: response?.id,
          isValid: response?.isValid ? response.isValid : false,
          ...response?.value,
          // value: response?.value,
        }
      }
    })

    setResponsesByCode(currentResponses)
    setResponsesFullByCode(currentFullResponses)
    setElementsExpressions(templateElements)
  }, [data, apolloError])

  useEffect(() => {
    if (responsesByCode && responsesFullByCode && Object.keys(responsesByCode).length > 0)
      evaluateElementExpressions({
        elementsExpressions,
        responsesByCode,
        responsesFullByCode,
      }).then((result) => {
        setElementsState(result)
        setLoading(false)
      })
  }, [responsesByCode])

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
