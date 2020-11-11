import React, { useEffect, useState } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { ApplicationHeader, Loading } from '../../components'
import { Container, Grid, Label, Segment } from 'semantic-ui-react'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import useGetResponsesAndElementState from '../../utils/hooks/useGetResponsesAndElementState'
import { TemplateSectionPayload } from '../../utils/types'
import ElementsArea from './ElementsArea'
import { useApplicationState } from '../../contexts/ApplicationState'

const ApplicationPageWrapper: React.FC = () => {
  const { setApplicationState } = useApplicationState()
  const { query, push, replace } = useRouter()
  const { mode, serialNumber, sectionCode, page } = query

  const { error, loading, application, templateSections, appStatus } = useLoadApplication({
    serialNumber: serialNumber as string,
  })

  const {
    error: responsesError,
    loading: responsesLoading,
    responsesByCode,
    responsesFullByCode,
    elementsState,
  } = useGetResponsesAndElementState({
    serialNumber: serialNumber as string,
  })

  useEffect(() => {
    if (application) {
      setApplicationState({ type: 'setApplicationId', id: application.id })
      processRedirect({
        ...appStatus,
        serialNumber,
        sectionCode,
        page,
        templateSections,
        push,
        replace,
      })
    }
  }, [application])

  const currentSection = templateSections.find(({ code }) => code == sectionCode)

  const changePagePayload = {
    serialNumber: serialNumber as string,
    sectionCode: sectionCode as string,
    currentPage: Number(page),
    sections: templateSections,
    push,
  }

  const checkPagePayload = {
    sectionCode: sectionCode as string,
    currentPage: Number(page),
    sections: templateSections,
  }

  return error ? (
    <Label content="Problem to load application" error={error} />
  ) : loading || responsesLoading ? (
    <Loading />
  ) : application && serialNumber && currentSection ? (
    <Segment.Group>
      <ApplicationHeader mode={mode} serialNumber={serialNumber} name={application.name} />
      <Container>
        <Grid columns={2} stackable textAlign="center">
          <Grid.Row>
            <Grid.Column>
              <Segment>Place holder for progress</Segment>
            </Grid.Column>
            <Grid.Column>
              <ElementsArea
                applicationId={application.id}
                sectionTitle={currentSection.title}
                sectionTemplateId={currentSection.id}
                sectionPage={Number(page)}
                isFirstPage={checkFirstPage(checkPagePayload)}
                isLastPage={checkLastPage(checkPagePayload)}
                responsesByCode={responsesByCode}
                responsesFullByCode={responsesFullByCode}
                elementsState={elementsState}
                onPreviousClicked={() => previousButtonHandler(changePagePayload)}
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

interface checkPageProps {
  sectionCode: string
  currentPage: number
  sections: TemplateSectionPayload[]
}

function checkFirstPage({ sectionCode, currentPage, sections }: checkPageProps): boolean {
  const previousPage = currentPage - 1
  const currentSection = sections.find(({ code }) => code === sectionCode)
  if (!currentSection) {
    console.log('Problem to find currentSection!')
    return true
  }
  return previousPage > 0 ||
    (previousPage === 0 && sections.find(({ index }) => index === currentSection.index - 1))
    ? false
    : true
}

function checkLastPage({ sectionCode, currentPage, sections }: checkPageProps): boolean {
  const nextPage = currentPage + 1
  const currentSection = sections.find(({ code }) => code === sectionCode)
  if (!currentSection) {
    console.log('Problem to find currentSection!')
    return true
  }
  return nextPage <= currentSection.totalPages ||
    (nextPage > currentSection.totalPages &&
      sections.find(({ index }) => index === currentSection.index + 1))
    ? false
    : true
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
      const { code: previousSection, totalPages: lastPage } = foundSection
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
  if (nextPage > currentSection.totalPages) {
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

function processRedirect(appState: any): void {
  // All logic for re-directing/configuring page based on application state, permissions, roles, etc. should go here.
  const {
    stage,
    status,
    outcome,
    serialNumber,
    sectionCode,
    page,
    templateSections,
    push,
    replace,
  } = appState
  if (status !== 'DRAFT') {
    replace(`/applications/${serialNumber}/summary`)
    return
  }
  if (!sectionCode || !page) {
    const firstSection = templateSections[0].code
    replace(`/applications/${serialNumber}/${firstSection}/page1`)
  }
}

export default ApplicationPageWrapper
