import React, { CSSProperties } from 'react'
import { Button, Header, Icon, Message, Segment, Container, Label } from 'semantic-ui-react'
import { Loading, SectionWrapper } from '../../components'
import {
  AssignmentDetails,
  FullStructure,
  Page,
  ResponsesByCode,
  SectionState,
} from '../../utils/types'

import {
  ReviewResponseDecision,
  ReviewResponseStatus,
  ReviewStatus,
  useUpdateReviewResponseMutation,
} from '../../utils/generated/graphql'
import strings from '../../utils/constants'

import useGetReviewStructureForSections from '../../utils/hooks/useGetReviewStructureForSection'
import useQuerySectionActivation from '../../utils/hooks/useQuerySectionActivation'

import useScrollableAttachments, {
  ScrollableAttachment,
} from '../../utils/hooks/useScrollableAttachments'
import { ReviewHeader } from '../../components/Review'
import { ReviewStatusOrProgress } from '../../components/Sections'
import ReviewSubmit from './ReviewSubmit'
import { useUserState } from '../../contexts/UserState'

const ReviewPage: React.FC<{
  reviewAssignment: AssignmentDetails
  fullApplicationStructure: FullStructure
}> = ({ reviewAssignment, fullApplicationStructure }) => {
  const {
    userState: { currentUser },
  } = useUserState()

  const { fullReviewStructure, error } = useGetReviewStructureForSections({
    reviewAssignment,
    fullApplicationStructure,
  })

  const { isSectionActive, toggleSection } = useQuerySectionActivation({
    defaultActiveSectionCodes: [],
  })

  const { addScrollable, scrollTo } = useScrollableAttachments()

  if (error) return <Message error title={strings.ERROR_GENERIC} list={[error]} />
  if (!fullReviewStructure) return <Loading />

  // TODO decide how to handle this, and localise if not deleted
  if (
    reviewAssignment?.reviewer?.id !== currentUser?.userId &&
    fullReviewStructure?.thisReview?.status !== ReviewStatus.Submitted
  )
    return <Header>Review in Progress</Header>

  const {
    sections,
    responsesByCode,
    info: {
      serial,
      current: { stage },
      name,
    },
    attemptSubmission,
    firstIncompleteReviewPage,
  } = fullReviewStructure

  const isMissingReviewResponses = (section: string): boolean =>
    attemptSubmission && firstIncompleteReviewPage?.sectionCode === section

  const ReviewMain: React.FC = () => (
    <>
      <div id="application-summary-content">
        {Object.values(sections).map((section) => (
          <SectionWrapper
            key={`ApplicationSection_${section.details.id}`}
            isActive={isSectionActive(section.details.code)}
            toggleSection={toggleSection(section.details.code)}
            section={section}
            failed={isMissingReviewResponses(section.details.code)}
            extraSectionTitleContent={(section: SectionState) => (
              <div>
                {isMissingReviewResponses(section.details.code) && (
                  <Label
                    icon={<Icon name="exclamation circle" color="pink" />}
                    className="simple-label alert-text"
                    content={strings.LABEL_REVIEW_SECTION}
                  />
                )}
                <ReviewStatusOrProgress {...section} />
              </div>
            )}
            extraPageContent={(page: Page) => <ApproveAllButton page={page} />}
            scrollableAttachment={(page: Page) => (
              <ScrollableAttachment
                code={`${section.details.code}P${page.number}`}
                addScrollabe={addScrollable}
              />
            )}
            responsesByCode={responsesByCode as ResponsesByCode}
            applicationData={fullApplicationStructure.info}
            serial={serial}
            isReview
            canEdit={
              reviewAssignment?.review?.status === ReviewStatus.Draft ||
              reviewAssignment?.review?.status === ReviewStatus.Locked
            }
          />
        ))}
        <ReviewSubmit structure={fullReviewStructure} scrollTo={scrollTo} />
      </div>
    </>
  )

  return error ? (
    <Message error title={strings.ERROR_GENERIC} list={[error]} />
  ) : (
    <ReviewHeader
      applicationStage={stage.name || ''}
      applicationStageColour={stage.colour}
      applicationName={name}
      currentUser={currentUser}
      ChildComponent={ReviewMain}
    />
  )
}

const ApproveAllButton: React.FC<{ page: Page }> = ({ page }) => {
  const [updateReviewResponse] = useUpdateReviewResponseMutation()

  const reviewResponses = page.state.map((element) => element.thisReviewLatestResponse)

  const responsesToReview = reviewResponses.filter(
    (reviewResponse) => reviewResponse && !reviewResponse?.decision
  )

  const massApprove = () => {
    responsesToReview.forEach((reviewResponse) => {
      if (!reviewResponse) return
      updateReviewResponse({
        variables: { id: reviewResponse.id, decision: ReviewResponseDecision.Approve },
      })
    })
  }

  if (responsesToReview.length === 0) return null
  if (responsesToReview.some((response) => response?.status !== ReviewResponseStatus.Draft))
    return null

  return (
    <div className="right-justify-content review-approve-all-button">
      <Button
        primary
        inverted
        onClick={massApprove}
        content={`${strings.BUTTON_REVIEW_APPROVE_ALL} (${responsesToReview.length})`}
      />
    </div>
  )
}

export default ReviewPage
