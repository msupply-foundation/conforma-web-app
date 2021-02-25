import React from 'react'
import { FullStructure, TemplateDetails } from '../../utils/types'
import useGetFullApplicationStructure from '../../utils/hooks/useGetFullApplicationStructure'
import { ApplicationSelectType, Loading } from '../../components'
import { Button, Divider, Header, Message, Segment } from 'semantic-ui-react'
import strings from '../../utils/constants'
import { Link } from 'react-router-dom'
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

  // const { info: { code, name } } = fullStructure as FullStructure
  const { code, name } = template

  return error ? (
    <Message error title={strings.ERROR_APPLICATION_OVERVIEW} list={[error]} />
  ) : (
    <Segment.Group style={{ backgroundColor: 'Gainsboro', display: 'flex' }}>
      <Button
        as={Link}
        to={`/applications?type=${code}`}
        icon="angle left"
        label={{ content: `${name} ${strings.LABEL_APPLICATIONS}`, color: 'grey' }}
      />
      <Header textAlign="center">
        {currentUser?.organisation?.orgName || strings.TITLE_NO_ORGANISATION}
      </Header>
      <Segment
        style={{
          backgroundColor: 'white',
          padding: 10,
          margin: '0px 50px',
          minHeight: 500,
          flex: 1,
        }}
      >
        <Header as="h2" textAlign="center">
          {`${name} ${strings.TITLE_APPLICATION_FORM}`}
          <Header.Subheader>{strings.TITLE_INTRODUCTION}</Header.Subheader>
        </Header>
        {template && (
          <Segment basic>
            <Header as="h5">{strings.SUBTITLE_APPLICATION_STEPS}</Header>
            <Header as="h5">{strings.TITLE_STEPS.toUpperCase()}</Header>
            <SectionsProgress sections={fullStructure.sections} />
            <Divider />
            {/* <Markdown text={startMessageEvaluated} semanticComponent="Message" info />
            {startApplication && (
              <Button color="blue" onClick={startApplication}>
                {strings.BUTTON_APPLICATION_START}
              </Button>
            )} */}
          </Segment>
        )}
      </Segment>
      {/* {isApplicationCompleted && (
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
      )} */}
    </Segment.Group>
  )
}

export default ApplicationHome
