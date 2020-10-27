import React from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { ApplicationHeader, ApplicationStep, Loading } from '../../components'
import { Container, Grid, Label, Segment } from 'semantic-ui-react'
import useGetElementsInPage from '../../utils/hooks/useGetElementsInPage'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import useGetResponsesByCode from '../../utils/hooks/useGetResponsesByCode'
import { TemplateSectionPayload } from '../../utils/types'

const ApplicationPage: React.FC = () => {
  const { query, push } = useRouter()
  const { mode, serialNumber, sectionCode, page } = query

  const { error, loading, applicationName, templateSections } = useLoadApplication({
    serialNumber: serialNumber as string,
  })

  const currentSection = templateSections.find(({ code }) => code == sectionCode)

  // const { responsesByCode } = useGetResponsesByCode({ serialNumber: serialNumber as string })

  const { elements, loadingElements, errorElements } = useGetElementsInPage({
    sectionTemplateId: currentSection ? currentSection.id : -1,
    currentPageIndex: Number(page) - 1, // Get page in index
  })

  const changePagePayload = {
    serialNumber: serialNumber as string,
    sectionCode: sectionCode as string,
    currentPage: Number(page) as number,
    sections: templateSections,
    push,
  }

  return error || errorElements ? (
    <Label
      content="Problem to load application"
      error={error ? error : errorElements ? errorElements : ''}
    />
  ) : loading || loadingElements ? (
    <Loading />
  ) : serialNumber && currentSection ? (
    <Segment.Group>
      <ApplicationHeader mode={mode} serialNumber={serialNumber} name={applicationName} />
      <Container>
        <Grid columns={2} stackable textAlign="center">
          <Grid.Row>
            <Grid.Column>
              <Segment>Place holder for progress</Segment>
            </Grid.Column>
            <Grid.Column>
              <ApplicationStep
                sectionTitle={currentSection.title}
                elements={elements}
                onPreviousClicked={
                  Number(page) === 1 ? null : () => previousButtonHandler(changePagePayload)
                }
                onNextClicked={() => nextPageButtonHandler(changePagePayload)}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment.Group>
  ) : (
    <Label content="Application's section can't be displayed" />
  )
}

interface changePageProps {
  serialNumber: string
  sectionCode: string
  currentPage: number
  sections: TemplateSectionPayload[]
  push: (path: string) => void
}

function previousButtonHandler({
  serialNumber,
  currentPage,
  sectionCode,
  sections,
  push,
}: changePageProps) {
  const currentSection = sections.find(({ code }) => code === sectionCode)
  if (!currentSection) {
    console.log('Problem to find currentSection!')
    return
  }
  const previousPage = currentPage - 1
  //It should go back a section!
  if (previousPage === 0) {
    const foundSection = sections.find(({ index }) => index === currentSection.index - 1)
    if (foundSection) {
      const { code: previousSection, pagesCount: lastPage } = foundSection
      push(`../../${serialNumber}/${previousSection}/page${lastPage}`)
    } else {
      console.log('Problem to load previous page (not found)!')
    }
  } else {
    push(`../../${serialNumber}/${sectionCode}/page${previousPage}`)
  }
}

function nextPageButtonHandler({
  serialNumber,
  currentPage,
  sectionCode,
  sections,
  push,
}: changePageProps) {
  const nextPage = currentPage + 1
  const currentSection = sections.find(({ code }) => code === sectionCode)
  if (!currentSection) {
    console.log('Problem to find currentSection!')
    return
  }
  if (nextPage > currentSection.pagesCount) {
    const foundSection = sections.find(({ index }) => index === currentSection.index + 1)
    if (foundSection) {
      const { code: nextSection } = foundSection
      push(`../../${serialNumber}/${nextSection}/page1`)
    } else {
      push('../summary')
    }
  } else {
    push(`../../${serialNumber}/${sectionCode}/page${nextPage}`)
  }
}

export default ApplicationPage
