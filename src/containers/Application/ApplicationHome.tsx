import React, { useEffect } from 'react'
import { Button, Header, Message, Segment } from 'semantic-ui-react'
import { FullStructure, SectionAndPage, StageAndStatus, TemplateDetails } from '../../utils/types'
import useGetApplicationStructure from '../../utils/hooks/useGetApplicationStructure'
import { ApplicationHeader, Loading } from '../../components'
import strings from '../../utils/constants'
import { useUserState } from '../../contexts/UserState'
import { SectionsProgress } from '../../components/Application/Sections'
import { useRouter } from '../../utils/hooks/useRouter'
import { ApplicationStatus } from '../../utils/generated/graphql'
import { Link } from 'react-router-dom'
import useRestartApplication from '../../utils/hooks/useRestartApplication'
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

  const restartApplication = useRestartApplication(serialNumber)

  useEffect(() => {
    if (!fullStructure) return
    const { status } = fullStructure.info.current as StageAndStatus
    if (status !== ApplicationStatus.Draft && status !== ApplicationStatus.ChangesRequired)
      replace(`/application/${serialNumber}/summary`)
  }, [fullStructure])

  const handleResumeClick = ({ sectionCode, pageNumber }: SectionAndPage) => {
    push(`/application/${serialNumber}/${sectionCode}/Page${pageNumber}`)
  }

  const handleSummaryClicked = () => {
    push(`/application/${serialNumber}/summary`)
  }

  if (error) return <Message error title={strings.ERROR_GENERIC} list={[error]} />
  if (!fullStructure || !fullStructure.responsesByCode) return <Loading />

  const {
    info: { current, isChangeRequest, firstStrictInvalidPage },
    sections,
  } = fullStructure

  return (
    <ApplicationHeader template={template} currentUser={currentUser}>
      <ChangesRequestedTitle status={current?.status} isChangeRequest={isChangeRequest} />
      <ApplicationHomeWrapper startMessage={template.startMessage}>
        <SectionsProgress
          changesRequested={isChangeRequest}
          draftStatus={current?.status === ApplicationStatus.Draft}
          sections={sections}
          firstStrictInvalidPage={firstStrictInvalidPage}
          restartApplication={async ({ sectionCode, pageNumber }) => {
            await restartApplication(fullStructure)
            push(`/application/${serialNumber}/${sectionCode}/Page${pageNumber}`)
          }}
          resumeApplication={handleResumeClick}
        />
      </ApplicationHomeWrapper>
      {current?.status === ApplicationStatus.Draft && !firstStrictInvalidPage && (
        <Segment basic className="padding-zero" textAlign="right">
          <Button as={Link} color="blue" onClick={handleSummaryClicked}>
            {strings.BUTTON_SUMMARY}
          </Button>
        </Segment>
      )}
    </ApplicationHeader>
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
