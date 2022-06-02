import React from 'react'
import { Label, Progress } from 'semantic-ui-react'
import { ApplicationProgress, ConsolidationProgress, ReviewProgress } from '../../utils/types'
import { useLanguageProvider } from '../../contexts/Localisation'

interface SectionProgressBarProps {
  consolidationProgress?: ConsolidationProgress
  reviewProgress?: ReviewProgress
}

/**
 * Application
 */

const ApplicationProgressBar: React.FC<ApplicationProgress> = (applicationProgress) => {
  const { getApplicationProgressTitle } = useHelpers()
  const { doneRequired, doneNonRequired, totalSum, valid } = applicationProgress
  const totalDone = doneRequired + doneNonRequired
  const progressLabel = getApplicationProgressTitle(applicationProgress)
  return totalDone > 0 && totalSum > 0 ? (
    <div className="progress-box">
      {progressLabel && <Label size="tiny" className="simple-label" content={progressLabel} />}
      <Progress
        className="progress"
        percent={(100 * totalDone) / totalSum}
        size="tiny"
        success={valid}
        error={!valid}
      />
    </div>
  ) : null
}

/**
 * Consolidation
 */

const ConsolidationSectionProgressBar: React.FC<SectionProgressBarProps> = (props) => {
  const { getConsolidationProgressDefaults, getConsolidationProgressTitle } = useHelpers()
  const {
    doneAgreeNonConform,
    doneAgreeConform,
    doneDisagree,
    totalActive
  } = getConsolidationProgressDefaults(props)
  const progressLabel = getConsolidationProgressTitle(props)
  return (
    <div className="progress-box">
      {progressLabel && (
        <Label size="tiny" className="simple-label">
          <em>{progressLabel}</em>
        </Label>
      )}
      <Progress
        className="progress"
        percent={
          // See generateConsolidationValidity for explannation on this change
          (100 * (doneAgreeNonConform + doneAgreeConform + doneDisagree)) / totalActive
        }
        size="tiny"
        success={doneDisagree === 0}
        error={doneDisagree > 0}
      />
    </div>
  )
}

/**
 * Review
 */

const ReviewSectionProgressBar: React.FC<SectionProgressBarProps> = (props) => {
  const { getReviewProgressDefaults, getReviewProgressTitle } = useHelpers()
  const { doneNonConform, doneConform, totalReviewable } = getReviewProgressDefaults(props)
  const progressLabel = getReviewProgressTitle(props)
  return (
    <div className="progress-box">
      {progressLabel && (
        <Label size="tiny" className="simple-label">
          <em>{progressLabel}</em>
        </Label>
      )}
      <Progress
        className="progress"
        percent={(100 * (doneConform + doneNonConform)) / totalReviewable}
        size="tiny"
        success={doneNonConform === 0}
        error={doneNonConform > 0}
      />
    </div>
  )
}

// Hook to provide helper methods to the above components
const useHelpers = () => {
  const { strings } = useLanguageProvider()

  const getApplicationProgressTitle = ({ completed, valid }: ApplicationProgress) => {
    if (!valid) return strings.LABEL_SECTION_PROBLEM
    else if (completed) return strings.LABEL_SECTION_COMPLETED
    return null
  }

  const getConsolidationProgressDefaults = ({
    consolidationProgress,
  }: SectionProgressBarProps) => ({
    doneAgreeNonConform: consolidationProgress?.doneAgreeNonConform || 0,
    doneAgreeConform: consolidationProgress?.doneAgreeConform || 0,
    doneDisagree: consolidationProgress?.doneDisagree || 0,
    totalReviewable: consolidationProgress?.totalReviewable || 0,
    totalPendingReview: consolidationProgress?.totalPendingReview || 0,
    totalActive: consolidationProgress?.totalActive || 0,
  })

  const getConsolidationProgressTitle = (props: SectionProgressBarProps) => {
    const { doneAgreeNonConform, doneAgreeConform, doneDisagree } =
      getConsolidationProgressDefaults(props)
    const totalAgree = doneAgreeConform + doneAgreeNonConform
    if (doneDisagree > 0) {
      let disagreementLabel = `(${doneDisagree}) ${strings.LABEL_CONSOLIDATION_DISAGREEMENT}`
      if (totalAgree > 0)
        disagreementLabel += ` (${totalAgree}) ${strings.LABEL_CONSOLIDATION_AGREEMENT}`
      return disagreementLabel
    }

    if (totalAgree > 0)
      return `(${doneAgreeConform}) ${strings.LABEL_REVIEW_APPROVED} (${doneAgreeNonConform}) ${strings.LABEL_REVIEW_DECLINED}`
    return null
  }

  const getReviewProgressDefaults = ({ reviewProgress }: SectionProgressBarProps) => ({
    doneNonConform: reviewProgress?.doneNonConform || 0,
    doneConform: reviewProgress?.doneConform || 0,
    totalReviewable: reviewProgress?.totalReviewable || 0,
  })

  const getReviewProgressTitle = (props: SectionProgressBarProps) => {
    const { doneNonConform, doneConform, totalReviewable } = getReviewProgressDefaults(props)
    if (doneNonConform > 0) return `(${doneNonConform}) ${strings.LABEL_REVIEW_DECLINED}`
    else if (doneConform === totalReviewable) return strings.LABEL_SECTION_COMPLETED
    return null
  }
  return {
    getApplicationProgressTitle,
    getConsolidationProgressDefaults,
    getConsolidationProgressTitle,
    getReviewProgressDefaults,
    getReviewProgressTitle,
  }
}

export { ApplicationProgressBar, ConsolidationSectionProgressBar, ReviewSectionProgressBar }
