import React from 'react'
import { Button, Container, Header, Input, Label, Segment } from 'semantic-ui-react'
import { useApplicationState } from '../../contexts/ApplicationState'
import { TemplateElementCategory } from '../../utils/generated/graphql'
import useLoadSummary from '../../utils/hooks/useLoadSummary'
import { ElementAndResponse } from '../../utils/types'
import Loading from '../Loading'

const ApplicationSummary: React.FC = () => {
  const { applicationState } = useApplicationState()
  const { id, sections } = applicationState

  const { sectionElements, error, loading } = useLoadSummary({
    applicationId: id as number,
    sectionIds: sections.map(({ id }) => id),
  })

  return error ? (
    <Label content="Problem to load summary of application" error={error} />
  ) : loading ? (
    <Loading />
  ) : (
    <Container>
      <Header as="h1" content="REVIEW AND SUBMIT" />
      {sectionElements &&
        Object.entries(sectionElements).map(([sectionId, elements]) => {
          const templateElements = elements as Array<ElementAndResponse>
          const findSection = sections.find(({ id }) => id.toString() === sectionId)
          return findSection ? (
            <Segment size="large">
              <Header content={`${findSection.title}`} />
              <Header as="h5" icon="pencil" floated="right" content="edit" color="blue" />
              {templateElements.map(({ question, response }) =>
                question.category === TemplateElementCategory.Question ? (
                  <Segment.Group horizontal key={`summary_${question.code}`}>
                    <Label content={question.title} />
                    <Input disabled>{response?.value}</Input>
                  </Segment.Group>
                ) : question.elementTypePluginCode !== 'pageBreak' ? (
                  <Label content={question.title} />
                ) : null
              )}
            </Segment>
          ) : null
        })}
      <Button content="Submit application" />
    </Container>
  )
}

export default ApplicationSummary
