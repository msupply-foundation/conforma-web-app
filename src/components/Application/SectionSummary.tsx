import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Grid, Header, Segment } from 'semantic-ui-react'
import { SummaryViewWrapper } from '../../formElementPlugins'
import { TemplateElementCategory } from '../../utils/generated/graphql'
import { SectionElementStates } from '../../utils/types'

interface ApplicationSummaryProps {
  sectionPages: SectionElementStates
  serialNumber: string
  canEdit: boolean
}

const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({
  sectionPages,
  serialNumber,
  canEdit,
}) => {
  const { section, pages } = sectionPages
  return (
    <Segment.Group size="large">
      <Header as="h2" content={`${section.title}`} />
      {Object.entries(pages).map(([pageName, elements]) => (
        <Segment>
          <p>{pageName}</p>
          <Segment.Group>
            {elements.map(({ element, response }) => {
              const { category, isVisible, isEditable } = element
              const pageCode = pageName?.replace(' ', '')
              return (
                <Segment>
                  <Grid columns={2} verticalAlign="middle">
                    <Grid.Row>
                      <Grid.Column floated="left" width={10}>
                        <SummaryViewWrapper element={element} response={response} />
                      </Grid.Column>
                      <Grid.Column floated="right" width={5}>
                        {category === TemplateElementCategory.Question &&
                          isVisible &&
                          isEditable &&
                          canEdit && (
                            <Button
                              size="small"
                              as={Link}
                              to={`/applications/${serialNumber}/${section.code}/${pageCode}`}
                            >
                              Edit
                            </Button>
                          )}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
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
