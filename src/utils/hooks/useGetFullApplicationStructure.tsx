import { useState, useEffect } from 'react'
import {
  ElementState,
  FullStructure,
  PageElement,
  ResponseFull,
  ResponsesByCode,
  TemplateElementState,
} from '../types'
import { useGetAllResponsesQuery } from '../generated/graphql'
import { useUserState } from '../../contexts/UserState'
import evaluateExpression from '@openmsupply/expression-evaluator'

const useGetFullApplicationStructure = (structure: FullStructure) => {
  const {
    info: { serial },
  } = structure
  const {
    userState: { currentUser },
  } = useUserState()
  const [fullStructure, setFullStructure] = useState<FullStructure>()
  const [responsesByCode, setResponsesByCode] = useState<ResponsesByCode>({})
  const [isLoading, setIsLoading] = useState(true)

  const newStructure = { ...structure } // This MIGHT need to be deep-copied

  const networkFetch = true // To-DO: make this conditional
  const { data, error, loading } = useGetAllResponsesQuery({
    variables: {
      serial,
    },
    skip: !serial,
    // To-do: figure out why "network-only" throws error
    fetchPolicy: networkFetch ? 'no-cache' : 'cache-first',
  })
  interface ResponseObject {
    [key: string]: ResponseFull
  }

  useEffect(() => {
    if (!data) return
    setIsLoading(true)

    // Build responses by code (and only keep latest)
    const responseObject: any = {}
    const responseArray = data?.applicationBySerial?.applicationResponses?.nodes
    responseArray?.forEach((response: any) => {
      const {
        id,
        isValid,
        value,
        templateElement: { code },
        timeCreated,
      } = response
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
    // structure again
    evaluateElements(flattenedElements.map((elem: PageElement) => elem.element)).then((result) => {
      result.forEach((evaluatedElement, index) => {
        flattenedElements[index].element = evaluatedElement
        flattenedElements[index].response = responseObject[evaluatedElement.code]
      })
      setFullStructure(newStructure)
      setResponsesByCode(responseObject)
      setIsLoading(false)
    })
  }, [data])

  async function evaluateElements(elements: TemplateElementState[]) {
    const promiseArray: Promise<ElementState>[] = []
    elements.forEach((element) => {
      promiseArray.push(evaluateSingleElement(element))
    })
    return await Promise.all(promiseArray)
  }

  async function evaluateSingleElement(element: TemplateElementState): Promise<ElementState> {
    const evaluationParameters = {
      objects: { responses: responsesByCode, currentUser },
      // TO-DO: Also send org objects etc.
      // graphQLConnection: TO-DO
    }
    const isEditable = evaluateExpression(element.isEditable, evaluationParameters)
    const isRequired = evaluateExpression(element.isRequired, evaluationParameters)
    const isVisible = evaluateExpression(element.visibilityCondition, evaluationParameters)
    const results = await Promise.all([isEditable, isRequired, isVisible])
    const evaluatedElement = {
      ...element,
      isEditable: results[0] as boolean,
      isRequired: results[1] as boolean,
      isVisible: results[2] as boolean,
    }
    return evaluatedElement
  }

  return { fullStructure, error, isLoading: loading || isLoading, responsesByCode }
}

export default useGetFullApplicationStructure

const flattenStructureElements = (structure: FullStructure) => {
  const flattened: any = []
  Object.keys(structure.sections).forEach((section) => {
    Object.keys(structure.sections[section].pages).forEach((page) => {
      flattened.push(...structure.sections[section].pages[page].state)
    })
  })
  return flattened
}
