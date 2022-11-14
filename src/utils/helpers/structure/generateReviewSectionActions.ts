import { ReviewStatus, ReviewAssignmentStatus } from '../../generated/graphql'
import {
  SectionState,
  ReviewAssignment,
  ReviewDetails,
  ReviewAction,
  ConsolidationProgress,
  ReviewProgress,
} from '../../types'

type GenerateSectionActions = (props: {
  sections: SectionState[]
  thisReview?: ReviewDetails | null
  reviewAssignment: ReviewAssignment
  currentUserId: number
}) => void

type ActionDefinition = {
  action: ReviewAction
  checkMethod: (props: {
    reviewLevel: number
    isReviewable: boolean
    isAssignedToCurrentUser: boolean
    isMakeDecision: boolean
    reviewAssignmentStatus: ReviewAssignmentStatus | null
    isSecondReview: boolean
    isPendingReview: boolean
    isReviewExisting: boolean
    reviewStatus: ReviewStatus | undefined
    isReviewActive: boolean
    isSelfAssignable: boolean
  }) => boolean
}

const actionDefinitions: ActionDefinition[] = [
  {
    action: ReviewAction.canMakeDecision,
    checkMethod: ({ reviewAssignmentStatus, isMakeDecision, isReviewExisting }) =>
      reviewAssignmentStatus === ReviewAssignmentStatus.Assigned &&
      !isReviewExisting &&
      isMakeDecision,
  },
  {
    action: ReviewAction.canStartReview,
    checkMethod: ({ reviewAssignmentStatus, isPendingReview, isReviewExisting }) =>
      reviewAssignmentStatus === ReviewAssignmentStatus.Assigned &&
      !isReviewExisting &&
      isPendingReview,
  },
  {
    // Show "start" when is new review submitted to consolidation (even for partial reviews)
    action: ReviewAction.canStartReview,
    checkMethod: ({ reviewStatus, reviewLevel, isSecondReview, isPendingReview }) =>
      reviewStatus === ReviewStatus.Pending &&
      reviewLevel > 1 &&
      !isSecondReview &&
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
    checkMethod: ({ reviewStatus }) => reviewStatus === ReviewStatus.Discontinued,
  },
  {
    action: ReviewAction.canSelfAssign,
    checkMethod: ({ reviewAssignmentStatus, isSelfAssignable }) =>
      reviewAssignmentStatus === ReviewAssignmentStatus.Available && isSelfAssignable,
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
    assignee,
    assigneeLevel,
    assignedSections,
    isMakeDecision,
    isMakeDecisionOnConsolidation,
    assignmentStatus,
    isSelfAssignable,
  },
  thisReview,
  currentUserId,
}) => {
  const isConsolidation = assigneeLevel > 1 || (isMakeDecision && isMakeDecisionOnConsolidation)

  sections.forEach((section) => {
    const { totalReviewable, totalPendingReview, totalActive } = isConsolidation
      ? (section.consolidationProgress as ConsolidationProgress)
      : (section.reviewProgress as ReviewProgress)

    const totalNewReviewable = section?.consolidationProgress?.totalNewReviewable

    const isReviewable =
      (totalReviewable || 0) > 0 &&
      assignmentStatus === ReviewAssignmentStatus.Assigned &&
      assignedSections.includes(section.details.code)

    const isAssignedToCurrentUser =
      assignee?.id === currentUserId && (isReviewable || isMakeDecision)

    const checkMethodProps = {
      isReviewable,
      isAssignedToCurrentUser,
      isMakeDecision: !!isMakeDecision,
      reviewLevel: assigneeLevel,
      reviewAssignmentStatus: assignmentStatus,
      isReviewExisting: !!thisReview,
      reviewStatus: thisReview?.current.reviewStatus,
      isSecondReview: (totalNewReviewable || 0) > 0,
      isPendingReview: (totalPendingReview || 0) > 0,
      isReviewActive: (totalActive || 0) > 0,
      isSelfAssignable,
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
