import React from 'react'
import { Grid, Message } from 'semantic-ui-react'
import { Loading } from '../../components'
import ReviewSectionRowAction from '../../components/Review/ReviewSectionRowAction'
import ReviewSectionRowAssigned from '../../components/Review/ReviewSectionRowAssigned'
import ReviewSectionRowLastDate from '../../components/Review/ReviewSectionRowLastAction'
import ReviewSectionRowProgress from '../../components/Review/ReviewSectionRowProgress'
import strings from '../../utils/constants'
import useGetFullReviewStructure from '../../utils/hooks/useGetFullReviewStructure'
import { AssignmentDetailsNEW, FullStructure, ReviewSectionComponentProps } from '../../utils/types'

// Component renders a line for review assignment within a section
// to be used in ReviewHome and Expansions
type ReviewSectionRowProps = {
  sectionId: number
  assignment: AssignmentDetailsNEW
  fullApplicationStructure: FullStructure
}

const ReviewSectionRow: React.FC<ReviewSectionRowProps> = ({
  sectionId,
  assignment,
  fullApplicationStructure,
}) => {
  const { fullReviewStructure, error } = useGetFullReviewStructure({
    reviewAssignment: assignment,
    fullApplicationStructure,
    filteredSectionIds: [sectionId],
  })

  if (error) return <Message error title={strings.ERROR_GENERIC} list={[error]} />
  if (!fullReviewStructure) return <Loading />
  const section = fullReviewStructure.sortedSections?.find(
    (section) => section.details.id === sectionId
  )
  if (!section) return null

  const thisReview = fullReviewStructure?.thisReview
  const isAssignedToCurrentUser = !!section?.reviewAction?.isAssignedToCurrentUser

  const props: ReviewSectionComponentProps = {
    fullStructure: fullReviewStructure,
    section,
    assignment,
    thisReview,
    isAssignedToCurrentUser,
    action: section?.reviewAction?.action || 'unknown',
  }

  return (
    <>
      {section?.reviewAction?.isReviewable && (
        <Grid columns="equal" verticalAlign="middle">
          <ReviewSectionRowAssigned {...props} />
          <ReviewSectionRowLastDate {...props} />
          <ReviewSectionRowProgress {...props} />
          <ReviewSectionRowAction {...props} />
        </Grid>
      )}{' '}
    </>
  )
}

export default ReviewSectionRow
