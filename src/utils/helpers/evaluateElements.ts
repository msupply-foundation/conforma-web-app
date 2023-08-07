import figTree from '../../components/FigTreeEvaluator'
import {
  EvaluatedElement,
  ResponsesByCode,
  User,
  ApplicationDetails,
  ElementForEvaluation,
  EvaluationOptions,
  EvaluatorNode,
} from '../types'

type PartialEvaluatedElement = Partial<EvaluatedElement>
type EvaluationData = {
  responses?: ResponsesByCode
  currentUser?: User | null
  applicationData?: ApplicationDetails
}

type EvaluateElements = (
  elements: ElementForEvaluation[],
  evaluationOptions: EvaluationOptions,
  data: EvaluationData
) => Promise<PartialEvaluatedElement[]>

const evaluationMapping: { [resultKey in keyof EvaluatedElement]: keyof ElementForEvaluation } = {
  isEditable: 'isEditableExpression',
  isRequired: 'isRequiredExpression',
  isVisible: 'isVisibleExpression',
  isValid: 'validationExpression',
  initialValue: 'initialValueExpression',
}

export const evaluateElements: EvaluateElements = async (elements, evaluationOptions, data) => {
  const elementPromiseArray: Promise<PartialEvaluatedElement>[] = []
  elements.forEach((element) => {
    elementPromiseArray.push(evaluateSingleElement(element, evaluationOptions, data))
  })
  return await Promise.all<PartialEvaluatedElement>(elementPromiseArray)
}

type EvaluateElement = (
  element: ElementForEvaluation,
  evaluationOptions: EvaluationOptions,
  data: { [key: string]: any }
) => Promise<PartialEvaluatedElement>

const evaluateSingleElement: EvaluateElement = async (element, evaluationOptions, data) => {
  const evaluatedElement: PartialEvaluatedElement = {}

  const evaluateSingleExpression = async (
    expressionOrValue: EvaluatorNode,
    elementResultKey: keyof EvaluatedElement
  ) => {
    try {
      evaluatedElement[elementResultKey] = figTree.evaluate(expressionOrValue, { data })
    } catch (e) {
      console.log(e, expressionOrValue)
    }
  }

  const evaluations = evaluationOptions.map((evaluationResultKey) => {
    const elementExpressionKey = evaluationMapping[evaluationResultKey]
    const evaluationExpression = element[elementExpressionKey]

    return evaluateSingleExpression(evaluationExpression, evaluationResultKey)
  })

  await Promise.all(evaluations)

  console.log('evaluatedElement', evaluatedElement)

  return evaluatedElement
}
