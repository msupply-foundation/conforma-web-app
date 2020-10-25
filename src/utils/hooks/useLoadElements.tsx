import { useState, useEffect } from 'react'
import {
  GetSectionElementsQuery,
  TemplateElement,
  TemplateElementCategory,
  useGetSectionElementsQuery,
} from '../generated/graphql'
import { ElementAndResponse, SectionPages } from '../types'

interface useLoadElementsProps {
  applicationId: number
  sectionTempId: number
  sectionPage: number
}

const useLoadElements = ({ applicationId, sectionTempId, sectionPage }: useLoadElementsProps) => {
  const [currentPageElements, setElements] = useState<ElementAndResponse[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const currentPageIndex = sectionPage - 1

  const { data, loading: apolloLoading, error: apolloError } = useGetSectionElementsQuery({
    variables: {
      applicationId,
      sectionId: sectionTempId,
    },
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

    const templateElements = data?.templateElements?.nodes as TemplateElement[]

    let elementsByPage = [] as SectionPages
    let countPage = 0
    elementsByPage[countPage] = [] as ElementAndResponse[]

    // Build object with elements and responses in each page
    templateElements.forEach((element) => {
      const { elementTypePluginCode: code } = element
      if (code === 'pageBreak') elementsByPage[++countPage] = [] as ElementAndResponse[]
      else {
        const { applicationResponses, category } = element
        // Store one response per question or null for element with information category
        const response =
          category === TemplateElementCategory.Question ? applicationResponses.nodes[0] : null
        // const { applicationResponses, ...question } = element
        // TODO: Remove the responsesConnection from each question/information element
        elementsByPage[countPage].push({ question: element, response })
      }
    })
    // Set the current page elements and reesponses in local state
    const elementsInPage = elementsByPage[currentPageIndex]
    setElements(elementsInPage)
    setLoading(false)
  }, [data, apolloError, currentPageIndex])

  return {
    apolloLoading,
    apolloError,
    error,
    loading,
    elements: currentPageElements,
  }
}

function checkForElementErrors(data: GetSectionElementsQuery | undefined) {
  if (data?.templateElements) {
    if (data.templateElements.nodes.length === 0) return 'No elements found'
    const elements = data.templateElements.nodes as TemplateElement[]
    elements.forEach((element) => {
      const { applicationResponses, category, code } = element
      if (category === TemplateElementCategory.Question && applicationResponses) {
        if (applicationResponses.nodes.length === 0) return `Missing response for question ${code}`
        if (applicationResponses.nodes.length > 1)
          return `Unexpected more than one response to question ${code}`
      }
    })
  }
  return null
}

export default useLoadElements
