import {
  generateConsolidationValidity,
  generateConsolidatorResponsesProgress,
  generateReviewerResponsesProgress,
  generateReviewValidity,
} from '.'
import { FullStructure } from '../../types'

const generateFinalDecisionProgress = (newStructure: FullStructure) => {
  if (newStructure.assignment?.isMakeDecisionOnConsolidation) {
    generateConsolidatorResponsesProgress(newStructure)
    generateConsolidationValidity(newStructure)
  } else {
    generateReviewerResponsesProgress(newStructure)
    generateReviewValidity(newStructure)
  }
}

export default generateFinalDecisionProgress
