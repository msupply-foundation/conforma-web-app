import React, { useEffect } from 'react'
import { Button, Card, Container, Header, List, Message, Segment } from 'semantic-ui-react'
import { Loading } from '../../components'
import useGetReviewAssignment from '../../utils/hooks/useGetReviewAssignment'
import { useRouter } from '../../utils/hooks/useRouter'
import strings from '../../utils/constants'
import { Link } from 'react-router-dom'
import { ReviewStatus } from '../../utils/generated/graphql'
import { AssignmentDetails } from '../../utils/types'
import useCreateReview from '../../utils/hooks/useCreateReview'
import { useUserState } from '../../contexts/UserState'

const ReviewOverview: React.FC = () => {
  const {
    push,
    params: { serialNumber },
  } = useRouter()
  const {
    userState: { currentUser },
  } = useUserState()

  const {
    error: fetchAssignmentError,
    loading,
    application,
    assignment,
    assignedSections,
  } = useGetReviewAssignment({
    reviewerId: currentUser?.userId as number,
    serialNumber,
  })

  useEffect(() => {
    if (assignment && assignment.review) {
      const { id, status } = assignment.review
      if (status === ReviewStatus.Submitted || status === ReviewStatus.Draft)
        push(`/application/${serialNumber}/review/${id}`)
    }
  }, [assignment])

  const { processing, error: createReviewError, create } = useCreateReview({
    onCompleted: (id: number) => {
      if (serialNumber) {
        // Call Review page after creation
        push(`/application/${serialNumber}/review/${id}`)
      }
    },
  })

  const handleCreate = (_: any) => {
    if (!assignment) {
      console.log('Problem to create review - unexpected parameters')
      return
    }

    create({
      reviewAssigmentId: assignment.id,
      applicationResponses: assignment.questions.map(({ responseId }) => ({
        applicationResponseId: responseId,
      })),
    })
  }

  const getActionButton = ({ review }: AssignmentDetails) => {
    if (review) {
      const { id, status } = review
      if (
        review.status === ReviewStatus.ReviewPending ||
        review.status === ReviewStatus.ChangesRequired
      ) {
        return (
          <Button as={Link} to={`/application/${serialNumber}/review/${id}`}>
            {strings.BUTTON_REVIEW_CONTINUE}
          </Button>
        )
      }
      console.log(`Problem with review id ${id} status: ${status}`)
      return null
    }
    return (
      <Button loading={processing} onClick={handleCreate}>
        {strings.BUTTON_REVIEW_START}
      </Button>
    )
  }

  return fetchAssignmentError || createReviewError ? (
    <Message
      error
      header={strings.ERROR_REVIEW_OVERVIEW}
      list={[fetchAssignmentError, createReviewError]}
    />
  ) : loading ? (
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
              <List.Item key={`ReviewSection_${section}`}>{section}</List.Item>
            ))}
          </List>
        </Segment>
      )}
      {getActionButton(assignment)}
    </Container>
    )
  )
}

export default ReviewOverview
