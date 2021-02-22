import { useState, useEffect } from 'react'
import { FullStructure, ResponsesByCode } from '../types'
import {
  Application,
  ApplicationResponse,
  ApplicationSection,
  Template,
  TemplateElement,
  TemplateStage,
  useGetAllResponsesQuery,
} from '../generated/graphql'

const useGetFullApplicationStructure = (structure: FullStructure) => {
  const {
    info: { serial },
  } = structure
  const [fullStructure, setFullStructure] = useState<FullStructure>()
  const [responsesByCode, setResponsesByCode] = useState<ResponsesByCode>({})
  const [isLoading, setIsLoading] = useState(true)

  const newStructure = { ...structure } // This MIGHT need to be deep-copied

  console.log('New Structure', newStructure)

  console.log('Serial', serial)

  const networkFetch = true
  const { data, error, loading } = useGetAllResponsesQuery({
    variables: {
      serial,
    },
    skip: !serial,
    // To-do: figure out why "network-only" throws error
    fetchPolicy: networkFetch ? 'no-cache' : 'cache-first',
  })
  interface ResponseObject {
    [key: string]: any
  }

  useEffect(() => {
    if (!data) return

    const responseObject: ResponseObject = {}
    const responseArray = data?.applicationBySerial?.applicationResponses?.nodes
    // Build responses by code (and only keep latest)

    responseArray?.forEach((response: any) => {
      const {
        id,
        isValid,
        value,
        templateElement: { code },
        timeCreated,
      } = response
      if (!(code in responseObject) || timeCreated > responseObject?.[code]?.timeCreated)
        responseObject[code] = {
          id,
          isValid,
          timeCreated,
          ...value,
        }
    })

    console.log('Responses', responseObject)

    const flattenedElements = flattenStructureElements(newStructure)

    console.log('Flattened', flattenedElements)

    setResponsesByCode(responseObject)
  }, [data])

  return { fullStructure: 'Just for now', error: false, isLoading: false, responsesByCode: 'Temp' }
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
