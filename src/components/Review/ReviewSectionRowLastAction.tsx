import React from 'react'
import { Grid } from 'semantic-ui-react'
import getSimplifiedTimeDifference from '../../utils/dateAndTime/getSimplifiedTimeDifference'
import { ReviewSectionComponentProps } from '../../utils/types'
import strings from '../../utils/constants'

const ReviewSectionRowLastDate: React.FC<ReviewSectionComponentProps> = ({
  action,
  thisReview,
  assignment,
}) => {
  const getContent = () => {
    switch (action) {
      case 'canContinue': {
        return (
          <p>{`${strings.REVIEW_STARTED}: ${getSimplifiedTimeDifference(
            thisReview?.timeStatusCreated
          )}`}</p>
        )
      }
      case 'canView': {
        return (
          <p>{`${strings.REVIEW_SUBMITTED}: ${getSimplifiedTimeDifference(
            thisReview?.timeStatusCreated
          )}`}</p>
        )
      }
      case 'canStartReview': {
        return (
          <p>{`${strings.ASSIGNED}: ${getSimplifiedTimeDifference(assignment.timeCreated)}`}</p>
        )
      }

      default:
        return null
    }
  }

  return <Grid.Column>{getContent()}</Grid.Column>
}

export default ReviewSectionRowLastDate
