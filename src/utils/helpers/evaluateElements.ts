import evaluateExpression, { isEvaluationExpression } from '../../modules/expression-evaluator'
import functions from '../../containers/TemplateBuilder/evaluatorGui/evaluatorFunctions'
import getServerUrl from './endpoints/endpointUrlBuilder'
import config from '../../config'
import {
  EvaluatedElement,
  ResponsesByCode,
  User,
  ApplicationDetails,
  ElementForEvaluation,
  EvaluationOptions,
  EvaluatorNode,
} from '../types'

const graphQLEndpoint = getServerUrl('graphQL')

type PartialEvaluatedElement = Partial<EvaluatedElement>
type EvaluationObject = {
  responses?: ResponsesByCode
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
  initialValue: 'initialValueExpression',
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
  { responses, currentUser, applicationData }
) => {
  const JWT = localStorage.getItem(config.localStorageJWTKey)
  const evaluationParameters = {
    objects: {
      responses: { ...responses, thisResponse: responses?.[element.code]?.text },
      currentUser,
      applicationData,
      functions,
    },
    APIfetch: fetch,
    graphQLConnection: { fetch: fetch.bind(window), endpoint: graphQLEndpoint },
    headers: { Authorization: 'Bearer ' + JWT },
  }

  const evaluatedElement: PartialEvaluatedElement = {}

  const evaluateSingleExpression = async (
    expressionOrValue: EvaluatorNode,
    elementResultKey: keyof EvaluatedElement
  ) => {
    try {
      evaluatedElement[elementResultKey] = isEvaluationExpression(expressionOrValue)
        ? await evaluateExpression(expressionOrValue, evaluationParameters)
        : expressionOrValue
    } catch (e) {
      // console.log(e, expressionOrValue)
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
