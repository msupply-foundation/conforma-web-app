import React from 'react'
import { Grid, Label } from 'semantic-ui-react'
import getSimplifiedTimeDifference from '../../utils/dateAndTime/getSimplifiedTimeDifference'
import { ReviewAction, ReviewSectionComponentProps } from '../../utils/types'
import { useLanguageProvider } from '../../contexts/Localisation'

const ReviewSectionRowLastActionDate: React.FC<ReviewSectionComponentProps> = ({
  action,
  reviewStructure: {
    assignment,
    thisReview,
    info: {
      current: { timeStatusCreated },
    },
  },
}) => {
  const { t } = useLanguageProvider()
  const getContent = () => {
    switch (action) {
      case ReviewAction.unknown:
        return null
      case ReviewAction.canContinue: {
        return (
          <LastDate
            title={t('ACTION_DATE_REVIEW_STARTED')}
            indicator={getSimplifiedTimeDifference(thisReview?.current.timeStatusCreated)}
          />
        )
      }
      case ReviewAction.canStartReview: {
        return (
          <LastDate
            title={t('ACTION_DATE_ASSIGNED')}
            indicator={getSimplifiedTimeDifference(assignment?.assignmentDate)}
          />
        )
      }
      default:
        return (
          <LastDate
            title={t('LABEL_APPLICATION_SUBMITTED')}
            indicator={getSimplifiedTimeDifference(timeStatusCreated)}
          />
        )
    }
  }

  return <Grid.Column width={3}>{getContent()}</Grid.Column>
}

const LastDate: React.FC<{ title: string; indicator?: React.ReactNode }> = ({
  title,
  indicator,
}) => {
  return <Label className="simple-label" content={indicator} />
}

export default ReviewSectionRowLastActionDate
