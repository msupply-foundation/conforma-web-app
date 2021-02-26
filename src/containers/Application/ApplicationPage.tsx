import React, { useEffect, useState } from 'react'
import { FullStructure, ResponsesByCode, ElementStateNEW } from '../../utils/types'
import useGetFullApplicationStructure from '../../utils/hooks/useGetFullApplicationStructure'
import { ApplicationStatus } from '../../utils/generated/graphql'
import { useApplicationState } from '../../contexts/ApplicationState'
import { useUserState } from '../../contexts/UserState'
import { useRouter } from '../../utils/hooks/useRouter'
import { Loading, NoMatch } from '../../components'
import strings from '../../utils/constants'
import messages from '../../utils/messages'
import { Button, Grid, Header, Message, Segment, Sticky } from 'semantic-ui-react'
import ProgressBarNEW from '../../components/Application/ProgressBarNEW'
import { PageElements } from '../../components/Application'

interface ApplicationProps {
  structure: FullStructure
  responses?: ResponsesByCode
}

const ApplicationPage: React.FC<ApplicationProps> = ({ structure }) => {
  const [strictSectionPage, setStrictSectionPage] = useState({ section: null, page: null })
  const { error, isLoading, fullStructure, responsesByCode } = useGetFullApplicationStructure({
    structure,
  })
  const {
    userState: { currentUser },
  } = useUserState()
  const {
    query: { sectionCode, page },
    push,
  } = useRouter()

  const pageNum = Number(page)
  const sectionIndex = structure.sections[sectionCode].details.index

  console.log('Structure', fullStructure)

  useEffect(() => {
    if (!fullStructure) return

    // Re-direct based on application status
    if (fullStructure.info.current?.status === ApplicationStatus.ChangesRequired)
      push(`/applicationNEW/${fullStructure.info.serial}`)
    if (structure.info.current?.status !== ApplicationStatus.Draft)
      push(`/applicationNEW/${structure.info.serial}/summary`)

    // Re-direct if trying to access page higher than allowed
    if (!fullStructure.info.isLinear || !fullStructure.info?.firstIncompletePage) return
    const {
      sectionCode: firstIncompleteSectionCode,
      pageNumber: firstIncompletePageNum,
    } = fullStructure.info?.firstIncompletePage
    const firstIncompleteSectionIndex =
      fullStructure.sections[firstIncompleteSectionCode].details.index
    if (
      sectionIndex > firstIncompleteSectionIndex ||
      (sectionIndex >= firstIncompleteSectionIndex && pageNum > firstIncompletePageNum)
    ) {
      push(
        `/applicationNEW/${structure.info.serial}/${firstIncompleteSectionCode}/Page${firstIncompletePageNum}`
      )
    }
  }, [structure, fullStructure, sectionCode, page])

  const handleChangeToPage = (sectionCode: string, pageNumber: number) => {
    if (!structure.info.isLinear)
      push(`/applicationNEW/${structure.info.serial}/${sectionCode}/Page${pageNumber}`)

    // TODO: Use validationMethod to check if can change to page OR
    // Would display modal (?) and current page with strict validation
  }

  if (error) return <Message error header={strings.ERROR_APPLICATION_PAGE} list={[error]} />
  if (!fullStructure || !responsesByCode) return <Loading />

  return (
    <Segment.Group style={{ backgroundColor: 'Gainsboro', display: 'flex' }}>
      {/* <ModalWarning showModal={showModal} /> */}
      <Header textAlign="center">
        {currentUser?.organisation?.orgName || strings.TITLE_NO_ORGANISATION}
      </Header>
      <Grid
        stackable
        style={{
          backgroundColor: 'white',
          padding: 10,
          margin: '0px 50px',
          minHeight: 500,
          flex: 1,
        }}
      >
        <Grid.Column width={4}>
          <ProgressBarNEW
            structure={fullStructure}
            current={{ sectionCode, page: Number(page) }}
            changePage={handleChangeToPage}
          />
        </Grid.Column>
        <Grid.Column width={10} stretched>
          <Segment basic>
            <Segment vertical style={{ marginBottom: 20 }}>
              <Header content={fullStructure.sections[sectionCode].details.title} />
              <PageElements
                elements={getCurrentPageElements(fullStructure, sectionCode, pageNum)}
                responsesByCode={responsesByCode}
                isStrictPage={
                  sectionCode === strictSectionPage?.section && pageNum === strictSectionPage?.page
                }
                isEditable
              />
            </Segment>
            <NavigationBox />
          </Segment>
        </Grid.Column>
        <Grid.Column width={2} />
      </Grid>
      <Sticky
        pushing
        style={{ backgroundColor: 'white', boxShadow: ' 0px -5px 8px 0px rgba(0,0,0,0.1)' }}
      >
        <Segment basic textAlign="right">
          <Button color="blue" onClick={() => {}}>
            {/* TO-DO */}
            {strings.BUTTON_SUMMARY}
          </Button>
        </Segment>
      </Sticky>
    </Segment.Group>
  )
}

const NavigationBox: React.FC = () => {
  // Placeholder -- to be replaced with new component
  return <p>Navigation Buttons</p>
}

export default ApplicationPage

const getCurrentPageElements = (structure: FullStructure, section: string, page: number) => {
  return structure.sections[section].pages[page].state.map(
    (item) => item.element
  ) as ElementStateNEW[]
}
