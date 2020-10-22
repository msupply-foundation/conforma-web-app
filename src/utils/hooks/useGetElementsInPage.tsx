import { useState, useEffect } from 'react'
import { TemplateElement, useGetSectionElementsQuery } from '../generated/graphql'

interface useGetElementsInPageProps {
  sectionTemplateId: number
  pageIndexInSection?: number
}

interface SectionPages {
  [page: number]: Array<TemplateElement>
}

const useGetElementsInPage = (props: useGetElementsInPageProps) => {
  const { sectionTemplateId, pageIndexInSection } = props
  const [elements, setElements] = useState<TemplateElement[]>([])

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

      // TODO: Order element by ( index and section.index )
      templateElements.forEach((element) => {
        const { elementTypePluginCode: code, title } = element
        if (code === 'pageBreak') elementsByPage[++countPage] = [] as TemplateElement[]
        else elementsByPage[countPage].push(element)
      })

      const pageIndex = pageIndexInSection ? pageIndexInSection : 0
      const elementsInPage = elementsByPage[pageIndex]
      setElements(elementsInPage)
    }
  }, [data, error])

  return {
    errorElements: error,
    loadingElements: loading,
    elements,
  }
}

export default useGetElementsInPage
