import React from 'react'
import { Button, Container, Form, Grid, Header, Input, Segment } from 'semantic-ui-react'
import { ApplicationResponse, TemplateElementCategory } from '../../utils/generated/graphql'
import {
  ApplicationElementState,
  ElementState,
  ResponseFull,
  ResponsesFullByCode,
  TemplateSectionPayload,
} from '../../utils/types'

interface ApplicationSummaryProps {
  templateSections: TemplateSectionPayload[]
  elementsState: ApplicationElementState
  responsesByCode: ResponsesFullByCode
  onSubmitHandler: () => void
}

interface SectionGroups {
  [key: string]: ApplicationElementState
}

const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({
  templateSections,
  elementsState,
  responsesByCode,
  onSubmitHandler,
}) => {
  const sectionsAndElements = Object.entries(elementsState).reduce(
    (sectionGroups: SectionGroups, [code, item]) => {
      const group = sectionGroups[item.section] || {}
      group[code] = item
      sectionGroups[item.section] = group
      return sectionGroups
    },
    {}
  )

  return (
    <Container style={{ marginTop: '2em' }}>
      <Header as="h1" content="REVIEW AND SUBMIT" />
      <Form>
        {elementsState &&
          templateSections &&
          Object.entries(sectionsAndElements).map(([section, elements]) => {
            const findSection = templateSections.find(({ id }) => id.toString() === section)
            return findSection ? (
              <Segment.Group size="large">
                <Grid columns={2}>
                  <Grid.Row>
                    <Grid.Column>
                      <Header as="h2" content={`${findSection.title}`} />
                    </Grid.Column>
                    <Grid.Column>
                      <Header as="h5" icon="pencil" floated="right" content="edit" color="blue" />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                {Object.entries(elements).map(([code, element]) =>
                  getQuestion(element, responsesByCode[element.code])
                )}
              </Segment.Group>
            ) : null
          })}
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
