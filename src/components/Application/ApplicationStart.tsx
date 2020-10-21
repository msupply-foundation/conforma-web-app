import React from 'react'
import { Button, Container, Header, Label, List, Segment } from 'semantic-ui-react'
import { TemplateTypePayload, TemplateSectionPayload } from '../../utils/types'
import ApplicationSelectType from './ApplicationSelectType'

export interface ApplicationStartProps {
  template: TemplateTypePayload
  sections: TemplateSectionPayload[]
  handleClick: () => void
}

const ApplicationStart: React.FC<ApplicationStartProps> = (props) => {
  const { template: type, sections, handleClick } = props

  return type ? (
    <Container text>
      <Header as="h1" content={type ? type.description : 'Create application page'} />
      {type && (
        <Segment>
          {sections && (
            <Header as="h2" content={`Number of sections in template: ${sections.length}`} />
          )}
          <List>
            {sections &&
              sections.map((section) => (
                <List.Item key={`list-item-${section.code}`} content={section.title} />
              ))}
          </List>
          <Button content={type.name} onClick={handleClick} />
        </Segment>
      )}
      {!type && <Label content="No Application" />}
    </Container>
  ) : (
    <ApplicationSelectType />
  )
}

export default ApplicationStart
