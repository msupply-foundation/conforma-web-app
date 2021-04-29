import React, { useEffect } from 'react'
import { Button, Header, Message, Segment } from 'semantic-ui-react'
import { FullStructure, StageAndStatus, TemplateDetails } from '../../utils/types'
import useGetApplicationStructure from '../../utils/hooks/useGetApplicationStructure'
import { ApplicationContainer, ApplicationSections, Loading } from '../../components'
import strings from '../../utils/constants'
import { useUserState } from '../../contexts/UserState'
import { useRouter } from '../../utils/hooks/useRouter'
import { ApplicationStatus } from '../../utils/generated/graphql'
import { Link } from 'react-router-dom'
import messages from '../../utils/messages'
import ApplicationHomeWrapper from '../../components/Application/ApplicationHomeWrapper'

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

  if (error) return <Message error title={strings.ERROR_GENERIC} list={[error]} />
  if (!fullStructure || !fullStructure.responsesByCode) return <Loading />

  const {
    info: { current, isChangeRequest, firstStrictInvalidPage },
  } = fullStructure

  return (
    <>
      <ChangesRequestedTitle status={current?.status} isChangeRequest={isChangeRequest} />
      <ApplicationHomeWrapper startMessage={template.startMessage} name={template.name}>
        <ApplicationSections fullStructure={structure} />
        {current?.status === ApplicationStatus.Draft && !firstStrictInvalidPage && (
          <Segment basic className="padding-zero" textAlign="right">
            <Button as={Link} color="blue" onClick={handleSummaryClicked}>
              {strings.BUTTON_SUMMARY}
            </Button>
          </Segment>
        )}
      </ApplicationHomeWrapper>
    </>
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
