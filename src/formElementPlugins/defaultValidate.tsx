import { EvaluatorNode, FigTreeOptions } from 'fig-tree-evaluator'
import { FigTree } from '../FigTreeEvaluator'
import { ValidationState } from './types'

const defaultValidate = async (
  validationExpress: EvaluatorNode,
  validationMessage: string,
  evaluatorParameters: FigTreeOptions
): Promise<ValidationState> => {
  if (
    !validationExpress ||
    (evaluatorParameters?.data as any)?.responses.thisResponse === undefined
  )
    return { isValid: true }
  try {
    const isValid = (await FigTree.evaluate(validationExpress, evaluatorParameters)) as boolean
    if (isValid) return { isValid }
    return { isValid, validationMessage }
  } catch (err) {
    console.warn('Error evaluating validation expression:', err)
    console.warn('Expression:', validationExpress)
    return { isValid: false, validationMessage }
  }
}

export default defaultValidate
