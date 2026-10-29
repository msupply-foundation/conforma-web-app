import { postRequest } from '../../../utils/helpers/fetchMethods'
import getServerUrl from '../../../utils/helpers/endpoints/endpointUrlBuilder'
import { ExtractionElement, ExtractionResult } from './types'

// Reading large documents can take a few minutes
const TIMEOUT_SECONDS = 300

export const extractAnswers = ({
  files,
  elements,
  applicationSerial,
  instructions,
}: {
  files: File[]
  elements: ExtractionElement[]
  applicationSerial: string
  instructions?: string
}): Promise<ExtractionResult> => {
  const body = new FormData()
  body.append('applicationSerial', applicationSerial)
  body.append('elements', JSON.stringify(elements))
  if (instructions) body.append('instructions', instructions)
  files.forEach((file) => body.append('file', file))

  return postRequest({ url: getServerUrl('aiExtract'), otherBody: body, timeout: TIMEOUT_SECONDS })
}
