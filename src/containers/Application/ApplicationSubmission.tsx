import React, { useEffect } from 'react'
import { Container, Header, Icon, Message, Segment } from 'semantic-ui-react'
import { Loading } from '../../components'
import strings from '../../utils/constants'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import { useRouter } from '../../utils/hooks/useRouter'
import { useUserState } from '../../contexts/UserState'

const ApplicationSubmission: React.FC = () => {
  const {
    userState: { currentUser },
  } = useUserState()

  const { query, push } = useRouter()
  const { serialNumber } = query
  const { error, loading, appStatus } = useLoadApplication({
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
    <Container textAlign="center">
      <Segment>
        <Header icon>
          <Icon name="clock outline" color="blue" size="huge" />
          {strings.LABEL_PROCESSING}
        </Header>
      </Segment>
    </Container>
  ) : (
    <Message error header={strings.ERROR_APPLICATION_SUBMISSION} />
  )
}

export default ApplicationSubmission
