import deepEqual from 'deep-equal'
import { ReviewResponseDecision } from '../../generated/graphql'
import { FullStructure } from '../../types'

const addApplicantChangeRequestStatusToElement = (structure: FullStructure) => {
  Object.values(structure?.elementsById || {}).forEach((element) => {
    const { latestApplicationResponse, previousApplicationResponse } = element
    const latestReviewResponse = latestApplicationResponse?.reviewResponses?.nodes[0]
    const previousReviewResponse = previousApplicationResponse?.reviewResponses?.nodes[0]

    // latest response would be declined when application is not restarted yet
    if (latestReviewResponse?.decision === ReviewResponseDecision.Decline) {
      element.isChangeRequest = true
      element.isChanged = false
      return
    }
    // Since we duplicate application responses, in order to tell if it's changed we
    // compare with previous one
    if (previousReviewResponse?.decision === ReviewResponseDecision.Decline) {
      element.isChangeRequest = true
      element.isChanged = deepEqual(
        latestApplicationResponse.value,
        previousApplicationResponse.value
      )
    }
  })
}

export default addApplicantChangeRequestStatusToElement
