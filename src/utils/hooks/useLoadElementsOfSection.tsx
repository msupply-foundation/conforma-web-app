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
  sectionPage?: number
}

const useLoadElementsOfSection = ({
  applicationId,
  sectionTempId,
  sectionPage,
}: useLoadElementsProps) => {
  const [currentPageElements, setElements] = useState<ElementAndResponse[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

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

    const elements = sectionPage
      ? getElementsInPage({ sectionPage, templateElements })
      : getElements({ templateElements })

    setElements(elements)
    setLoading(false)
  }, [data, apolloError, sectionPage])

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

interface GetElementsInPageProps {
  sectionPage: number
  templateElements: TemplateElement[]
}

function getElementsInPage({ sectionPage, templateElements }: GetElementsInPageProps) {
  const currentPageIndex = sectionPage - 1

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
  return elementsByPage[currentPageIndex]
}

interface GetElementProps {
  templateElements: TemplateElement[]
}

function getElements({ templateElements }: GetElementProps) {
  // Build object with elements and responses in each page
  const elementsInSection = [] as ElementAndResponse[]
  templateElements.forEach((element) => {
    const { applicationResponses, category } = element
    // Store one response per question or null for element with information category
    const response =
      category === TemplateElementCategory.Question ? applicationResponses.nodes[0] : null
    // const { applicationResponses, ...question } = element
    // TODO: Remove the responsesConnection from each question/information element
    elementsInSection.push({ question: element, response })
  })
  // Set the current page elements and reesponses in local state
  return elementsInSection
}

export default useLoadElementsOfSection
