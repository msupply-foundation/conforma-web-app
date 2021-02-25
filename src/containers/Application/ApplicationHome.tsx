import React from 'react'
import { Button, Divider, Header, Message, Segment, Sticky } from 'semantic-ui-react'
import { FullStructure, SectionAndPage, TemplateDetails } from '../../utils/types'
import useGetFullApplicationStructure from '../../utils/hooks/useGetFullApplicationStructure'
import { ApplicationHeader, Loading } from '../../components'
import strings from '../../utils/constants'
import { useUserState } from '../../contexts/UserState'
import SectionsProgress from '../../components/Sections/SectionsProgress'
import { useRouter } from '../../utils/hooks/useRouter'

interface ApplicationProps {
  structure: FullStructure
  template: TemplateDetails
}

const ApplicationHome: React.FC<ApplicationProps> = ({ structure, template }) => {
  const {
    query: { serialNumber },
    push,
  } = useRouter()
  const {
    userState: { currentUser },
  } = useUserState()

  const { error, fullStructure } = useGetFullApplicationStructure({
    structure,
  })

  const handleResumeClick = ({ sectionCode, pageName }: SectionAndPage) => {
    push(`/applicationNEW/${serialNumber}/${sectionCode}/${pageName}`)
  }

  const handleSummaryClicked = () => {
    push(`/applicationNEW/${serialNumber}/summary`)
  }

  if (!fullStructure || !fullStructure.responsesByCode) return <Loading />

  const isCompleted = Object.values(fullStructure.sections).every(
    ({ progress }) => progress?.completed && progress.valid
  )

  const HomeMain: React.FC = () => {
    return (
      <>
        <Segment>
          <Header as="h5">{strings.SUBTITLE_APPLICATION_STEPS}</Header>
          <Header as="h5">{strings.TITLE_STEPS.toUpperCase()}</Header>
          <SectionsProgress
            sections={fullStructure.sections}
            resumeApplication={handleResumeClick}
          />
          <Divider />
        </Segment>
        {isCompleted && (
          <Sticky
            pushing
            style={{ backgroundColor: 'white', boxShadow: ' 0px -5px 8px 0px rgba(0,0,0,0.1)' }}
          >
            <Segment basic textAlign="right">
              <Button color="blue" onClick={handleSummaryClicked}>
                {strings.BUTTON_SUMMARY}
              </Button>
            </Segment>
          </Sticky>
        )}
      </>
    )
  }

  return error ? (
    <Message error title={strings.ERROR_APPLICATION_OVERVIEW} list={[error]} />
  ) : (
    <ApplicationHeader template={template} currentUser={currentUser} ChildComponent={HomeMain} />
  )
}

export default ApplicationHome
