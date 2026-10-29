import { ApolloClient, gql } from '@apollo/client'
import {
  ApplicationResponseFragmentFragmentDoc,
  ElementFragmentFragmentDoc,
} from '../../../utils/generated/graphql'

export interface ResponseUpdate {
  id: number
  value: object
  isValid: boolean | null
  evaluatedParameters: object
}

/**
 * Saves several responses in one request, as updateResponse does for one, so
 * Apollo updates its cache once and the application structure rebuilds once.
 */
export const writeResponses = async (
  client: ApolloClient<object>,
  updates: ResponseUpdate[],
  stageNumber: number
) => {
  const variableDefinitions = updates
    .map((_, i) => `$id${i}: Int!, $value${i}: JSON, $isValid${i}: Boolean, $parameters${i}: JSON`)
    .join(', ')
  const fields = updates
    .map(
      (_, i) => `
      response${i}: updateApplicationResponse(
        input: {
          id: $id${i}
          patch: {
            value: $value${i}
            isValid: $isValid${i}
            stageNumber: $stageNumber
            evaluatedParameters: $parameters${i}
          }
        }
      ) {
        applicationResponse {
          ...applicationResponseFragment
          templateElement {
            ...elementFragment
          }
        }
      }`
    )
    .join('\n')

  const mutation = gql`
    mutation aiDocumentFill($stageNumber: Int, ${variableDefinitions}) {
      ${fields}
    }
    ${ApplicationResponseFragmentFragmentDoc}
    ${ElementFragmentFragmentDoc}
  `

  const variables: Record<string, unknown> = { stageNumber }
  updates.forEach(({ id, value, isValid, evaluatedParameters }, i) => {
    variables[`id${i}`] = id
    variables[`value${i}`] = value
    variables[`isValid${i}`] = isValid
    variables[`parameters${i}`] = evaluatedParameters
  })

  await client.mutate({ mutation, variables })
}
