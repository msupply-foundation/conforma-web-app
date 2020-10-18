import React, { useEffect, useState } from 'react'
import { Container, Header, Segment } from 'semantic-ui-react'
import { ApplicationQuestion, Loading } from '../../components'
import { TemplateElement, useGetSectionElementsQuery } from '../../utils/generated/graphql'
import { useRouter } from '../../utils/hooks/useRouter'
import { CurrentSectionPayload } from '../../utils/types'

interface ApplicationStepProps {
  currentSection: CurrentSectionPayload
  elements: TemplateElement[]
  pageNumber: number
}

const ApplicationStep: React.FC<ApplicationStepProps> = (props) => {
  const { currentSection, elements, pageNumber } = props

  return (
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
