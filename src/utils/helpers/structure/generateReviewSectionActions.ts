import { ReviewStatus, ReviewAssignmentStatus } from '../../generated/graphql'
import { SectionState, AssignmentDetails, ReviewDetails, ReviewAction } from '../../types'

type GenerateSectionActions = (props: {
  sections: SectionState[]
  reviewAssignment: AssignmentDetails
  thisReview?: ReviewDetails | null
  currentUserId: number
}) => void

type ActionDefinition = {
  action: ReviewAction
  checkMethod: (props: {
    reviewLevel: number
    isReviewable: boolean
    isAssignedToCurrentUser: boolean
    reviewAssignmentStatus: ReviewAssignmentStatus | null
    isPendingReview: boolean
    isReviewExisting: boolean
    reviewStatus: ReviewStatus | undefined
    isCurrentUserReview: boolean
    isReviewActive: boolean
  }) => boolean
}

const actionDefinitions: ActionDefinition[] = [
  {
    action: ReviewAction.canStartReview,
    checkMethod: ({ reviewAssignmentStatus, isPendingReview, isReviewExisting }) =>
      reviewAssignmentStatus === ReviewAssignmentStatus.Assigned &&
      !isReviewExisting &&
      isPendingReview,
  },
  {
    action: ReviewAction.canReReview,
    checkMethod: ({ reviewStatus, reviewLevel }) =>
      reviewStatus === ReviewStatus.Pending && reviewLevel === 1,
  },
  {
    action: ReviewAction.canStartReview,
    checkMethod: ({ reviewStatus, reviewLevel, isReviewActive }) =>
      reviewStatus === ReviewStatus.Pending && reviewLevel > 1 && !isReviewActive,
  },
  {
    action: ReviewAction.canContinue,
    checkMethod: ({ reviewStatus, reviewLevel, isReviewActive }) =>
      reviewStatus === ReviewStatus.Pending && reviewLevel > 1 && isReviewActive,
  },
  {
    action: ReviewAction.canSelfAssign,
    checkMethod: ({ reviewAssignmentStatus, isCurrentUserReview }) =>
      reviewAssignmentStatus === ReviewAssignmentStatus.AvailableForSelfAssignment &&
      isCurrentUserReview,
  },
  {
    action: ReviewAction.canContinue,
    checkMethod: ({ reviewStatus, isReviewActive }) =>
      reviewStatus === ReviewStatus.Draft && isReviewActive,
  },
  {
    action: ReviewAction.canView,
    checkMethod: ({ reviewStatus, isReviewActive }) =>
      reviewStatus === ReviewStatus.Draft && !isReviewActive,
  },
  {
    action: ReviewAction.canView,
    checkMethod: ({ reviewStatus }) => reviewStatus === ReviewStatus.Submitted,
  },
  {
    action: ReviewAction.canContinueLocked,
    checkMethod: ({ reviewStatus }) => reviewStatus === ReviewStatus.Locked,
  },
  {
    action: ReviewAction.canUpdate,
    checkMethod: ({ reviewStatus }) => reviewStatus === ReviewStatus.ChangesRequested,
  },
]

const generateReviewSectionActions: GenerateSectionActions = ({
  sections,
  reviewAssignment,
  thisReview,
  currentUserId,
}) => {
  const isCurrentUserReview = reviewAssignment.reviewer.id === currentUserId

  sections.forEach((section) => {
    const isReviewable = (section.reviewAndConsolidationProgress?.totalReviewable || 0) > 0
    const isAssignedToCurrentUser = isCurrentUserReview && isReviewable

    const checkMethodProps = {
      isReviewable,
      isAssignedToCurrentUser,
      isCurrentUserReview,
      reviewLevel: reviewAssignment.level,
      reviewAssignmentStatus: reviewAssignment.status,
      isReviewExisting: !!thisReview,
      reviewStatus: thisReview?.status,
      isPendingReview: (section.reviewAndConsolidationProgress?.totalPendingReview || 0) > 0,
      isReviewActive: (section.reviewAndConsolidationProgress?.totalActive || 0) > 0,
    }

    const foundAction = actionDefinitions.find(({ checkMethod }) => checkMethod(checkMethodProps))
    console.log(
      foundAction?.action,
      reviewAssignment.reviewer.firstName,
      section.details.code,
      thisReview?.status,
      !!thisReview,
      section.reviewProgress
    )

    section.reviewAction = {
      isAssignedToCurrentUser,
      isReviewable,
      action: foundAction ? foundAction.action : ReviewAction.unknown,
    }
  })
}

export default generateReviewSectionActions
