import React from 'react'
import { Button, Container, Form, Grid, Header, Input, Segment } from 'semantic-ui-react'
import { TemplateElementCategory } from '../../utils/generated/graphql'
import { ElementState, ResponseFull, SectionElementStates } from '../../utils/types'

interface ApplicationSummaryProps {
  sectionsAndElements: SectionElementStates[]
  onSubmitHandler: () => void
}

const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({
  sectionsAndElements,
  onSubmitHandler,
}) => {
  return (
    <Container style={{ marginTop: '2em' }}>
      <Header as="h1" content="REVIEW AND SUBMIT" />
      <Form>
        {sectionsAndElements.map(({ section, elements }) => (
          <Segment.Group size="large">
            <Grid columns={2}>
              <Grid.Row>
                <Grid.Column>
                  <Header as="h2" content={`${section.title}`} />
                </Grid.Column>
                <Grid.Column>
                  <Header as="h5" icon="pencil" floated="right" content="edit" color="blue" />
                </Grid.Column>
              </Grid.Row>
            </Grid>
            {elements.map(({ element, value }) => getQuestion(element, value))}
          </Segment.Group>
        ))}
        <Button
          content="Submit application"
          onClick={() => {
            onSubmitHandler()
          }}
        />
      </Form>
    </Container>
  )
}

function getQuestion(question: ElementState, response: ResponseFull | null) {
  return question.category === TemplateElementCategory.Question ? (
    <Form.Field>
      <Header as="h3" content={question.title} />
      <Input disabled error={!response}>
        {response?.text}
      </Input>
    </Form.Field>
  ) : question.elementTypePluginCode !== 'pageBreak' ? (
    <Form.Field>
      <Header as="h5" content={question.title} />
    </Form.Field>
  ) : null
}

export default ApplicationSummary
