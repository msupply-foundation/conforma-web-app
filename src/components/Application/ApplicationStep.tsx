import React, { useEffect, useState } from 'react'
import { Button, Container, Grid, Header, Icon, Segment } from 'semantic-ui-react'
import { ApplicationQuestion, Loading } from '../../components'
import { TemplateElement, useGetSectionElementsQuery } from '../../utils/generated/graphql'
import { CurrentSectionPayload } from '../../utils/types'

interface ApplicationStepProps {
  currentSection: CurrentSectionPayload
  elements: TemplateElement[]
  onNextClicked: (() => void) | null
  onPreviousClicked: (() => void) | null
}

const ApplicationStep: React.FC<ApplicationStepProps> = (props) => {
  const { currentSection, elements, onNextClicked, onPreviousClicked } = props

  return (
    <Container textAlign='left'>
      <Segment>
        <Header content={currentSection.title} />
        {elements.map(element => <ApplicationQuestion templateElement={element}/>)}
        <Grid columns={3}>
          <Grid.Row>
            <Grid.Column>
              {onPreviousClicked && <PageButton title='Previous' type='left' onClicked={onPreviousClicked}/>}
            </Grid.Column>
            <Grid.Column/>{/* Empty cell */}
            <Grid.Column>
              {onNextClicked && <PageButton title='Next' type='right' onClicked={onNextClicked}/>}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </Container>
  )
}

type ButtonDirection = 'left' | 'right'

interface PageButtonProps {
  title: string
  type: ButtonDirection
  onClicked: () => void
}

const PageButton: React.FC<PageButtonProps> = (props) => {
  const { title, type, onClicked } = props
  return (
    <Button 
      labelPosition={type} 
      icon ={type==='right'?'right arrow' : 'left arrow'} 
      content={title}
      onClick={() => onClicked()}
    />
  )
}

export default ApplicationStep
