import React, { CSSProperties } from 'react'
import { Grid, Icon, Label } from 'semantic-ui-react'
import strings from '../../utils/constants'
import { User } from '../../utils/generated/graphql'
import { ReviewAction, ReviewSectionComponentProps } from '../../utils/types'

const ReviewSectionRowAssigned: React.FC<ReviewSectionComponentProps> = ({
  isAssignedToCurrentUser,
  action,
  assignment,
}) => {
  const isSelfAssigned: boolean =
    action === ReviewAction.canStartReview || action === ReviewAction.canContinue
  const isReviewLocked: boolean =
    action === ReviewAction.canSelfAssignLocked || action === ReviewAction.canContinueLocked
  return (
    <Grid.Column>
      <div style={inlineStyle.container}>
        {isAssignedToCurrentUser && action === ReviewAction.canSelfAssign ? (
          <Label style={inlineStyle.yourAssignmentLabel} content={strings.LABEL_ASSIGNMENT_SELF} />
        ) : isSelfAssigned ? (
          <Label
            icon={<Icon name="circle" size="tiny" color="blue" />}
            style={inlineStyle.yourAssignmentLabel}
            content={strings.LABEL_ASSIGNED_TO_YOU}
          />
        ) : isReviewLocked ? (
          <Label
            icon={<Icon name="ban" size="small" />}
            style={inlineStyle.lockedAssignmentLabel}
            content={
              <>
                {strings.LABEL_ASSIGNMENT_LOCKED}
                <Reviewer user={assignment.reviewer} isCurrent={isAssignedToCurrentUser} />
              </>
            }
          />
        ) : (
          <Label
            style={inlineStyle.othersAssignmentLabel}
            content={
              <>
                {action === ReviewAction.canSelfAssign
                  ? strings.LABEL_ASSIGNMENT_AVAILABLE
                  : strings.LABEL_REVIEWED_BY}
                <Reviewer user={assignment.reviewer} isCurrent={isAssignedToCurrentUser} />
              </>
            }
          />
        )}
      </div>
    </Grid.Column>
  )
}

interface ReviewerProps {
  user?: User
  isCurrent: boolean
}

const Reviewer: React.FC<ReviewerProps> = ({ user, isCurrent }) => (
  <Label
    style={inlineStyle.reviewer(isCurrent)}
    content={
      isCurrent
        ? strings.REVIEW_FILTER_YOURSELF
        : `${user?.firstName || ''} ${user?.lastName || ''}`
    }
  />
)

// Styles - TODO: Move to LESS || Global class style (semantic)
const inlineStyle = {
  container: { display: 'flex', alignItems: 'center' } as CSSProperties,
  yourAssignmentLabel: {
    background: 'transparent',
    color: 'blue',
    fontWeight: 500,
    marginRight: 10,
  },
  lockedAssignmentLabel: {
    background: 'transparent',
    color: 'red',
    fontWeight: 500,
  },
  othersAssignmentLabel: {
    background: 'transparent',
    fontWeight: 500,
  },
  reviewer: (isCurrent: boolean) =>
    ({
      background: 'transparent',
      color: isCurrent ? 'rgb(120, 120, 120)' : 'rgb(82, 123,237)',
    } as CSSProperties),
}

export default ReviewSectionRowAssigned
