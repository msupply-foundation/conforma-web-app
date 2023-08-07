import figTree, { EvaluatorNode } from '../components/FigTreeEvaluator'
import { ValidationState } from './types'

const defaultValidate = async (
  validationExpress: EvaluatorNode,
  validationMessage: string,
  data: { [key: string]: any } = {}
): Promise<ValidationState> => {
  if (!validationExpress || data?.responses.thisResponse === undefined) return { isValid: true }
  const isValid = (await figTree.evaluate(validationExpress, { data })) as boolean
  if (isValid) return { isValid }
  return { isValid, validationMessage }
}

export default defaultValidate
