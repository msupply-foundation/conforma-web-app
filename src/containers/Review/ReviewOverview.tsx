import React, { useEffect } from 'react'
import {
  Button,
  Grid,
  Header,
  Icon,
  Label,
  List,
  Message,
  Progress,
  Segment,
} from 'semantic-ui-react'
import { Loading, NoMatch } from '../../components'
import useGetReviewAssignment from '../../utils/hooks/useGetReviewAssignment'
import { useRouter } from '../../utils/hooks/useRouter'
import strings from '../../utils/constants'
import { Link } from 'react-router-dom'
import { ReviewStatus } from '../../utils/generated/graphql'
import { AssignmentDetails, SectionDetails } from '../../utils/types'
import useCreateReview from '../../utils/hooks/useCreateReview'
import { useUserState } from '../../contexts/UserState'

// TODO: Rename to ReviewStart
const ReviewOverview: React.FC = () => {
  const {
    push,
    params: { serialNumber },
  } = useRouter()
  const {
    userState: { currentUser },
  } = useUserState()

  const { error, loading, application, assignment, sectionsAssigned } = useGetReviewAssignment({
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

  const getProgresOrLabel = ({ assigned, progress }: SectionDetails) => {
    if (assigned) {
      if (progress && progress.done > 0 && progress.total > 0) {
        return (
          <Progress
            percent={(100 * progress.done) / progress.total}
            size="tiny"
            success={progress.valid}
            error={!progress.valid}
          />
        )
      } else if (!assignment?.review) {
        return (
          <Segment vertical>
            <Icon name="circle" size="mini" color="blue" />
            <Label basic>{strings.LABEL_ASSIGNED_TO_YOU}</Label>
          </Segment>
        )
      } else return <Label basic>MISSING PROGRESS... TODO</Label>
    } else return <p>{strings.LABEL_ASSIGNED_TO_OTHER}</p>
  }

  const getActionButton = ({ review }: AssignmentDetails) => {
    if (review) {
      const getLabel = (status: string) => {
        // TODO: Not use strings here - use the type
        switch (status) {
          case 'Draft':
            return strings.BUTTON_REVIEW_CONTINUE
          case 'Pending':
            return strings.BUTTON_REVIEW_RE_REVIEW
          case 'ChangesRequested':
            return strings.BUTTON_REVIEW_MAKE_UPDATES
          case 'Submitted' || 'Locked':
            return strings.BUTTON_REVIEW_VIEW
          default:
            return status
        }
      }

      const { id, status } = review
      return (
        <Button
          as={Link}
          to={`/application/${serialNumber}/review/${id}`}
          content={getLabel(status)}
        />
      )
    }
    return (
      <Button loading={processing} onClick={handleCreate}>
        {strings.BUTTON_REVIEW_START}
      </Button>
    )
  }

  return error ? (
    <NoMatch />
  ) : loading ? (
    <Loading />
  ) : application && assignment ? (
    <Segment.Group>
      <Segment textAlign="center">
        <Label color="blue">{strings.STAGE_PLACEHOLDER}</Label>
        <Header content={application.name} subheader={strings.DATE_APPLICATION_PLACEHOLDER} />
        <Header
          as="h3"
          color="grey"
          content={strings.TITLE_REVIEW_SUMMARY}
          subheader={strings.SUBTITLE_REVIEW}
        />
      </Segment>
      <Segment
        style={{
          backgroundColor: 'white',
          padding: 10,
          margin: '0px 50px',
          minHeight: 500,
          flex: 1,
        }}
      >
        <List divided relaxed="very">
          {sectionsAssigned &&
            sectionsAssigned.map((section) => {
              const { code: sectionCode, progress, title } = section
              return (
                <List.Item
                  key={`list-item-${sectionCode}`}
                  children={
                    <Grid>
                      <Grid.Column width={10}>
                        <p>{title}</p>
                      </Grid.Column>
                      <Grid.Column width={4}>{getProgresOrLabel(section)}</Grid.Column>
                      <Grid.Column width={2}>
                        {progress && (
                          <Button color="blue">{strings.BUTTON_APPLICATION_RESUME}</Button>
                        )}
                      </Grid.Column>
                    </Grid>
                  }
                ></List.Item>
              )
            })}
        </List>
        {getActionButton(assignment)}
      </Segment>
      <Segment>
        {createReviewError && (
          <Message error header={strings.ERROR_REVIEW_OVERVIEW}>
            {createReviewError}
          </Message>
        )}
      </Segment>
    </Segment.Group>
  ) : (
    <Message error content={strings.ERROR_REVIEW_OVERVIEW} />
  )
}

export default ReviewOverview
