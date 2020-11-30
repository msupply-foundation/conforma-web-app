import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Header, Icon, Label, Segment } from 'semantic-ui-react'
import { SummaryViewWrapper } from '../../formElementPlugins'
import { TemplateElementCategory } from '../../utils/generated/graphql'
import { ElementAndResponse, SectionElementStates } from '../../utils/types'

interface ApplicationSummaryProps {
  sectionPages: SectionElementStates
  serialNumber: string
  editable: boolean
}

const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({
  sectionPages,
  serialNumber,
  editable,
}) => {
  const { section, pages } = sectionPages
  return (
    <Segment.Group size="large">
      <Header as="h2" content={`${section.title}`} />
      {Object.entries(pages).map(([pageName, elements]) => (
        <Segment>
          <p>{pageName}</p>
          <Segment.Group>
            {elements.map((elementAndResponse) => {
              const {
                element: { category, isVisible, isEditable },
              } = elementAndResponse
              const pageCode = pageName?.replace(' ', '')
              return (
                <Segment>
                  <SummaryViewWrapper {...elementAndResponse} />
                  {category === TemplateElementCategory.Question && isVisible && isEditable && (
                    <Button
                      size="small"
                      as={Link}
                      to={`/applications/${serialNumber}/${section.code}/${pageCode}`}
                    >
                      Edit
                    </Button>
                  )}
                </Segment>
              )
            })}
          </Segment.Group>
        </Segment>
      ))}
    </Segment.Group>
  )
}

export default ApplicationSummary
