import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Divider, Header, Icon, List, Message, Segment } from 'semantic-ui-react'
import strings from '../../utils/constants'
import { TemplateTypePayload, TemplateSectionPayload, EvaluatorParameters } from '../../utils/types'
import ApplicationSelectType from './ApplicationSelectType'
import Markdown from '../../utils/helpers/semanticReactMarkdown'
import evaluate from '@openmsupply/expression-evaluator'
import { useUserState } from '../../contexts/UserState'
export interface ApplicationStartProps {
  template: TemplateTypePayload
  sections: TemplateSectionPayload[]
  handleClick: () => void
}

const ApplicationStart: React.FC<ApplicationStartProps> = (props) => {
  const { template, sections, handleClick } = props
  const { name, code, startMessage } = template
  const [startMessageEvaluated, setStartMessageEvaluated] = useState('')
  const {
    userState: { currentUser },
  } = useUserState()

  useEffect(() => {
    if (!currentUser) return
    const evaluatorParams: EvaluatorParameters = {
      objects: { currentUser },
      APIfetch: fetch,
    }
    evaluate(startMessage || '', evaluatorParams).then((result: any) =>
      setStartMessageEvaluated(result)
    )
  }, [startMessage, currentUser])

  return template ? (
    <Segment.Group style={{ backgroundColor: 'Gainsboro', display: 'flex' }}>
      <Button
        as={Link}
        to={`/applications?type=${code}`}
        icon="angle left"
        label={{ content: `${name} ${strings.LABEL_APPLICATIONS}`, color: 'grey' }}
      />
      <Header textAlign="center">{strings.TITLE_COMPANY_PLACEHOLDER}</Header>
      <Segment
        style={{
          backgroundColor: 'white',
          padding: 10,
          margin: '0px 50px',
          minHeight: 500,
          flex: 1,
        }}
      >
        <Header as="h2" textAlign="center">
          {`${name} ${strings.TITLE_APPLICATION_FORM}`}
          <Header.Subheader>{strings.TITLE_INTRODUCTION}</Header.Subheader>
        </Header>
        {template && (
          <Segment basic>
            <Header as="h5">{strings.SUBTITLE_APPLICATION_STEPS}</Header>
            <Header as="h5">{strings.TITLE_STEPS.toUpperCase()}</Header>
            <List divided relaxed>
              {sections &&
                sections.map((section) => (
                  <List.Item key={`list-item-${section.code}`}>
                    <List.Icon name="circle outline" />
                    <List.Content>{section.title}</List.Content>
                  </List.Item>
                ))}
            </List>
            <Divider />
            <Markdown text={startMessageEvaluated} semanticComponent="Message" info />
            <Button color="blue" onClick={handleClick}>
              {strings.BUTTON_APPLICATION_START}
            </Button>
          </Segment>
        )}
      </Segment>
    </Segment.Group>
  ) : (
    <ApplicationSelectType />
  )
}

export default ApplicationStart
