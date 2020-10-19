import React, { useEffect, useState } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { ApplicationHeader, ApplicationStep, Loading } from '../../components'
import {
  Application,
  ApplicationSection,
  TemplateElement,
  useGetApplicationQuery,
} from '../../utils/generated/graphql'
import { Container, Grid, Label, Segment } from 'semantic-ui-react'
import { CurrentSectionPayload } from '../../utils/types'
import useGetElementsInPage from '../../utils/hooks/useGetElementsInPage'

interface SectionPages {
  [code: string]: { 
    total: number,
    start: number
  } 
}

const ApplicationPage: React.FC = () => {
  const [ applicationName, setName ] = useState<string>('')
  const [ sectionPages, setSectionPages ] = useState<SectionPages>({})
  const [ currentSection, setCurrentSection ] = useState<CurrentSectionPayload>({templateId: 0, title: '', totalPages: 0})
  const { query, push, goBack } = useRouter()
  const { mode, serialNumber, sectionCode, page } = query

  const nextPagePayload = {
    serialNumber: serialNumber as string,
    sectionCode: sectionCode as string,
    currentPage: Number(page) as number,
    pages: sectionPages,
    push
  }

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
          const pagesBySection: SectionPages = {}
          let startPage = 1 // Always start on page 1
          let previousStartPage = startPage
          sections.forEach((section) => {
            const { templateSection } = section
            if (templateSection) {
              const { code } = templateSection
              const elements = templateSection.templateElementsBySectionId.nodes as TemplateElement[]
              let totalPages = 1
              elements.forEach((element) => {
                if(element.elementTypePluginCode === 'PageBreak') totalPages++
              })
              const pages = { total: totalPages, start: startPage}
              pagesBySection[code as string] = pages

              startPage = previousStartPage + totalPages // Update the next section start page
            }
          })
          setSectionPages(pagesBySection)

          const currentSection = sections.find((section) => section.templateSection?.code === sectionCode)
          if (currentSection) {
            const { templateSection } = currentSection
            if (templateSection) {
              const elements = templateSection.templateElementsBySectionId.nodes as TemplateElement[]
              let totalPages = 1
              elements.forEach((element) => {
                if(element.elementTypePluginCode === 'PageBreak') totalPages++
              })
              setCurrentSection({ 
                templateId: templateSection.id,
                title: templateSection.title as string,
                totalPages
             })
            }
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
            <ApplicationStep 
              currentSection={currentSection} 
              elements={elements}
              onPreviousClicked={Number(page) === 1 ? null : () => previousButtonHandler({ goBack })}
              onNextClicked={() => nextPageButtonHandler(nextPagePayload)}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
    <Segment>
    </Segment>
    </Segment.Group>
    ) : <Label content="Application can't be displayed"/>
}

interface previousPageProps {
  goBack: () => void
}
function previousButtonHandler(props: previousPageProps) {
  const { goBack } = props
  goBack()
}

interface nextPageProps {
  serialNumber: string
  sectionCode: string
  currentPage: number
  pages: SectionPages
  push: (path: string) => void
}

function nextPageButtonHandler(props: nextPageProps) {
  const { serialNumber, currentPage, sectionCode, pages, push } = props

  const nextPage = currentPage+1
  const currentSection = pages[sectionCode]
  const isAnotherSection = nextPage > (currentSection.start + currentSection.total)
  
  if (isAnotherSection) {
    const foundSection = Object.entries(pages).find(([key, obj]) => obj.start === nextPage)
    if (foundSection && foundSection.length > 0) {
      const nextSection = foundSection[0]
      push(`../../${serialNumber}/${nextSection}/page${nextPage}`)
    }
    else {
      push('../summary')
    }
  } else {
     push(`../../${serialNumber}/${sectionCode}/page${nextPage}`)
  }
}

export default ApplicationPage
