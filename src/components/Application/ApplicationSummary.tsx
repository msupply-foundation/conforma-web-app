import React, { useState } from 'react'
import { Button, Container, Header, Input, Label, Segment } from 'semantic-ui-react'
import { useApplicationState } from '../../contexts/ApplicationState'
import {
  TemplateElementCategory,
  Trigger,
  useUpdateApplicationMutation,
} from '../../utils/generated/graphql'
import useLoadSummary from '../../utils/hooks/useLoadSummary'
import { ElementAndResponse } from '../../utils/types'
import Loading from '../Loading'

const ApplicationSummary: React.FC = () => {
  const { applicationState } = useApplicationState()
  const { id, sections } = applicationState
  const [submitted, setSubmitted] = useState(false)

  const { sectionElements, error, loading } = useLoadSummary({
    applicationId: id as number,
    sectionIds: sections.map(({ id }) => id),
  })

  const [applicationSubmitMutation] = useUpdateApplicationMutation({
    onCompleted: () => setSubmitted(true),
  })

  return error ? (
    <Label content="Problem to load summary of application" error={error} />
  ) : loading ? (
    <Loading />
  ) : submitted ? (
    <Container text>
      <Header>Application submitted!</Header>
    </Container>
  ) : (
    <Container>
      <Header as="h1" content="REVIEW AND SUBMIT" />
      {sectionElements &&
        Object.entries(sectionElements).map(([sectionId, elements]) => {
          const templateElements = elements as Array<ElementAndResponse>
          const findSection = sections.find(({ id }) => id.toString() === sectionId)
          return findSection ? (
            <Segment size="large">
              <Header as="h5" icon="pencil" floated="right" content="edit" color="blue" />
              <Header content={`${findSection.title}`} />
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
      <Button
        content="Submit application"
        onClick={() => {
          applicationSubmitMutation({
            variables: {
              id: id as number,
              applicationTrigger: Trigger.OnApplicationSubmit,
            },
          })
        }}
      />
    </Container>
  )
}

export default ApplicationSummary
