import React, { useEffect, useState } from 'react'
import { Container, Header, Segment } from 'semantic-ui-react'
import { ApplicationQuestion, Loading } from '../../components'
import { useApplicationState } from '../../contexts/ApplicationState'
import { TemplateElement, useGetSectionElementsQuery } from '../../utils/generated/graphql'
import { useRouter } from '../../utils/hooks/useRouter'
import { CurrentSectionPayload } from '../../utils/types'

interface ApplicationStepProps {
  currentSection: CurrentSectionPayload
  pageNumber: number
}

const ApplicationStep: React.FC<ApplicationStepProps> = (props) => {
  const { currentSection, pageNumber } = props
  const [ elements, setElements ] = useState<TemplateElement[]>([])

  const { data, loading, error } = useGetSectionElementsQuery({
    variables: {
      sectionId: currentSection.templateId
    }
  })

  useEffect(() => {
    if (error) console.log(error)
    if (data && data.templateElements && data.templateElements.nodes.length > 0) {
      const templateElements = data.templateElements.nodes as TemplateElement[]

      // Get each element (in order) from the current page
      let currentElementCode: string | null = templateElements[0].code as string
      const elementsInPage: TemplateElement[] = []
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

  return loading ? <Loading/> : (
    <Container textAlign='left'>
      <Segment>
        <Header content={currentSection.title} />
      {elements.map(element => <ApplicationQuestion templateElement={element}/>)}
      <NextPageButton page={pageNumber as number} /> 
      </Segment>
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
