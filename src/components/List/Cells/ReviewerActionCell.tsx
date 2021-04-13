import React, { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Label } from 'semantic-ui-react'
import { CellProps } from '../../../utils/types'
import strings from '../../../utils/constants'

const ReviewerActionCell: React.FC<CellProps> = ({
  application: {
    reviewAssignedNotStartedCount,
    reviewAssignedCount,
    reviewDraftCount,
    reviewPendingCount,
    reviewSubmittedCount,
    reviewAvailableForSelfAssignmentCount,
    serial,
    assignCount,
    isFullyAssignedLevel1,
  },
}) => {
  const actions = []
  const not0 = (num: number | undefined) => num && Number(num) !== 0
  let canShowView = not0(reviewAssignedCount) || not0(reviewSubmittedCount)
  let canShowStart = not0(reviewAssignedNotStartedCount)

  if (not0(reviewPendingCount)) {
    canShowView = canShowStart = false
    actions.push(strings.ACTION_RE_REVIEW)
  }

  if (not0(reviewDraftCount)) {
    canShowView = false
    actions.push(strings.ACTION_CONTINUE)
  }

  if (not0(reviewAvailableForSelfAssignmentCount)) {
    canShowView = false
    actions.push(strings.ACTION_SELF_ASSIGN)
  }

  if (not0(assignCount) && isFullyAssignedLevel1) {
    canShowView = false
    actions.push(strings.ACTION_RE_ASSIGN)
  }

  if (not0(assignCount) && !isFullyAssignedLevel1) {
    canShowView = false
    actions.push(strings.ACTION_ASSIGN)
  }

  if (canShowStart) actions.push(strings.ACTION_START)
  else if (canShowView) actions.push(strings.ACTION_VIEW)

  return (
    <>
      {actions.map((action, index) => {
        return (
          <>
            {index > 0 ? <Label style={inlineStyles.actions}>{' | '}</Label> : ''}
            <Link key={index} style={inlineStyles.link} to={`/application/${serial}/review`}>
              {action}
            </Link>
          </>
        )
      })}
    </>
  )
}

// Styles - TODO: Move to LESS || Global class style (semantic)
const inlineStyles = {
  actions: { color: '#003BFE', background: 'transparent', fontWeight: 100 } as CSSProperties,
  link: { color: '#003BFE', fontWeight: 400, letterSpacing: 1 } as CSSProperties,
}

export default ReviewerActionCell
