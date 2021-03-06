import { Button, Header, Label, Segment } from 'semantic-ui-react'
import { Loading, NoMatch } from '../../components'
import {
  AssignmentDetailsNEW,
  FullStructure,
  PageNEW,
  ResponsesByCode,
  SectionStateNEW,
} from '../../utils/types'

import {
  ReviewResponseDecision,
  ReviewStatus,
  useUpdateReviewResponseMutation,
} from '../../utils/generated/graphql'
import strings from '../../utils/constants'

import useGetFullReviewStructure from '../../utils/hooks/useGetFullReviewStructure'
import SectionWrapper from '../../components/Application/SectionWrapper'
import React from 'react'
import useQuerySectionActivation from '../../utils/hooks/useQuerySectionActivation'

import useScrollableAttachments, {
  ScrollableAttachment,
} from '../../utils/hooks/useScrollableAttachments'
import ReviewSubmit from '../../components/Review/ReviewSubmit'

const ReviewPage: React.FC<{
  reviewAssignment: AssignmentDetailsNEW
  structure: FullStructure
}> = ({ reviewAssignment, structure }) => {
  const { fullStructure, error } = useGetFullReviewStructure({
    reviewAssignmentId: reviewAssignment.id,
    structure,
  })

  const { isSectionActive, toggleSection } = useQuerySectionActivation({
    defaultActiveSectionCodes: [],
  })

  const { addScrollable, scrollTo } = useScrollableAttachments()

  if (error) return <NoMatch />
  if (!fullStructure) return <Loading />
  const { sections, responsesByCode, info } = fullStructure
  return (
    <>
      <Segment.Group>
        <Segment textAlign="center">
          <Label color="blue">{strings.STAGE_PLACEHOLDER}</Label>
          <Header content={structure.info.name} subheader={strings.DATE_APPLICATION_PLACEHOLDER} />
          <Header
            as="h3"
            color="grey"
            content={strings.TITLE_REVIEW_SUMMARY}
            subheader={strings.SUBTITLE_REVIEW}
          />
        </Segment>
        <Segment basic style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {Object.values(sections).map((section) => (
            <SectionWrapper
              key={`ApplicationSection_${section.details.id}`}
              isActive={isSectionActive(section.details.code)}
              toggleSection={toggleSection(section.details.code)}
              section={section}
              extraSectionTitleContent={(section: SectionStateNEW) => (
                <SectionProgress section={section} />
              )}
              extraPageContent={(page: PageNEW) => <MassApprovalButton page={page} />}
              scrollableAttachment={(page: PageNEW) => (
                <ScrollableAttachment
                  code={`${section.details.code}P${page.number}`}
                  addScrollabe={addScrollable}
                />
              )}
              responsesByCode={responsesByCode as ResponsesByCode}
              serial={info.serial}
              isReview
              canEdit={reviewAssignment?.review?.status === ReviewStatus.Draft}
            />
          ))}
        </Segment>
        <Segment
          basic
          style={{
            marginLeft: '10%',
            marginRight: '10%',
          }}
        >
          <ReviewSubmit
            structure={fullStructure}
            reviewAssignment={reviewAssignment}
            scrollTo={scrollTo}
          />
        </Segment>
      </Segment.Group>
    </>
  )
}

const SectionProgress: React.FC<{ section: SectionStateNEW }> = ({ section }) => {
  const reviewProgress = section.reviewProgress
  return (
    <>{`t: ${reviewProgress?.totalReviewable} dC: ${reviewProgress?.doneConform} dNC:  ${reviewProgress?.doneNonConform} `}</>
  )
}

const MassApprovalButton: React.FC<{ page: PageNEW }> = ({ page }) => {
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

  return <Button onClick={massApprove}>{`Approve (${responsesToReview.length})`}</Button>
}

export default ReviewPage
