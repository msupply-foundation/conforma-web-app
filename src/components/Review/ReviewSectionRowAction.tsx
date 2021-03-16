import React from 'react'
import { Link } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'
import { ReviewAction, ReviewSectionComponentProps } from '../../utils/types'
import strings from '../../utils/constants'

const ReviewSectionRowAction: React.FC<ReviewSectionComponentProps> = ({
  action,
  section: { details },
  isAssignedToCurrentUser,
  thisReview,
}) => {
  const {
    location: { pathname },
  } = useRouter()

  const reviewPath = `${pathname}/${thisReview?.id}`
  const reviewSectionLink = `${reviewPath}?activeSections=${details.code}`

  const getContent = () => {
    switch (action) {
      case ReviewAction.canContinue: {
        if (isAssignedToCurrentUser) return <Link to={reviewSectionLink}>{strings.CONTINUE}</Link>

        return <p>In Review</p>
      }
      case ReviewAction.canView: {
        if (isAssignedToCurrentUser) return <Link to={`${reviewSectionLink}`}>{strings.VIEW}</Link>
        else return <Link to={`${reviewSectionLink}`}>{strings.VIEW}</Link>
      }

      case ReviewAction.canStartReview: {
        if (isAssignedToCurrentUser) return strings.START

        return null
      }
      default:
        return null
    }
  }

  return <Grid.Column textAlign="right">{getContent()}</Grid.Column>
}

export default ReviewSectionRowAction
