import evaluateExpression from '@openmsupply/expression-evaluator'
import {
  ApplicationElementStates,
  ElementState,
  ResponsesByCode,
  ResponsesFullByCode,
  TemplateElementState,
} from '../types'

interface evaluateElementExpressionsProps {
  elementsExpressions: TemplateElementState[]
  responsesByCode: ResponsesByCode
  responsesFullByCode: ResponsesFullByCode
}

interface EvaluationParameters {
  objects: (ResponsesByCode | ResponsesFullByCode)[]
}

async function evaluateElementExpressions({
  elementsExpressions,
  responsesByCode,
  responsesFullByCode,
}: evaluateElementExpressionsProps) {
  const evaluationParameters = {
    objects: [responsesByCode as ResponsesByCode, responsesFullByCode as ResponsesFullByCode], // TO-DO: Also send user/org objects etc.
    // graphQLConnection: TO-DO
  }

  const promiseArray: Promise<ElementState>[] = []
  elementsExpressions.forEach((element) => {
    promiseArray.push(evaluateSingleElement(element, evaluationParameters))
  })
  const evaluatedElements = await Promise.all(promiseArray)
  const elementsState: ApplicationElementStates = {}
  evaluatedElements.forEach((element) => {
    elementsState[element.code] = element
  })
  return elementsState
}

async function evaluateSingleElement(
  element: TemplateElementState,
  evaluationParameters: EvaluationParameters
): Promise<ElementState> {
  const isEditable = evaluateExpression(element.isEditable, evaluationParameters)
  const isRequired = evaluateExpression(element.isRequired, evaluationParameters)
  const isVisible = evaluateExpression(element.visibilityCondition, evaluationParameters)
  // TO-DO: Evaluate element paremeters (in 'parameters' field, but unique to each element type)
  const results = await Promise.all([isEditable, isRequired, isVisible])
  const evaluatedElement = {
    id: element.id,
    code: element.code,
    title: element.title,
    category: element.category,
    parameters: element.parameters,
    elementTypePluginCode: element.elementTypePluginCode,
    section: element.section as number,
    isEditable: results[0] as boolean,
    isRequired: results[1] as boolean,
    isVisible: results[2] as boolean,
  }
  return evaluatedElement
}

export default evaluateElementExpressions
