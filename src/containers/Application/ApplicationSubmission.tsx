import React, { useEffect } from 'react'
import { Container, Header, Icon, Message, Segment } from 'semantic-ui-react'
import { Loading } from '../../components'
import strings from '../../utils/constants'
import { useRouter } from '../../utils/hooks/useRouter'
import { useUserState } from '../../contexts/UserState'
import useGetApplicationStatus from '../../utils/hooks/useGetApplicationStatus'

const ApplicationSubmission: React.FC = () => {
  const {
    userState: { currentUser },
  } = useUserState()

  const { query, push } = useRouter()
  const { serialNumber } = query

  const { error, loading, appStatus } = useGetApplicationStatus({
    serialNumber: serialNumber as string,
  })

  useEffect(() => {
    // Check application status is different to Submitted and send to summary page
    // Note: The summary page has its own redirect logic to any specific page.
    if (!appStatus) return
    if (appStatus?.status !== 'SUBMITTED') {
      push(`/application/${serialNumber}/summary`)
    }
  }, [appStatus])

  return error ? (
    <Message error header={strings.ERROR_APPLICATION_SUBMISSION} list={[error]} />
  ) : loading ? (
    <Loading />
  ) : serialNumber && appStatus ? (
    <Container>
      <Segment textAlign="center">
        <Header icon>
          <Icon name="clock outline" color="blue" size="huge" />
          {strings.LABEL_PROCESSING}
        </Header>
        <Header></Header>
      </Segment>
      <Header as="h3">{strings.SUBTITLE_SUBMISSION_STEPS}</Header>
    </Container>
  ) : (
    <Message error header={strings.ERROR_APPLICATION_SUBMISSION} />
  )
}

export default ApplicationSubmission
