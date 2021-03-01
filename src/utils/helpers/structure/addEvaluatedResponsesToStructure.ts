import evaluateExpression from '@openmsupply/expression-evaluator'
import { IQueryNode } from '@openmsupply/expression-evaluator/lib/types'
import { ApplicationResponse } from '../../generated/graphql'
import {
  ElementStateNEW,
  EvaluatorParameters,
  FullStructure,
  PageElement,
  ResponsesByCode,
  TemplateElementStateNEW,
  User,
} from '../../types'

type EvaluationOptions = {
  isRequired: boolean
  isVisible: boolean
  isEditable: boolean
  isValid: boolean
}

const evaluationMapping = {
  isEditable: 'isEditableExpression',
  isRequired: 'isRequiredExpression',
  isVisible: 'isVisibleExpression',
  isValid: 'validationExpression',
}

const addEvaluatedResponsesToStructure = async ({
  structure,
  applicationResponses,
  currentUser,
  evaluationOptions,
}: {
  structure: FullStructure
  applicationResponses: ApplicationResponse[]
  currentUser: User | null
  evaluationOptions: EvaluationOptions
}) => {
  const newStructure = { ...structure } // This MIGHT need to be deep-copied

  // Build responses by code (and only keep latest)
  const responseObject: any = {}

  applicationResponses?.forEach((response) => {
    const { id, isValid, value, templateElement, timeCreated } = response
    const code = templateElement?.code as string
    if (!(code in responseObject) || timeCreated > responseObject[code].timeCreated)
      responseObject[code] = {
        id,
        isValid,
        timeCreated,
        ...value,
      }
  })

  const flattenedElements = flattenStructureElements(newStructure)

  // Note: Flattened elements are evaluated IN-PLACE, so structure can be
  // updated with evaluated elements and responses without re-building
  // structure
  const results = await evaluateAndValidateElements(
    flattenedElements.map((elem: PageElement) => elem.element),
    responseObject,
    currentUser,
    evaluationOptions
  )
  results.forEach((evaluatedElement, index) => {
    flattenedElements[index].element = evaluatedElement
    flattenedElements[index].response = responseObject[evaluatedElement.code]
  })
  newStructure.responsesByCode = responseObject
  return newStructure
}

async function evaluateAndValidateElements(
  elements: TemplateElementStateNEW[],
  responseObject: ResponsesByCode,
  currentUser: User | null,
  evaluationOptions: EvaluationOptions
) {
  const elementPromiseArray: Promise<ElementStateNEW>[] = []
  elements.forEach((element) => {
    elementPromiseArray.push(
      evaluateSingleElement(element, responseObject, currentUser, evaluationOptions)
    )
  })
  return await Promise.all(elementPromiseArray)
}

const evaluateExpressionWithFallBack = (
  expression: IQueryNode,
  evaluationParameters: EvaluatorParameters,
  fallBackValue: any
) =>
  new Promise(async (resolve) => {
    try {
      resolve(await evaluateExpression(expression, evaluationParameters))
    } catch (e) {
      console.log(e)
      resolve(fallBackValue)
    }
  })

async function evaluateSingleElement(
  element: TemplateElementStateNEW,
  responseObject: ResponsesByCode,
  currentUser: User | null,
  evaluationOptions: EvaluationOptions
): Promise<ElementStateNEW> {
  const evaluationParameters = {
    objects: {
      responses: { ...responseObject, thisResponse: responseObject?.[element.code]?.text },
      currentUser,
    },
    APIfetch: fetch,
    // TO-DO: Also send org objects etc.
    // graphQLConnection: TO-DO
  }

  const evaluationKeys = Object.keys(evaluationMapping).filter(
    (evaluationKey) => evaluationOptions[evaluationKey as keyof EvaluationOptions]
  )

  const evaluations = evaluationKeys.map((evaluationKey) => {
    const elementKey = evaluationMapping[evaluationKey as keyof EvaluationOptions]
    const evaluationExpression = element[elementKey as keyof TemplateElementStateNEW]

    return evaluateExpressionWithFallBack(evaluationExpression, evaluationParameters, true)
  })

  const results = (await Promise.all(evaluations)) as any
  const evaluatedElement: { [key: string]: any } = {}

  evaluationKeys.forEach((evaluationKey, index) => {
    if (evaluationKey !== 'isValid') {
      evaluatedElement[evaluationKey] = results[index]
      return
    }
    // TODO maybe it's better to not mutate responseObject but add element.isValid
    if (responseObject[element.code]) responseObject[element.code].isValid = results[index]
  })

  const elementBase = {
    isEditable: true,
    isVisible: true,
    isRequired: true,
  }
  return { ...element, ...elementBase, ...evaluatedElement }
}

const flattenStructureElements = (structure: FullStructure) => {
  const flattened: any = []
  Object.keys(structure.sections).forEach((section) => {
    Object.keys(structure.sections[section].pages).forEach((page) => {
      flattened.push(...structure.sections[section].pages[Number(page)].state)
    })
  })
  return flattened
}

export default addEvaluatedResponsesToStructure
