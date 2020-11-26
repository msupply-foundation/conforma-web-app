import React from 'react'
import { Container, Divider, Form, Header, Segment } from 'semantic-ui-react'
import { SummaryViewWrapper } from '../../elementPlugins'
import { SectionElements } from '../../utils/types'

interface ApplicationSummaryProps {
  sectionsElements: SectionElements[]
  isEditable?: boolean
}

const SectionSummary: React.FC<ApplicationSummaryProps> = ({
  sectionsElements,
  isEditable = false,
}) => {
  return (
    <Container style={{ marginTop: '2em' }}>
      <Header as="h1" content="REVIEW AND SUBMIT" />
      <Form>
        {sectionsElements.map(({ index, title, pages }) => (
          <Segment.Group size="large">
            <Header as="h2" content={`${title}`} />
            {Object.entries(pages).map(([page, elements]) => (
              <Segment>
                <Divider />
                {isEditable && (
                  <Header as="h5" icon="pencil" floated="right" content="edit" color="blue" />
                )}
                <Header content={`Page elements here ${page}`} />
              </Segment>
            ))}
          </Segment.Group>
        ))}
      </Form>
    </Container>
  )
}

export default SectionSummary
