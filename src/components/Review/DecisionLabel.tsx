import React from 'react'
import { Icon } from 'semantic-ui-react'
import { ReviewResponse, ReviewResponseDecision } from '../../utils/generated/graphql'
import { useLanguageProvider } from '../../contexts/Localisation'
import getSimplifiedTimeDifference from '../../utils/dateAndTime/getSimplifiedTimeDifference'

interface DecisionLabelProps {
  isConsolidation: boolean
  isDecisionVisible: boolean
  reviewResponse: ReviewResponse
}

const useGetDecisionString = () => {
  const { t } = useLanguageProvider()
  const getDecisionString = (isPositiveDecision: boolean, isConsolidation: boolean) => {
    if (isConsolidation) {
      return isPositiveDecision
        ? t('LABEL_CONSOLIDATION_AGREEMENT')
        : t('LABEL_CONSOLIDATION_DISAGREEMENT')
    }

    return isPositiveDecision ? t('LABEL_REVIEW_APPROVED') : t('LABEL_REVIEW_DECLINED')
  }
  return getDecisionString
}

const DecisionLabel: React.FC<DecisionLabelProps> = ({
  isConsolidation,
  isDecisionVisible,
  reviewResponse,
}) => {
  const getDecisionString = useGetDecisionString()
  const isPositiveDecision =
    reviewResponse?.decision === ReviewResponseDecision.Agree ||
    reviewResponse?.decision === ReviewResponseDecision.Approve

  const decisionClass = isPositiveDecision ? 'positive-decision' : 'negative-decision'

  return (
    <div className="response-element-content">
      {isDecisionVisible && (
        <p className="secondary author-name">
          {reviewResponse.review?.reviewer?.firstName} {reviewResponse.review?.reviewer?.lastName}
        </p>
      )}
      <div className={`decision-container ${decisionClass}`}>
        {isDecisionVisible && (
          <h5 className="decision">{getDecisionString(isPositiveDecision, isConsolidation)}</h5>
        )}
        {!!reviewResponse?.comment && (
          <div className="comment-container">
            <Icon name="comment alternate outline" color="grey" />
            <p className="secondary">{reviewResponse.comment}</p>
            <p className="secondary date-indicator">
              <strong>{getSimplifiedTimeDifference(reviewResponse.timeUpdated)}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DecisionLabel
