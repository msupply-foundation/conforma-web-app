import React from 'react'
import { Button, Container, Form, Grid, Header, Input, Segment } from 'semantic-ui-react'
import { ApplicationResponse, TemplateElementCategory } from '../../utils/generated/graphql'
import useLoadSummary from '../../utils/hooks/useLoadSummary'
import {
  ApplicationElementState,
  ElementState,
  ResponsesFullByCode,
  TemplateSectionPayload,
} from '../../utils/types'
import Loading from '../Loading'

interface ApplicationSummaryProps {
  applicationId: number
  sections: TemplateSectionPayload[]
  onSubmitHandler: () => void
}

const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({
  applicationId,
  sections,
  onSubmitHandler,
}) => {
  const { sectionElements, error, loading } = useLoadSummary({
    applicationId,
    sectionIds: sections.map(({ id }) => id),
  })

  const getQuestion = (question: TemplateElement, response: ApplicationResponse | null) => {
    return question.category === TemplateElementCategory.Question ? (
      <Form.Field>
        <Header as="h3" content={question.title} />
        <Input disabled error={!response}>
          {response?.value}
        </Input>
      </Form.Field>
    ) : question.elementTypePluginCode !== 'pageBreak' ? (
      <Form.Field>
        <Header as="h5" content={question.title} />
      </Form.Field>
    ) : null
  }

  return error ? (
    <Label content="Problem to load summary of application" error={error} />
  ) : loading ? (
    <Loading />
  ) : (
    <Container style={{ marginTop: '2em' }}>
      <Header as="h1" content="REVIEW AND SUBMIT" />
      <Form>
        {sectionElements &&
          Object.entries(sectionElements).map(([sectionId, elements]) => {
            const templateElements = elements as Array<ElementAndResponse>
            const findSection = sections.find(({ id }) => id.toString() === sectionId)
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
                {templateElements.map(({ question, response }) => getQuestion(question, response))}
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

export default ApplicationSummary
