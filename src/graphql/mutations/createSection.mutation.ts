import { gql } from '@apollo/client'

export default gql`
  mutation createSection($applicationId: Int!, $templateSectionId: Int!) {
    createApplicationSection(
      input: {
        applicationSection: { applicationId: $applicationId, templateSectionId: $templateSectionId }
      }
    ) {
      applicationSection {
        templateSection {
          id
          code
          title
        }
      }
    }
  }
`
