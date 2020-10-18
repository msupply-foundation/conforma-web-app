import React, { useEffect, useState } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import ApplicationStep from './ApplicationStep'
import { ApplicationHeader, Loading } from '../../components'
import {
  Application,
  ApplicationSection,
  TemplateElement,
  useGetApplicationQuery,
} from '../../utils/generated/graphql'
import { Container, Grid, Label, Segment } from 'semantic-ui-react'
import { CurrentSectionPayload } from '../../utils/types'
import useGetElementsInPage from '../../utils/hooks/useGetElementsInPage'

const ApplicationPage: React.FC = () => {
  const [ applicationName, setName ] = useState<string>('')
  const [ currentSection, setCurrentSection ] = useState<CurrentSectionPayload>({templateId: 0, title: ''})
  const { query } = useRouter()
  const { mode, serialNumber, sectionCode, page } = query

  const { data, loading, error } = useGetApplicationQuery({
    variables: {
      serial: Number(serialNumber),
    },
  })

  useEffect(() => {
    if (data && data.applications && data.applications.nodes) {
      if (data.applications.nodes.length > 1)
        console.log('More than one application returned. Only one expected!')

      const application = data.applications.nodes[0] as Application
      if (application) {
        setName(application.name as string)

        if (application.applicationSections) {
          const sections = application.applicationSections.nodes as ApplicationSection[]
          const currentSection = sections.find((section) => section.templateSection?.code === sectionCode)
          if (currentSection) {
            const { templateSection } = currentSection
            if (templateSection) setCurrentSection({ 
              templateId: templateSection.id,
              title: templateSection.title as string
             })
          }
        }
      }
    }
  }, [data, error])

  const { elements, loadingElements , errorElements } = useGetElementsInPage({
    templateId: currentSection.templateId,
    currentPageInSection: Number(page) // TODO: Find the page in the section (keeping the number of pages in previous sections...)
  })

  return errorElements ? (
    <Label content="Problem to load section" error={errorElements}/> 
  ) :
  loading || loadingElements ? (
    <Loading />
  ) : serialNumber ? (
  <Segment.Group>
    <ApplicationHeader mode={mode} serialNumber={serialNumber} name={applicationName} />
    <Container>
      <Grid columns={2} stackable textAlign='center'>
        <Grid.Row>
          <Grid.Column>
            <Segment>Place holder for progress</Segment>
          </Grid.Column>
          <Grid.Column>
            <ApplicationStep currentSection={currentSection} elements={elements} pageNumber={Number(page)} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
    </Segment.Group>
    ) : <Label content="Application can't be displayed"/>
}

export default ApplicationPage
