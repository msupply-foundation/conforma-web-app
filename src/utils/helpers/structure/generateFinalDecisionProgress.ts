import {
  generateConsolidationValidity,
  generateConsolidatorResponsesProgress,
  generateReviewerResponsesProgress,
  generateReviewValidity,
} from '.'
import { FullStructure } from '../../types'

const generateFinalDecisionProgress = (newStructure: FullStructure) => {
  if (newStructure.assignment?.finalDecision?.decisionOnReview) {
    generateReviewerResponsesProgress(newStructure)
    generateReviewValidity(newStructure)
  } else {
    generateConsolidatorResponsesProgress(newStructure)
    generateConsolidationValidity(newStructure)
  }
}

export default generateFinalDecisionProgress
