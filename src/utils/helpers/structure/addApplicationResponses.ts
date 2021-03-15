import { ApplicationResponse } from '../../generated/graphql'
import { FullStructure } from '../../types'

const addApplicationResponses = (
  structure: FullStructure,
  applicationResponses: ApplicationResponse[]
) => {
  let templateElementId = 0
  let isFirst = false
  // Application response are ordered by timestamps, so we can be sure that second response with same templateElementId is previousApplicationResponse
  applicationResponses.forEach((applicationResponse) => {
    const element = structure?.elementsById?.[applicationResponse?.templateElementId || '']
    if (templateElementId !== applicationResponse.templateElementId) {
      isFirst = true
      templateElementId = applicationResponse.templateElementId as number
      // "value" is not available in element.response (at least not in the FullResponse type itself)
      // thus addition of latestApplicationResponse to be used in addChangeRequesStatusToElement
      if (element) element.latestApplicationResponse = applicationResponse
      return
    }
    // Previous application response with same templateElementId was the first one, so this one is previousApplicationResponse
    if (isFirst) {
      isFirst = false
      if (element) element.previousApplicationResponse = applicationResponse
    }
  })
}

export default addApplicationResponses
