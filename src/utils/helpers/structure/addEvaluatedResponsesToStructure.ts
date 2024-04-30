import { ApplicationResponse, ReviewResponse } from '../../generated/graphql'
import {
  FullStructure,
  PageElement,
  User,
  ElementForEvaluation,
  EvaluationOptions,
  PageType,
} from '../../types'
import { evaluateElements } from '../evaluateElements'

const addEvaluatedResponsesToStructure = async ({
  structure,
  applicationResponses,
  currentUser,
  currentPageType,
  evaluationOptions,
}: {
  structure: FullStructure
  applicationResponses: ApplicationResponse[]
  currentUser: User | null
  currentPageType: PageType
  evaluationOptions: EvaluationOptions
}) => {
  const newStructure = { ...structure } // This MIGHT need to be deep-copied

  // Build responses by code (and only keep latest)
  const responses: any = {}
  const reviewResponses: { [templateElementId: string]: ReviewResponse } = {}

  applicationResponses?.forEach((response) => {
    const {
      id,
      isValid,
      value,
      templateElement,
      templateElementId,
      timeUpdated,
      evaluatedParameters,
    } = response
    const code = templateElement?.code as string
    if (!(code in responses) || timeUpdated > responses[code].timeCreated) {
      responses[code] = {
        id,
        isValid,
        timeUpdated,
        evaluatedParameters,
        ...value,
      }

      if (response.reviewResponses.nodes.length === 0) return
      if (!templateElementId) return
      // Responses should be orderd by timestamp in GraphQL query
      reviewResponses[templateElementId] = response.reviewResponses.nodes[0] as ReviewResponse
    }
  })

  const flattenedElements = flattenStructureElements(newStructure)

  // Note: Flattened elements are evaluated IN-PLACE, so structure can be
  // updated with evaluated elements and responses without re-building
  // structure
  const results = await evaluateElements(
    flattenedElements.map((elem: PageElement) => elem.element as ElementForEvaluation),
    evaluationOptions,
    {
      responses,
      currentUser,
      applicationData: { ...structure.info, currentPageType },
    }
  )

  results.forEach((evaluatedElement, index) => {
    const flattenedElement = flattenedElements[index]
    const { element } = flattenedElement
    flattenedElement.element = { ...element, ...evaluatedElement }
    flattenedElement.response = responses[element.code]

    if (!flattenedElement.response) return

    if (typeof evaluatedElement.isValid != undefined) {
      flattenedElement.response.isValid = evaluatedElement.isValid
    }

    flattenedElement.response.reviewResponse = reviewResponses[flattenedElement.element.id]
  })
  newStructure.responsesByCode = responses
  return newStructure
}

const flattenStructureElements = (structure: FullStructure) => {
  const flattened: PageElement[] = []
  Object.keys(structure.sections).forEach((section) => {
    Object.keys(structure.sections[section].pages).forEach((page) => {
      flattened.push(...structure.sections[section].pages[Number(page)].state)
    })
  })
  return flattened
}

export default addEvaluatedResponsesToStructure
