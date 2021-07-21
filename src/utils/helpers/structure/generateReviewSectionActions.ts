import { ReviewStatus, ReviewAssignmentStatus } from '../../generated/graphql'
import {
  SectionState,
  AssignmentDetails,
  ReviewDetails,
  ReviewAction,
  ConsolidationProgress,
  ReviewProgress,
} from '../../types'

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
    isFinalDecision: boolean
    reviewAssignmentStatus: ReviewAssignmentStatus | null
    isPendingReview: boolean
    isReviewExisting: boolean
    reviewStatus: ReviewStatus | undefined
    isReviewActive: boolean
  }) => boolean
}

const actionDefinitions: ActionDefinition[] = [
  {
    action: ReviewAction.canMakeDecision,
    checkMethod: ({ reviewAssignmentStatus, isFinalDecision, isReviewExisting }) =>
      reviewAssignmentStatus === ReviewAssignmentStatus.Assigned &&
      !isReviewExisting &&
      isFinalDecision,
  },
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
    action: ReviewAction.canReStartReview,
    checkMethod: ({ reviewStatus, reviewLevel, isReviewActive }) =>
      reviewStatus === ReviewStatus.Pending && reviewLevel > 1 && !isReviewActive,
  },
  {
    action: ReviewAction.canContinue,
    checkMethod: ({ reviewStatus, reviewLevel, isReviewActive }) =>
      reviewStatus === ReviewStatus.Pending && reviewLevel > 1 && isReviewActive,
  },
  {
    action: ReviewAction.canContinueLocked,
    checkMethod: ({ reviewStatus }) => reviewStatus === ReviewStatus.Locked,
  },
  {
    action: ReviewAction.canSelfAssign,
    checkMethod: ({ reviewAssignmentStatus }) =>
      reviewAssignmentStatus === ReviewAssignmentStatus.AvailableForSelfAssignment,
  },
  {
    action: ReviewAction.canSelfAssignLocked,
    checkMethod: ({ reviewAssignmentStatus }) =>
      reviewAssignmentStatus === ReviewAssignmentStatus.SelfAssignedByAnother,
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
    action: ReviewAction.canUpdate,
    checkMethod: ({ reviewStatus }) => reviewStatus === ReviewStatus.ChangesRequested,
  },
]

const generateReviewSectionActions: GenerateSectionActions = ({
  sections,
  reviewAssignment: {
    isFinalDecision,
    reviewer,
    level,
    current: { assignmentStatus },
  },
  thisReview,
  currentUserId,
}) => {
  const isConsolidation = level > 1 || isFinalDecision

  sections.forEach((section) => {
    const { totalReviewable, totalPendingReview, totalActive } = isConsolidation
      ? (section.consolidationProgress as ConsolidationProgress)
      : (section.reviewProgress as ReviewProgress)

    const isAssignedToCurrentUser = reviewer.id === currentUserId && totalReviewable > 0

    const isReviewable = (totalReviewable || 0) > 0

    const checkMethodProps = {
      isReviewable,
      isAssignedToCurrentUser,
      isFinalDecision,
      reviewLevel: level,
      reviewAssignmentStatus: assignmentStatus,
      isReviewExisting: !!thisReview,
      reviewStatus: thisReview?.current.reviewStatus,
      isPendingReview: (totalPendingReview || 0) > 0,
      isReviewActive: (totalActive || 0) > 0,
    }

    const foundAction = actionDefinitions.find(({ checkMethod }) => checkMethod(checkMethodProps))

    section.assignment = {
      isAssignedToCurrentUser,
      isReviewable,
      isConsolidation,
      action: foundAction ? foundAction.action : ReviewAction.unknown,
    }
  })
}

export default generateReviewSectionActions
