import React, { useEffect } from 'react'
import { Container, Header, Icon, List, Message, Segment } from 'semantic-ui-react'
import { Loading } from '../../components'
import strings from '../../utils/constants'
import { useRouter } from '../../utils/hooks/useRouter'
import { useUserState } from '../../contexts/UserState'
import useGetApplicationStatus from '../../utils/hooks/useGetApplicationStatus'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import { ApplicationStatus } from '../../utils/generated/graphql'

const ApplicationSubmission: React.FC = () => {
  const {
    userState: { currentUser },
  } = useUserState()

  const { query, push } = useRouter()
  const { serialNumber } = query

  const { error, loading, isApplicationLoaded } = useLoadApplication({
    serialNumber: serialNumber as string,
  })

  const {
    error: statusError,
    loading: statusLoading,
    appStatus,
    appStages,
  } = useGetApplicationStatus({
    serialNumber: serialNumber as string,
    isApplicationLoaded,
  })

  useEffect(() => {
    if (statusLoading) return
    // Check if application is in Draft or Changes required status and redirect to the summary page
    // Note: The summary page has its own redirection logic to ay specific page (with invalid items).
    if (
      appStatus?.status === ApplicationStatus.Draft ||
      appStatus?.status === ApplicationStatus.ChangesRequired
    ) {
      push(`/application/${serialNumber}/summary`)
    }
  }, [appStatus])

  return error ? (
    <Message error header={strings.ERROR_APPLICATION_SUBMISSION} list={[error]} />
  ) : loading ? (
    <Loading />
  ) : serialNumber && appStatus ? (
    <Segment.Group style={{ backgroundColor: 'Gainsboro', display: 'flex' }}>
      <Header textAlign="center">{strings.TITLE_COMPANY_PLACEHOLDER}</Header>
      <Segment
        textAlign="center"
        style={{
          backgroundColor: 'white',
          padding: 10,
          margin: '0px 50px',
          minHeight: 500,
          flex: 1,
        }}
      >
        <Header icon>
          <Icon name="clock outline" color="blue" size="huge" />
          {strings.LABEL_PROCESSING}
        </Header>
        {appStages && <Header as="h3">{appStages.submissionMessage}</Header>}
        {appStages && (
          <Segment basic textAlign="left" style={{ margin: '50px 50px', padding: 10 }}>
            <Header as="h5">{strings.SUBTITLE_SUBMISSION_STEPS}</Header>
            <List>
              {appStages.stages.map((stage) => {
                const { title, description } = stage
                return title ? (
                  <List.Item key={`list_stage_${title}`}>
                    <List.Header>{title}</List.Header>
                    {description}
                  </List.Item>
                ) : null
              })}
            </List>
          </Segment>
        )}
      </Segment>
    </Segment.Group>
  ) : (
    <Message error header={strings.ERROR_APPLICATION_SUBMISSION} />
  )
}

export default ApplicationSubmission
