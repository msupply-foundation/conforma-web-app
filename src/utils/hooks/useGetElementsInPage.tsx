import { useState, useEffect } from 'react'
import { TemplateElement, useGetSectionElementsQuery } from '../generated/graphql'

interface useGetElementsInPageProps {
  sectionTemplateId: number
  currentPageIndex: number
}

interface SectionPages {
  [page: number]: Array<TemplateElement>
}

const useGetElementsInPage = (props: useGetElementsInPageProps) => {
  const { sectionTemplateId, currentPageIndex } = props
  const [currentPageElements, setElements] = useState<TemplateElement[]>([])

  const { data, loading, error } = useGetSectionElementsQuery({
    variables: {
      sectionId: sectionTemplateId,
    },
  })

  useEffect(() => {
    if (data && data.templateElements && data.templateElements.nodes.length > 0) {
      const templateElements = data.templateElements.nodes as TemplateElement[]

      let elementsByPage = [] as SectionPages
      let countPage = 0
      elementsByPage[countPage] = [] as TemplateElement[]

      templateElements.forEach((element) => {
        const { elementTypePluginCode: code } = element
        if (code === 'pageBreak') elementsByPage[++countPage] = [] as TemplateElement[]
        else elementsByPage[countPage].push(element)
      })
      const elementsInPage = elementsByPage[currentPageIndex]
      setElements(elementsInPage)
    }
  }, [data, error, currentPageIndex])

  return {
    errorElements: error,
    loadingElements: loading,
    elements: currentPageElements,
  }
}

export default useGetElementsInPage
