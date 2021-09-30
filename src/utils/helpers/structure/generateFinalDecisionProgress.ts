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
    newStructure.sortedSections?.forEach((section) =>
      console.log(section.details.code, section.reviewProgress)
    )
  } else {
    generateConsolidatorResponsesProgress(newStructure)
    generateConsolidationValidity(newStructure)
    newStructure.sortedSections?.forEach((section) =>
      console.log(section.details.code, section.consolidationProgress)
    )
  }
}

export default generateFinalDecisionProgress
