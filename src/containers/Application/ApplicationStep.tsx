import React, { useEffect, useState } from 'react'
import { Container, Header, Segment } from 'semantic-ui-react'
import { ApplicationQuestion, Loading } from '../../components'
import { useApplicationState } from '../../contexts/ApplicationState'
import { TemplateElement, useGetSectionElementsQuery } from '../../utils/generated/graphql'
import { useRouter } from '../../utils/hooks/useRouter'

const ApplicationStep: React.FC = () => {
  const { applicationState, setApplicationState } = useApplicationState()
  const { pageNumber, pageIndex, pages } = applicationState
  const currentPage = (pageIndex === null || pages === null ) ? undefined : pages[pageIndex]
  const [ elements, setElements ] = useState<TemplateElement[]>([])

  const { data, loading, error } = useGetSectionElementsQuery()

  useEffect(() => {
    if (currentPage && data && data.templateElements && data.templateElements.nodes.length > 0) {
      const templateElements = data.templateElements.nodes as TemplateElement[]
      const { firstElement, lastElement } = currentPage

      // Get each element (in order) from the current page
      let currentElementCode: string | null = firstElement as string
      const elementsInPage: TemplateElement[] = []
      while(currentElementCode != null) {
        const found = templateElements.find(element => element.code as string === currentElementCode)
        if (found) {
          elementsInPage.push(found)
          currentElementCode = (found.nextElementCode) ? found.nextElementCode : null
          if (lastElement !== null && lastElement === currentElementCode){
            console.log('found last element!')
            break
          } 
        }
      }
      setElements(elementsInPage)
    }
  }, [data, error])

  return loading ? <Loading/> : (
    <Container>
      {currentPage ? (
      <Segment>
        <Header content={currentPage?.sectionTitle} />
      {elements.map(element => <ApplicationQuestion/>)}
      <NextPageButton page={pageNumber as number} /> 
      </Segment>) : 
      <Header content='Some problem!'/>}
    </Container>
  )
}

type ButtonProps = { page?: number }

const NextPageButton: React.FC<ButtonProps> = (props) => {
    const { push } = useRouter()
    const handleClick = () => {
      push('page' + props.page + 1)
    }

  return (
    <button type="submit" onClick={handleClick}>
      Next Page
    </button>
  )
}

export default ApplicationStep
