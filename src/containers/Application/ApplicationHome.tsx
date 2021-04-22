import React, { useEffect } from 'react'
import { Button, Divider, Header, Label, Message, Segment } from 'semantic-ui-react'
import { FullStructure, StageAndStatus, TemplateDetails } from '../../utils/types'
import useGetApplicationStructure from '../../utils/hooks/useGetApplicationStructure'
import { ApplicationHeader, ApplicationSections, Loading } from '../../components'
import strings from '../../utils/constants'
import { useUserState } from '../../contexts/UserState'
import { useRouter } from '../../utils/hooks/useRouter'
import { ApplicationStatus } from '../../utils/generated/graphql'
import { Link } from 'react-router-dom'
import Markdown from '../../utils/helpers/semanticReactMarkdown'
import messages from '../../utils/messages'

interface ApplicationProps {
  structure: FullStructure
  template: TemplateDetails
}

const ApplicationHome: React.FC<ApplicationProps> = ({ structure, template }) => {
  const {
    query: { serialNumber },
    replace,
    push,
  } = useRouter()
  const {
    userState: { currentUser },
  } = useUserState()

  const { error, fullStructure } = useGetApplicationStructure({
    structure,
  })

  useEffect(() => {
    if (!fullStructure) return
    const { status } = fullStructure.info.current as StageAndStatus
    if (status !== ApplicationStatus.Draft && status !== ApplicationStatus.ChangesRequired)
      replace(`/application/${serialNumber}/summary`)
  }, [fullStructure])

  const handleSummaryClicked = () => {
    push(`/application/${serialNumber}/summary`)
  }

  if (!fullStructure || !fullStructure.responsesByCode) return <Loading />

  const {
    info: { current, isChangeRequest, firstStrictInvalidPage },
  } = fullStructure

  const HomeMain: React.FC = () => {
    return (
      <>
        <ChangesRequestedTitle status={current?.status} isChangeRequest={isChangeRequest} />
        <Label className="label-title" content={strings.SUBTITLE_APPLICATION_STEPS} />
        <Header as="h4" content={strings.TITLE_STEPS} />
        <ApplicationSections fullStructure={structure} />
        <Divider className="last-line" />
        <Markdown text={template.startMessage || ''} semanticComponent="Message" info />
        {current?.status === ApplicationStatus.Draft && !firstStrictInvalidPage && (
          <Segment basic className="application-segment" textAlign="right">
            <Button as={Link} color="blue" onClick={handleSummaryClicked}>
              {strings.BUTTON_SUMMARY}
            </Button>
          </Segment>
        )}
      </>
    )
  }

  return error ? (
    <Message error title={strings.ERROR_GENERIC} list={[error]} />
  ) : (
    <ApplicationHeader template={template} currentUser={currentUser} ChildComponent={HomeMain} />
  )
}

interface ChangesRequestedTitleProps {
  status?: ApplicationStatus
  isChangeRequest: boolean
}

const ChangesRequestedTitle: React.FC<ChangesRequestedTitleProps> = ({
  status,
  isChangeRequest,
}) => {
  return status !== ApplicationStatus.Submitted && isChangeRequest ? (
    <Header content={messages.APPLICATION_CHANGES_REQUIRED} />
  ) : null
}

export default ApplicationHome
