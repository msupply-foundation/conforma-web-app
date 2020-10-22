import React, { useEffect, useState } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { ApplicationHeader, ApplicationStep, Loading } from '../../components'
import { Container, Grid, Label, Segment } from 'semantic-ui-react'
import useGetElementsInPage from '../../utils/hooks/useGetElementsInPage'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import useGetResponsesByCode from '../../utils/hooks/useGetResponsesByCode'
import { SectionPages } from '../../utils/types'

const ApplicationPage: React.FC = () => {
  const [pageIndex, setPageIndex] = useState(0)
  const { query, push, goBack } = useRouter()
  const { mode, serialNumber, sectionCode, git diff } = query

  const { error, loading, applicationName, applicationSections } = useLoadApplication({
    serialNumber: serialNumber as string,
  })

  const currentSection = applicationSections[sectionCode as string]

  const { responsesByCode } = useGetResponsesByCode({ serialNumber: serialNumber as string })

  const { elements, loadingElements, errorElements } = useGetElementsInPage({
    sectionTemplateId: currentSection ? currentSection.id : -1,
    pageIndexInSection: pageIndex,
  })

  const nextPagePayload = {
    serialNumber: serialNumber as string,
    sectionCode: sectionCode as string,
    currentPage: Number(page) as number,
    pages: applicationSections,
    push,
  }

  useEffect(() => {
    setPageIndex(Number(page) - 1)
  }, [page])

  return error || errorElements ? (
    <Label
      content="Problem to load application"
      error={error ? error : errorElements ? errorElements : ''}
    />
  ) : loading || loadingElements ? (
    <Loading />
  ) : serialNumber ? (
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
                  Number(page) === 1 ? null : () => previousButtonHandler({ goBack })
                }
                onNextClicked={() => nextPageButtonHandler(nextPagePayload)}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment.Group>
  ) : (
    <Label content="Application can't be displayed" />
  )
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

  const nextPage = currentPage + 1
  const currentSection = pages[sectionCode]
  const isAnotherSection = nextPage > currentSection.startPage + currentSection.totalPages

  if (isAnotherSection) {
    console.log('isAnother')

    const foundSection = Object.entries(pages).find(
      ([key, obj]) => obj.index === currentSection.index + 1
    )
    if (foundSection && foundSection.length > 0) {
      const nextSection = foundSection[0]
      push(`../../${serialNumber}/${nextSection}/page1`)
    } else {
      push('../summary')
    }
  } else {
    push(`../../${serialNumber}/${sectionCode}/page${nextPage}`)
  }
}

export default ApplicationPage
