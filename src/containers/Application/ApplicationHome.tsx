import React from 'react'
import { FullStructure, TemplateDetails } from '../../utils/types'
import useGetFullApplicationStructure from '../../utils/hooks/useGetFullApplicationStructure'
import { ApplicationHeader, Loading } from '../../components'
import { Button, Divider, Header, Message, Segment } from 'semantic-ui-react'
import strings from '../../utils/constants'
import { useUserState } from '../../contexts/UserState'
import SectionsProgress from '../../components/Sections/SectionsProgress'

interface ApplicationProps {
  structure: FullStructure
  template: TemplateDetails
}

const ApplicationHome: React.FC<ApplicationProps> = ({ structure, template }) => {
  const {
    userState: { currentUser },
  } = useUserState()
  const { error, fullStructure } = useGetFullApplicationStructure({
    structure,
  })

  if (!fullStructure || !fullStructure.responsesByCode) return <Loading />

  const HomeMain: React.FC = () => {
    return (
      <Segment>
        <Header as="h5">{strings.SUBTITLE_APPLICATION_STEPS}</Header>
        <Header as="h5">{strings.TITLE_STEPS.toUpperCase()}</Header>
        <SectionsProgress sections={fullStructure.sections} />
        <Divider />
      </Segment>
    )
  }

  return error ? (
    <Message error title={strings.ERROR_APPLICATION_OVERVIEW} list={[error]} />
  ) : (
    <ApplicationHeader template={template} currentUser={currentUser} ChildComponent={HomeMain} />
  )
}

export default ApplicationHome

{
  /* {isApplicationCompleted && (
        <Sticky
          pushing
          style={{ backgroundColor: 'white', boxShadow: ' 0px -5px 8px 0px rgba(0,0,0,0.1)' }}
        >
          <Segment basic textAlign="right">
            <Button color="blue" onClick={setSummaryButtonClicked}>
              {strings.BUTTON_SUMMARY}
            </Button>
          </Segment>
        </Sticky>
      )} */
}
