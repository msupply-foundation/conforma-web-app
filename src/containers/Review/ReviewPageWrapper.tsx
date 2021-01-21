import React, { useEffect, useState } from 'react'
import { Button, Header, Label, Message, Segment } from 'semantic-ui-react'
import { DecisionArea, Loading, ReviewSection } from '../../components'
import { DecisionAreaState, ReviewQuestionDecision, SectionDetails, User } from '../../utils/types'
import useLoadReview from '../../utils/hooks/useLoadReview'
import { useRouter } from '../../utils/hooks/useRouter'
import { ReviewResponseDecision } from '../../utils/generated/graphql'
import strings from '../../utils/constants'
import { SummaryViewWrapperProps } from '../../formElementPlugins/types'
import { useUserState } from '../../contexts/UserState'
import messages from '../../utils/messages'
import useSubmitReview from '../../utils/hooks/useSubmitReview'
import useUpdateRevieResponse from '../../utils/hooks/useUpdateReviewResponse'
import validateReview from '../../utils/helpers/review/validateReview'

const decisionAreaInitialState = { open: false, review: null, summaryViewProps: null }

const ReviewPageWrapper: React.FC = () => {
  const {
    params: { serialNumber, reviewId },
    push,
  } = useRouter()
  const {
    userState: { currentUser },
  } = useUserState()
  const [reviewProblem, setReviewProblem] = useState<string>('')
  const [decisionState, setDecisionState] = useState<DecisionAreaState>(decisionAreaInitialState)
  const { review } = decisionState
  const [invalidSection, setInvalidSection] = useState<SectionDetails>()

  // Will wait for trigger to run that will set the Review status as DRAFT (after creation)
  const { error, loading, applicationName, responsesByCode, reviewSections } = useLoadReview({
    reviewId: Number(reviewId),
    serialNumber,
  })

  const { updateReviewResponse, error: updateError, updating } = useUpdateRevieResponse({
    reviewId: Number(reviewId),
    serialNumber,
  })

  const { submit, error: submitError, submitted, processing } = useSubmitReview({
    reviewId: Number(reviewId),
  })

  useEffect(() => {
    if (!submitted || processing) return
    if (!submitError) push(`/application/${serialNumber}/review/${reviewId}/submission`)
    else console.log(submitError)
  }, [submitted, processing])

  const updateResponses = async (array: ReviewQuestionDecision[]) => {
    array.forEach((reviewResponse) => {
      updateReviewResponse({ variables: { ...reviewResponse } })
    })
    if (invalidSection) {
      validateReview
    }
  }

  const openDecisionArea = (
    review: ReviewQuestionDecision,
    summaryViewProps: SummaryViewWrapperProps
  ) => {
    setDecisionState({
      open: true,
      review: {
        id: review.id,
        decision: review.decision,
        comment: review.comment,
      },
      summaryViewProps,
    })
  }

  const validateReviewHandler = (): boolean => {
    const { userId } = currentUser as User
    const invalidSection = validateReview({ userId, reviewSections })
    setInvalidSection(invalidSection)
    return invalidSection === undefined
  }

  const submitResponseHandler = (_: any) => {
    if (review) {
      const { id, comment, decision } = review
      if (decision === ReviewResponseDecision.Decline && comment === '')
        setReviewProblem(messages.REVIEW_RESUBMIT_COMMENT)
      else {
        updateReviewResponse({ variables: { ...review } })
        setDecisionState(decisionAreaInitialState)
        validateReviewHandler()
      }
    }
  }

  const submitReviewHandler = (_: any) => {
    if (validateReviewHandler() && !updating && !processing) {
      submit()
    }
  }

  return error ? (
    <Message error header={strings.ERROR_REVIEW_PAGE} list={[error]} />
  ) : loading ? (
    <Loading />
  ) : reviewSections && responsesByCode ? (
    <>
      <Segment.Group>
        <Segment textAlign="center">
          <Label color="blue">{strings.STAGE_PLACEHOLDER}</Label>
          <Header content={applicationName} subheader={strings.DATE_APPLICATION_PLACEHOLDER} />
          <Header
            as="h3"
            color="grey"
            content={strings.TITLE_REVIEW_SUMMARY}
            subheader={strings.SUBTITLE_REVIEW}
          />
        </Segment>
        <Segment basic>
          {reviewSections.map((reviewSection) => {
            const { userId } = currentUser as User
            const assignedToYou = reviewSection.assigned?.id === userId
            return (
              <ReviewSection
                key={`Review_${reviewSection.section.code}`}
                allResponses={responsesByCode}
                assignedToYou={assignedToYou}
                reviewSection={reviewSection}
                updateResponses={updateResponses}
                setDecisionArea={openDecisionArea}
                canEdit={true} // TODO: Check Review status
                showError={reviewSection.section === invalidSection}
              />
            )
          })}
        </Segment>
        <Segment
          basic
          style={{
            marginLeft: '10%',
            marginRight: '10%',
          }}
        >
          <Button
            size="medium"
            color={invalidSection ? 'red' : 'blue'}
            loading={updating}
            content={strings.BUTTON_REVIEW_SUBMIT}
            onClick={submitReviewHandler}
          />
          {invalidSection && <p>{messages.REVIEW_SUBMIT_FAIL}</p>}
        </Segment>
      </Segment.Group>
      <DecisionArea
        state={decisionState}
        setDecision={setDecisionState}
        submitHandler={submitResponseHandler}
        problemMessage={reviewProblem}
        setProblemMessage={setReviewProblem}
      />
    </>
  ) : (
    <Message error header={strings.ERROR_REVIEW_PAGE} />
  )
}

export default ReviewPageWrapper
