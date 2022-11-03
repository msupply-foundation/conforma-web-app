import { gql } from '@apollo/client'

export default gql`
  mutation updateResponse(
    $id: Int!
    $value: JSON
    $isValid: Boolean
    $stageNumber: Int
    $evaluatedParameters: JSON
  ) {
    updateApplicationResponse(
      input: {
        id: $id
        patch: {
          value: $value
          isValid: $isValid
          stageNumber: $stageNumber
          evaluatedParameters: $evaluatedParameters
        }
      }
    ) {
      applicationResponse {
        ...applicationResponseFragment
        templateElement {
          ...elementFragment
        }
      }
    }
  }
`
