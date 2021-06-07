import evaluateExpression, { isEvaluationExpression } from '@openmsupply/expression-evaluator'
import { IParameters } from '@openmsupply/expression-evaluator/lib/types'
import { ValueNode } from 'graphql'
import config from '../../config.json'
import {
  EvaluatedElement,
  ResponsesByCode,
  User,
  ApplicationDetails,
  ElementForEvaluation,
  EvaluationOptions,
  EvaluatorNode,
} from '../types'
const graphQLEndpoint = config.serverGraphQL

type PartialEvaluatedElement = Partial<EvaluatedElement>
type EvaluationObject = {
  responseObject?: ResponsesByCode
  currentUser?: User | null
  applicationData?: ApplicationDetails
}

type EvaluateElements = (
  elements: ElementForEvaluation[],
  evaluationOptions: EvaluationOptions,
  objects: EvaluationObject
) => Promise<PartialEvaluatedElement[]>

const evaluationMapping: { [resultKey in keyof EvaluatedElement]: keyof ElementForEvaluation } = {
  isEditable: 'isEditableExpression',
  isRequired: 'isRequiredExpression',
  isVisible: 'isVisibleExpression',
  isValid: 'validationExpression',
  evaluatedParameters: 'parametersExpressions',
  defaultValue: 'defaultValueExpression',
}

export const evaluateElements: EvaluateElements = async (elements, evaluationOptions, objects) => {
  const elementPromiseArray: Promise<PartialEvaluatedElement>[] = []
  elements.forEach((element) => {
    elementPromiseArray.push(evaluateSingleElement(element, evaluationOptions, objects))
  })
  return await Promise.all<PartialEvaluatedElement>(elementPromiseArray)
}

type EvaluateElement = (
  element: ElementForEvaluation,
  evaluationOptions: EvaluationOptions,
  objects: EvaluationObject
) => Promise<PartialEvaluatedElement>

const evaluateSingleElement: EvaluateElement = async (
  element,
  evaluationOptions,
  { responseObject, currentUser, applicationData }
) => {
  const evaluationParameters = {
    objects: {
      responses: { ...responseObject, thisResponse: responseObject?.[element.code]?.text },
      currentUser,
      applicationData,
    },
    APIfetch: fetch,
    graphQLConnection: { fetch: fetch.bind(window), endpoint: graphQLEndpoint },
  }

  const evaluatedElement: PartialEvaluatedElement = {}

  const evaluateSingleExpression = async (
    expressionOrValue: EvaluatorNode,
    elementResultKey: keyof EvaluatedElement
  ) => {
    if (typeof expressionOrValue === 'undefined') return

    if (elementResultKey === 'evaluatedParameters') {
      evaluatedElement[elementResultKey] = await evaluateParameters(
        expressionOrValue,
        evaluationParameters
      )
      return
    }

    try {
      evaluatedElement[elementResultKey] = isEvaluationExpression(expressionOrValue)
        ? await evaluateExpression(expressionOrValue, evaluationParameters)
        : expressionOrValue
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

  return evaluatedElement
}

type EvaluateParameters = (
  parameters: EvaluatorNode,
  evaluationParameters: IParameters | undefined
) => Promise<EvaluatorNode>

const evaluateParameters: EvaluateParameters = async (parameters, evaluationParameters) => {
  if (!parameters) return {}
  if (!(parameters instanceof Object)) return {}

  const resultParameters: { [parameter: string]: ValueNode } = {}

  const evaluations = Object.entries(parameters).map(async ([parameter, expressionOrValue]) => {
    if (typeof expressionOrValue === 'undefined') return
    try {
      resultParameters[parameter] = isEvaluationExpression(expressionOrValue)
        ? await evaluateExpression(expressionOrValue, evaluationParameters)
        : expressionOrValue
    } catch (e) {
      console.log(e, expressionOrValue)
    }
  })

  await Promise.all(evaluations)

  return resultParameters
}
