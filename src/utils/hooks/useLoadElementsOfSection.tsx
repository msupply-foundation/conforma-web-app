import { useState, useEffect } from 'react'
import {
  Application,
  ApplicationResponse,
  GetSectionElementsAndResponsesQuery,
  TemplateElement,
  TemplateSection,
  useGetSectionElementsAndResponsesQuery,
} from '../generated/graphql'
import {
  ApplicationElementStates,
  ElementState,
  ResponseFull,
  ResponsesByCode,
  ResponsesFullByCode,
  SectionPagesElements,
  TemplateElementState,
} from '../types'
import evaluateElementExpressions from '../../utils/helpers/evaluateElementExpressions'

interface useLoadElementsProps {
  serialNumber: string
  sectionTempId: number
  isApplicationLoaded?: boolean
}

const useLoadElementsOfSection = ({
  serialNumber,
  sectionTempId,
  isApplicationLoaded = true,
}: useLoadElementsProps) => {
  const [responsesByCode, setResponsesByCode] = useState<ResponsesByCode>()
  const [responsesFullByCode, setResponsesFullByCode] = useState<ResponsesFullByCode>()
  const [elementsExpressions, setElementsExpressions] = useState<TemplateElementState[]>([])
  const [elements, setElements] = useState<SectionPagesElements>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const {
    data,
    loading: apolloLoading,
    error: apolloError,
  } = useGetSectionElementsAndResponsesQuery({
    variables: {
      serial: serialNumber,
      sectionId: sectionTempId,
    },
    skip: !isApplicationLoaded,
  })

  useEffect(() => {
    if (!data) return
    if (apolloError) return

    const error = checkForElementErrors(data)

    if (error) {
      setError(error)
      setLoading(false)
      return
    }

    const applicationResponses = data?.applicationBySerial?.applicationResponses
      .nodes as ApplicationResponse[]

    const templateSection = data?.applicationBySerial?.template?.templateSections
      .nodes[0] as TemplateSection

    const templateElements = [] as TemplateElementState[]

    const elementsInSection = templateSection.templateElementsBySectionId
      ?.nodes as TemplateElement[]

    let countPages = 1
    elementsInSection.forEach((element) => {
      const section = {
        index: templateSection.index,
        page: countPages,
      }
      if (element.elementTypePluginCode === 'pageBreak') countPages++
      templateElements.push({ ...element, section } as TemplateElementState)
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
          value: response?.value,
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
      }).then((result: ApplicationElementStates) => {
        const elements: SectionPagesElements = Object.values(result).reduce(
          (elementsPerPage: SectionPagesElements, element: ElementState) => {
            const {
              section: { page },
              code,
            } = element

            const currentPageElements = elementsPerPage[page] ? elementsPerPage[page] : []

            currentPageElements.push({
              element,
              response: responsesFullByCode[code] as ResponseFull,
            })

            return {
              ...elementsPerPage,
              [page]: currentPageElements,
            }
          },
          {}
        )
        setElements(elements)
        setLoading(false)
      })
  }, [responsesByCode])

  return {
    apolloLoading,
    apolloError,
    error,
    loading,
    elements,
    responsesByCode,
    responsesFullByCode,
  }
}

function checkForElementErrors(data: GetSectionElementsAndResponsesQuery | undefined) {
  if (!data?.applicationBySerial) return 'Data undefined'
  const application = data?.applicationBySerial as Application
  if (!application.applicationResponses || !application.template?.templateSections)
    return 'Application missing parameters'
  if (application.template?.templateSections.nodes.length === 0) return 'No sections found'
  if (application.template?.templateSections.nodes.length > 1) return 'More than 1 section found'
  const section = application.template?.templateSections.nodes[0] as TemplateSection
  const missingElements = section.templateElementsBySectionId.nodes.some((element) => !element)
  if (missingElements) return 'Application missing elements'
  // TODO: Make checking for all 'QUESTION' elements have responses associated
  return null
}

export default useLoadElementsOfSection
