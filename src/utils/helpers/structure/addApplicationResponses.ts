import { ApplicationResponse } from '../../generated/graphql'
import { FullStructure } from '../../types'

const addApplicationResponses = (
  structure: FullStructure,
  applicationResponses: ApplicationResponse[]
) => {
  const templateElementIsFirst: { [key: string]: boolean } = {}
  // Application response are ordered by timestamps, so we can be sure that second response with same templateElementId is previousApplicationResponse
  applicationResponses.forEach((applicationResponse) => {
    const templateElementId = applicationResponse?.templateElementId || ''
    const element = structure?.elementsById?.[templateElementId]
    // if templateElement id is not found in templateElementIsFirst object, it's the first one for templateElementId
    if (!(templateElementId in templateElementIsFirst)) {
      templateElementIsFirst[templateElementId] = true
      if (element) element.latestApplicationResponse = applicationResponse
      return
    }
    // Previous application response with same templateElementId was the first one, so this one is previousApplicationResponse
    if (templateElementIsFirst[templateElementId]) {
      // turn this one to false, to not match any further
      templateElementIsFirst[templateElementId] = false
      if (element) element.previousApplicationResponse = applicationResponse
    }
  })
}

export default addApplicationResponses
