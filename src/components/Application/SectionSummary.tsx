import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Grid, Header, Segment } from 'semantic-ui-react'
import { SummaryViewWrapper } from '../../formElementPlugins'
import { TemplateElementCategory } from '../../utils/generated/graphql'
import { ResponsesByCode, SectionElementStates } from '../../utils/types'

interface SectionSummaryProps {
  sectionPages: SectionElementStates
  serialNumber: string
  allResponses: ResponsesByCode
  isStrictValidation: boolean
  canEdit: boolean
}

const SectionSummary: React.FC<SectionSummaryProps> = ({
  sectionPages,
  serialNumber,
  allResponses,
  isStrictValidation,
  canEdit,
}) => {
  const { section, pages } = sectionPages
  return (
    <Segment.Group size="large">
      <Header as="h2" content={`${section.title}`} />
      {Object.entries(pages).map(([pageName, elements]) => (
        <Segment key={`SectionSummary_${pageName}`}>
          <p>{pageName}</p>
          <Segment.Group>
            {elements.map(({ element, response }) => {
              const { category, isVisible, isEditable } = element
              const pageCode = pageName?.replace(' ', '')
              return (
                <Segment key={`SectionSummary_${element.code}`}>
                  <Grid columns={2} verticalAlign="middle">
                    <Grid.Row>
                      <Grid.Column floated="left" width={10}>
                        <SummaryViewWrapper
                          element={element}
                          response={response}
                          allResponses={allResponses}
                          isStrictValidation={isStrictValidation}
                        />
                      </Grid.Column>
                      <Grid.Column floated="right" width={3}>
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

export default SectionSummary
