import { useState, useEffect } from 'react'
import { TemplateElement, useGetSectionElementsQuery } from '../generated/graphql'

interface useGetElementsInPageProps {
    templateId: number
    currentPageInSection: number
}
const useGetElementsInPage = (props: useGetElementsInPageProps) => {
    const { templateId, currentPageInSection } = props
    const [ elements, setElements ] = useState<TemplateElement[]>([])

    const { data, loading, error } = useGetSectionElementsQuery({
      variables: {
        sectionId: templateId
      }
    })
  
    useEffect(() => {
      if (data && data.templateElements && data.templateElements.nodes.length > 0) {
            const templateElements = data.templateElements.nodes as TemplateElement[]
            const elementsInPage: TemplateElement[] = []

            let currentElementCode: string | null = getFirstCodeInPage(templateElements, currentPageInSection)

            if (!currentPageInSection) console.log('Something wrong with getting elements of current page')

            while(currentElementCode != null) {
                const found = templateElements.find(element => element.code as string === currentElementCode)
                if (found) {
                elementsInPage.push(found)
                currentElementCode = (found.nextElementCode) ? found.nextElementCode : null
                }
            }
            setElements(elementsInPage)
        }
    }, [data, error])

    return {
        errorElements: error,
        loadingElements: loading,
        elements
    }
}

function getFirstCodeInPage( templateElements: TemplateElement[], page: number ): string | null {
    if (page === 1) return templateElements[0].code
    let countPageBreaks = 0

    templateElements.forEach((element) => {
        if (element.elementTypePluginCode === 'PageBreak') {
            countPageBreaks++
            if (countPageBreaks === page-1) return element.nextElementCode
        }
    })

    return null
}

export default useGetElementsInPage