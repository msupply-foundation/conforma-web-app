import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Container, Header, Message } from 'semantic-ui-react'
import { Loading } from '../../components'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import { useRouter } from '../../utils/hooks/useRouter'

const ReviewOverview: React.FC = () => {
  // Logic for what this page will show:
  // https://github.com/openmsupply/application-manager-web-app/issues/200#issuecomment-741432161

  // Hooks (suggested):
  // - useLoadApplication
  // - useGetResponsesAndElementState
  // - new Hook to get existing Review information

  // Hook(s) will fetch Application & Review info (if it exists). If user is supposed to start a new review, there will be some information about what Sections/Questions they've been assigned to.
  // And there will be a "Start Review" button. On clicking it, a new Review will be created, its ID returned, and this page will re-direct to the new Review URL.

  const {
    params: { serialNumber },
  } = useRouter()

  const { error, loading, application, appStatus, isApplicationLoaded } = useLoadApplication({
    serialNumber: serialNumber,
  })

  return error ? (
    <Message error header="Problem to load review homepage" list={[error]} />
  ) : loading ? (
    <Loading />
  ) : application ? (
    <Container>
      <Card fluid>
        <Card.Content>
          <Card.Header>{application.name}</Card.Header>
          <Card.Description>
            This is the Overview/Start page for Reviews of Application {serialNumber}.
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          See{' '}
          <a
            href={
              'https://github.com/openmsupply/application-manager-web-app/issues/200#issuecomment-741432161'
            }
          >
            here
          </a>{' '}
          for explanation.
        </Card.Content>
      </Card>
    </Container>
  ) : (
    <Header as="h2" icon="exclamation circle" content="No review found!" />
  )
}

export default ReviewOverview
