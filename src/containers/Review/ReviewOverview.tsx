import React from 'react'
import { Button, Card, Container, Header, List, Message, Segment } from 'semantic-ui-react'
import { Loading } from '../../components'
import useGetReviewAssignment from '../../utils/hooks/useGetReviewAssignment'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import { useRouter } from '../../utils/hooks/useRouter'
import strings from '../../utils/constants'
import { Link } from 'react-router-dom'
import { useCreateReviewMutation } from '../../utils/generated/graphql'

const ReviewOverview: React.FC = () => {
  const {
    push,
    params: { serialNumber },
  } = useRouter()

  const {
    error,
    loading,
    application,
    templateSections,
    isApplicationLoaded,
  } = useLoadApplication({ serialNumber: serialNumber })

  const {
    error: errorAssignment,
    loading: loadingAssignemnt,
    assignment,
    assignedSections,
  } = useGetReviewAssignment({
    application,
    templateSections,
    reviewerId: 6,
    isApplicationLoaded,
  })

  const [createReviewMutation] = useCreateReviewMutation({
    variables: {
      reviewAssigmentId: assignment?.id as number,
    },
  })

  return error || errorAssignment ? (
    <Message error header="Problem to load review homepage" list={[error, errorAssignment]} />
  ) : loading || loadingAssignemnt ? (
    <Loading />
  ) : application && assignment ? (
    <Container>
      <Card fluid>
        <Card.Content>
          <Card.Header>{application.name}</Card.Header>
          <Card.Description>
            This is the Overview/Start page for Reviews of Application {serialNumber}.
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <a
            href={
              'https://github.com/openmsupply/application-manager-web-app/issues/200#issuecomment-741432161'
            }
          >
            Click here for explanation.
          </a>
        </Card.Content>
      </Card>
      {assignedSections && (
        <Segment>
          <Header as="h5">Sections assigned to you:</Header>
          <List>
            {assignedSections.map((section) => (
              <List.Item>{section}</List.Item>
            ))}
          </List>
        </Segment>
      )}
      {assignment.review ? (
        <Button as={Link} to={`/review/${serialNumber}/${assignment.review?.id}`}>
          {strings.BUTTON_REVIEW_CONTINUE}
        </Button>
      ) : (
        <Button
          onClick={() => {
            createReviewMutation()
          }}
        >
          {strings.BUTTON_REVIEW_START}
        </Button>
      )}
    </Container>
  ) : (
    <Header as="h2" icon="exclamation circle" content="No review found!" />
  )
}

export default ReviewOverview
